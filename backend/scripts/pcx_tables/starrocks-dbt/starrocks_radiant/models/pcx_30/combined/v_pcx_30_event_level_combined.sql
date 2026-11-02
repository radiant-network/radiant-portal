{{ config(
    materialized='view',
    tags=['pcx_30', 'combined', 'phi']
) }}

-- Combined identified + de-identified disease events in ONE relation.
--
-- CONTAINS PHI (mrn + calendar event_date alongside research_id). Internal use only.
--
-- Field pairing rule: identical columns appear once; differing columns appear twice,
-- adjacent, identified value first.
--   mrn        / research_id
--   event_date / age_at_event_days
--
-- NOTE on the -1 sentinel: age_at_event_days carries -1 for an unknown date.
-- date_add(dob, -1 day) therefore yields dob minus one day for those rows. This
-- behaviour is inherited verbatim from pcx_30_event_level so the view matches the
-- existing identified table; it is NOT corrected here.
--
-- OPENPEDCAN DIAGNOSIS UPGRADE (2026-10-05, second arm 2026-10-06). A more specific
-- molecular subtype from openpedcan_histologies_annotated replaces the CBTN value in
-- TWO cases, and cns_integrated_diagnosis_source ('CBTN' | 'OpenPedCan') records
-- which won:
--   arm 1  an '%NOS or NEC%' value  -> any allowlisted openpedcan subtype
--   arm 2  'Medulloblastoma, non-WNT/non-SHH' -> Group 3 or Group 4 ONLY
-- Arm 2 is a nested-specificity refinement (Group 3/4 ARE non-WNT/non-SHH subtypes)
-- and reads the Group-3/4-only `opc_mb_group` column, never the full allowlist -- a
-- WNT or ATRT value would contradict a non-WNT/non-SHH call.
--
-- PHASE 3: the OpenPedCan subtype allowlist now lives ONCE, in
-- int_pcx_30_openpedcan_subtype, shared with pcx_30_event_level_deid. Before this it
-- was restated here verbatim, and the source script's header warned that "the two
-- implementations must be kept in step" with nothing enforcing it. That is now a DAG
-- edge: changing the allowlist changes both relations or neither.
--
-- This view still re-derives the AGGREGATION (the prelim CTE) from diagnosis rather
-- than reading pcx_30_event_level_deid, and that is deliberate -- it needs mrn and
-- dob threaded through the group-by to project the identified side, which the deid
-- table does not carry. The resolution logic that remains here (the two upgrade arms
-- and the whole-group lift) is still a second copy; collapsing it would mean pushing
-- mrn/dob into the deid table's grain, which is the one thing this slate is built to
-- avoid.
--
-- The 12 measured caveats (the 'N/A' literal on 52% of rows, the up-to-23-row fan-out
-- per sample_id, the 'Not Reported' value a bare non-null test would ship, the
-- deliberately excluded 'Medulloblastoma, SHH-activated', the whole-group upgrade
-- rule): see int_pcx_30_openpedcan_subtype and pcx_30_event_level_deid. Verified
-- 2026-10-05 to yield values identical to pcx_30_event_level.

with pt_roster as (
    select * from {{ ref('int_pcx_30_cohort_roster') }}
),

-- One row per sample_id, carrying ONLY an allowlisted openpedcan subtype already
-- mapped to the CBTN vocabulary. The closed positive allowlist, the SHH-activated
-- exclusion and the up-to-23-rows-per-sample pre-aggregation all live in that model
-- now -- shared with pcx_30_event_level_deid, so the vocabulary cannot diverge
-- between the two.
opc_specific as (
    select * from {{ ref('int_pcx_30_openpedcan_subtype') }}
),

-- diagnosis + the candidate openpedcan subtype for THIS row's specimen.
-- cns_integrated_diagnosis is renamed so the resolved output column of the same name
-- cannot shadow it in the GROUP BY below.
dx as (
    select
        diagnosis.subject,
        diagnosis.research_study_name,
        diagnosis.event_type,
        diagnosis.age_at_event_days,
        diagnosis.metastasis,
        diagnosis.metastasis_location,
        diagnosis.metastasis_location_other,
        diagnosis.cns_diagnosis_category,
        diagnosis.cns_integrated_diagnosis as cns_integrated_diagnosis_cbtn,
        diagnosis.tumor_locations,
        diagnosis.tumor_location_other,
        opc_specific.opc_cns_integrated_diagnosis,
        -- Group-3/4-only candidate, for the non-WNT/non-SHH refinement below.
        -- Deliberately NARROWER than the allowlist: a WNT or ATRT value would
        -- CONTRADICT a non-WNT/non-SHH call rather than refine it, so it must never
        -- reach that arm.
        case
            when
                opc_specific.opc_cns_integrated_diagnosis in (
                    'Medulloblastoma, Group 3', 'Medulloblastoma, Group 4'
                )
                then opc_specific.opc_cns_integrated_diagnosis
        end as opc_mb_group
    from {{ source('dwh_source', 'diagnosis') }} diagnosis
    left join opc_specific
        on opc_specific.sample_id = diagnosis.sample_subject_name
        -- 'N/A' is a literal value here, not NULL, on 52% of cohort rows
        and diagnosis.sample_subject_name <> 'N/A'
),

