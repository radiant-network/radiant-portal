{{ config(
    materialized='view',
    tags=['pcx_30', 'combined', 'phi']
) }}

-- Combined identified + de-identified systemic therapy in ONE relation.
--
-- CONTAINS PHI (mrn + calendar regimen dates alongside research_id). Internal use only.
--
-- Field pairing rule: identical columns appear once; differing columns appear twice,
-- adjacent, identified value first.
--   mrn                / research_id
--   regimen_start_date / age_at_regimen_start_days
--   regimen_stop_date  / age_at_regimen_stop_days
--
-- NOTE: age_at_chemo_start/stop are varchar and carry 'Not Reported', 'Not Available'
-- and 'Not Applicable' for unknowns. cast(... as int) yields NULL for those, so the
-- paired calendar date is NULL -- matching pcx_30_medical_therapy_level.
--
-- is_initial_treatment: 'yes' when the regimen started on or after the
-- initial-diagnosis event and on or before the first SUBSEQUENT disease event, i.e.
-- frontline therapy for the initial tumour rather than therapy for a
-- progression/recurrence. Logic is BYTE-IDENTICAL to
-- pcx_30_medical_therapy_level_deid -- change both together until the shared
-- int_pcx_30_initial_events consolidation lands.
--
-- 'no' CONFLATES "not frontline" WITH "cannot tell" (decided 2026-10-01: document
-- rather than add an 'unknown' third value). Measured on the 2026-10-01 build, of
-- 535 'no' rows: 372 (182 pts) genuine, 145 (119 pts) start age is one of the
-- sentinel strings above so cast() -> NULL -> between -> NULL -> 'no', and 18 (7 pts)
-- have no Initial event to anchor on. So ~30% of 'no' is an unavailable SOURCE
-- presented as a clinical NEGATIVE; do not count non-frontline regimens off this
-- column without excluding cast(age_at_chemo_start as int) is null.
--
-- PHASE 3: the cohort roster and the frontline-window anchors are now refs to
-- int_pcx_30_cohort_roster and int_pcx_30_initial_events, shared with
-- pcx_30_medical_therapy_level_deid and the radiation/surgery views. The source
-- headers instructed the reader to keep the initial_events CTE "byte-identical"
-- across five objects by hand; one model now makes that structural.
--
-- Derived from combined_views/chemotherapy_combined_view.sql (file name differs from
-- the view name -- the view name is the contract), plus the two columns and the quote
-- strip that file was missing relative to the deployed view.

with treatment as (
    select
        t.*,
        -- QUOTE STRIP -- see pcx_30_medical_therapy_level_deid for the full rationale
        -- and the measured evidence. 190 source rows carry literal double quotes;
        -- the published view does not. Replace-all, not trim(both '"'), because 5
        -- rows carry quotes that are not purely at both ends. chemotherapy_agents is
        -- deliberately NOT stripped -- the published view retains its quotes.
        replace(t.protocol_name_unmasked_internal_use, '"', '') as protocol_clean
    from {{ source('dwh_source', 'treatment') }} t
),

pt_roster as (
    select * from {{ ref('int_pcx_30_cohort_roster') }}
),

initial_events as (
    select * from {{ ref('int_pcx_30_initial_events') }}
),

-- REVIEWER OVERRIDES (added 2026-11-05)
-- -----------------------------------------------------------------------
-- This view now applies the SAME reviewer-accepted overrides as
-- pcx_30_medical_therapy_level_deid, so a consumer of either sees the value the
-- clinical reviewer accepted. Before this, the two DISAGREED: the view is a
-- parallel rebuild from `treatment` rather than a read of the release table, so
-- the override applied in the deid model's final select never reached here, and
-- all 8 accepted corrections were invisible to every view-backed consumer
-- (measured 2026-11-05).
--
-- Provenance DETAIL is deliberately not exposed here. The release tables carry
-- a `field_provenance` column; whether the view layer should too is an open
-- decision, so this change moves the VALUES only and adds no column.
--
-- KNOWN GAP -- derived columns do NOT cascade. `is_initial_treatment` is
-- computed from the raw `age_at_chemo_start`, so on the one row where
-- `age_at_regimen_start_days` is overridden it still reflects the curator's
-- original age. Left deliberately: the deid model does not cascade either, and
-- view-vs-table agreement on a shared column matters more than internal
-- coherence of a derived one. The paired CALENDAR DATES are different -- they
-- exist only in this view and are a pure projection of the age, so they ARE
-- re-derived from the accepted value below, which is applying the reviewer's
-- decision rather than inventing one.
--
-- KNOWN GAP -- `protocol_name_and_arm` is not overridden, matching the deid
-- model; see its header for why.

published as (

select distinct
    -- pcx_30_organization_override wins where it carries the patient; see the seed's
    -- description in seeds/_pcx_30__seeds.yml. Empty seed = byte-identical.
    coalesce(ovr.organization_name, pt_roster.organization_name) as organization_name,
    coalesce(ovr.organization_code, org.code) as organization_code,

    -- NOT EMITTED -- carried for the provenance key only. `pcx_row_uid` must be
    -- computed over the DEID table's values, and the deid model keys on the raw
    -- roster organization name, NOT the pcx_30_organization_override one. Using
    -- the coalesced name above would move the hash and the join would silently
    -- miss: measured on C7617267 (SCH-DEMO), whose 2 therapy rows were exactly
    -- the rows that failed to match before this column existed.
    pt_roster.organization_name as uid_organization_name,
    -- NOT EMITTED -- needed to re-derive the calendar dates from an accepted age.
    dob as uid_dob,

    -- identifier pair
    -- (qualified: initial_events also exposes research_id / organization_name)
    pt_roster.mrn,
    pt_roster.research_id,

    -- identical in both builds
    treatment.protocol_clean as protocol_name_and_arm,
    -- protocol_name / protocol_arm: split protocol_name_and_arm on its FIRST colon
    -- (added 2026-10-02). See pcx_30_medical_therapy_level_deid for the full rule.
    -- Both are "OK to show to all users" per view_data_dictionary_access_policy.csv,
    -- with the caveat that if protocol_name_and_arm is ever masked these must be
    -- masked with it. Splits the QUOTE-STRIPPED value.
    if(instr(treatment.protocol_clean, ':') > 0,
       trim(substr(treatment.protocol_clean, 1,
                   instr(treatment.protocol_clean, ':') - 1)),
       treatment.protocol_clean) as protocol_name,
    if(instr(treatment.protocol_clean, ':') > 0,
       trim(substr(treatment.protocol_clean,
                   instr(treatment.protocol_clean, ':') + 1)),
       'Not Applicable') as protocol_arm,
    chemotherapy_type,

    -- timing pairs
    date_add(dob, interval cast(age_at_chemo_start as int) day) as regimen_start_date,
    age_at_chemo_start as age_at_regimen_start_days,
    date_add(dob, interval cast(age_at_chemo_stop as int) day) as regimen_stop_date,
    age_at_chemo_stop as age_at_regimen_stop_days,

    -- identical in both builds
    chemotherapy_agents_unmasked_internal_use as chemotherapy_agents,
    case when cast(age_at_chemo_start as int) between age_at_initial_dx_days
        and coalesce(age_at_first_event_days, 100000)
    then 'yes' else 'no' end as is_initial_treatment
from treatment
inner join pt_roster on treatment.subject = pt_roster.research_id
left join {{ ref('pcx_30_organization_ref') }} org
    on org.name = pt_roster.organization_name
left join {{ ref('pcx_30_organization_override') }} ovr
    on ovr.research_id = pt_roster.research_id
left join initial_events on pt_roster.research_id = initial_events.research_id
where chemotherapy = 'Yes'

),

keyed as (
    select
        published.*,
        {{ pcx_row_uid([
            'uid_organization_name',
            'research_id',
            'protocol_name_and_arm',
            'protocol_name',
            'protocol_arm',
            'chemotherapy_type',
            'age_at_regimen_start_days',
            'age_at_regimen_stop_days',
            'chemotherapy_agents',
            'is_initial_treatment',
        ]) }} as pcx_row_uid
    from published
),

prov as (
    {{ pcx_30_field_provenance_pivot('medical_therapy', [
        'age_at_regimen_start_days',
        'age_at_regimen_stop_days',
        'chemotherapy_agents',
        'chemotherapy_type',
        'protocol_name',
    ]) }}
)

-- Column list and order are UNCHANGED from the pre-override view; only the
-- values of the five overridable columns (and the two dates projected from the
-- overridable ages) can differ, and only on a row a reviewer decided.
select
    keyed.organization_name,
    keyed.organization_code,
    keyed.mrn,
    keyed.research_id,
    keyed.protocol_name_and_arm,
    coalesce(prov.ov_protocol_name, keyed.protocol_name) as protocol_name,
    keyed.protocol_arm,
    coalesce(prov.ov_chemotherapy_type, keyed.chemotherapy_type)
        as chemotherapy_type,
    date_add(keyed.uid_dob, interval cast(coalesce(
        prov.ov_age_at_regimen_start_days,
        keyed.age_at_regimen_start_days) as int) day) as regimen_start_date,
    coalesce(prov.ov_age_at_regimen_start_days, keyed.age_at_regimen_start_days)
        as age_at_regimen_start_days,
    date_add(keyed.uid_dob, interval cast(coalesce(
        prov.ov_age_at_regimen_stop_days,
        keyed.age_at_regimen_stop_days) as int) day) as regimen_stop_date,
    coalesce(prov.ov_age_at_regimen_stop_days, keyed.age_at_regimen_stop_days)
        as age_at_regimen_stop_days,
    coalesce(prov.ov_chemotherapy_agents, keyed.chemotherapy_agents)
        as chemotherapy_agents,
    keyed.is_initial_treatment
from keyed
left join prov on prov.pcx_row_uid = keyed.pcx_row_uid