-- One aggregation pass carrying mrn, research_id and dob together, so both the
-- calendar-date and age-in-days projections come off the same row.
prelim as (
    select distinct
        organization_name,
        mrn,
        research_id,
        dob,
        event_type,
        -- cast to int, matching pcx_30_event_level_deid: diagnosis.age_at_event_days
        -- is FLOAT, so min() over it promoted this column to float/decimal. Lossless
        -- (0 fractional values, verified 2026-10-02); -1 sentinel and NULL preserved.
        cast(min(age_at_event_days) as int) as age_at_event_days,
        coalesce(
            group_concat(
                distinct case
                    when metastasis = 'Yes' then metastasis
                end separator ';'
            ),
            'No'
        ) as metastasis,
        coalesce(
            group_concat(
                distinct case
                    when metastasis = 'Yes' then metastasis_location
                end separator ';'
            ),
            'Not Applicable'
        ) as metastasis_location,
        coalesce(
            group_concat(
                distinct case
                    when
                        metastasis_location = 'Other'
                        then metastasis_location_other
                end separator ';'
            ),
            'Not Applicable'
        ) as metastasis_location_other,
        cns_diagnosis_category,
        -- Whole-group upgrade: this branch already collapses several specimens into
        -- one row per patient, so a per-specimen upgrade would SPLIT a
        -- partially-matched group into one NOS row and one specific row. If ANY
        -- specimen in the group matches, the group takes that value. Still
        -- event-scoped -- never crosses event_type.
        case
            when
                cns_integrated_diagnosis_cbtn like '%NOS or NEC%'
                and max(opc_cns_integrated_diagnosis) is not null
                then max(opc_cns_integrated_diagnosis)
            when
                cns_integrated_diagnosis_cbtn = 'Medulloblastoma, non-WNT/non-SHH'
                and max(opc_mb_group) is not null
                then max(opc_mb_group)
            else cns_integrated_diagnosis_cbtn
        end as cns_integrated_diagnosis,
        case
            when
                cns_integrated_diagnosis_cbtn like '%NOS or NEC%'
                and max(opc_cns_integrated_diagnosis) is not null
                then 'OpenPedCan'
            when
                cns_integrated_diagnosis_cbtn = 'Medulloblastoma, non-WNT/non-SHH'
                and max(opc_mb_group) is not null
                then 'OpenPedCan'
            else 'CBTN'
        end as cns_integrated_diagnosis_source,
        array_join(
            array_unique_agg(
                array_map(x -> trim(x), split(tumor_locations, ';'))
            ),
            ';'
        ) as tumor_locations,
        coalesce(
            group_concat(
                distinct case
                    when
                        tumor_location_other <> 'Not Applicable'
                        then tumor_location_other
                end separator ';'
            ),
            'Not Applicable'
        ) as tumor_location_other
    from dx
    inner join pt_roster on dx.subject = pt_roster.research_id
    where
        research_study_name = 'CBTN'
        and event_type = 'Initial CNS Tumor'
        and cns_diagnosis_category in (
            'Atypical teratoid/rhabdoid tumor', 'Medulloblastoma'
        )
    group by
        organization_name, mrn, research_id, dob, event_type,
        cns_diagnosis_category, cns_integrated_diagnosis_cbtn

    union distinct

    -- Non-initial events emit one row per diagnosis row, so attribution is strictly
    -- per-specimen here -- no broadcast.
    select
        organization_name,
        mrn,
        research_id,
        dob,
        event_type,
        -- cast on BOTH union arms -- see the note on the aggregated arm above.
        cast(age_at_event_days as int) as age_at_event_days,
        metastasis,
        metastasis_location,
        metastasis_location_other,
        cns_diagnosis_category,
        case
            when
                cns_integrated_diagnosis_cbtn like '%NOS or NEC%'
                and opc_cns_integrated_diagnosis is not null
                then opc_cns_integrated_diagnosis
            when
                cns_integrated_diagnosis_cbtn = 'Medulloblastoma, non-WNT/non-SHH'
                and opc_mb_group is not null
                then opc_mb_group
            else cns_integrated_diagnosis_cbtn
        end as cns_integrated_diagnosis,
        case
            when
                cns_integrated_diagnosis_cbtn like '%NOS or NEC%'
                and opc_cns_integrated_diagnosis is not null
                then 'OpenPedCan'
            when
                cns_integrated_diagnosis_cbtn = 'Medulloblastoma, non-WNT/non-SHH'
                and opc_mb_group is not null
                then 'OpenPedCan'
            else 'CBTN'
        end as cns_integrated_diagnosis_source,
        tumor_locations,
        tumor_location_other
    from dx
    inner join pt_roster on dx.subject = pt_roster.research_id
    where
        research_study_name = 'CBTN'
        and event_type <> 'Initial CNS Tumor'
)

select
    prelim.organization_name,
    org.code as organization_code,

    -- identifier pair
    mrn,
    research_id,

    event_type,

    -- timing pair
    date_add(dob, interval cast(age_at_event_days as int) day) as event_date,
    age_at_event_days,

    -- identical in both builds
    metastasis,
    metastasis_location,
    metastasis_location_other,
    cns_diagnosis_category,
    cns_integrated_diagnosis,
    cns_integrated_diagnosis_source,
    tumor_locations,
    tumor_location_other
from prelim
left join {{ ref('pcx_30_organization_ref') }} org
    on org.name = prelim.organization_name
