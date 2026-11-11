{{ config(
    materialized='table',
    tags=['cbtn_clinical', 'base', 'phi']
) }}

-- Most recent Lansky or Karnofsky performance-status score per patient.
--
-- Returns ONE row per patient: whichever of the two scales was recorded most
-- recently. A patient who transitioned from the pediatric Lansky scale to the adult
-- Karnofsky scale yields the later of the two, not one row per scale. (For one row
-- per patient PER scale, add scale to the partition by.)
--
-- SCALE IDENTIFICATION -- coded, not code_text. Keyed on
-- observation_code_coding.code_coding_code because the codes are stable while
-- observation.code_text is a verbose Epic prompt string:
--   EPIC#1501      'Lansky functional status, pediatric'
--   MEDCIN#124024  'Karnofsky PS ___ %'
-- code_coding_system is deliberately NOT constrained: the Lansky code appears under
-- two OIDs and filtering on system would silently drop a row.
--
-- *** THE SCORE IS FREE TEXT, NOT A NUMBER. *** Every observation.value_* column is
-- NULL for both scales (0 of 43,456 rows populated). The score exists ONLY in
-- observation_component.component_value_string, with the number leading. Parsing is
-- by leading-digit regex rather than splitting on ' - ', because the separator is
-- inconsistent: '100 - Full normal activity', '80- Normal activity with effort',
-- '80% - Active, but Tires More Quickly', and 'Not Applicable (Patient Less Than 1
-- Year Old)' which has no leading digit and is dropped. Extracted scores land exactly
-- on 10..100 in steps of ten (verified), so no range filter is applied. score_text
-- carries the raw string so the parse stays auditable from the table.
--
-- *** DATE: effective_date_time IS UNUSABLE HERE -- `issued` IS THE ONLY DATE. ***
-- This domain does NOT follow the usual Observation date precedence, because both
-- clinical date columns are empty: effective_date_time 0 of 43,456,
-- effective_period_start 0 of 43,456, issued 39,453 of 43,456. So recency orders on
-- issued, an ADMINISTRATIVE date -- a release-time proxy, not a clinical event time.
-- Every scored_at here is therefore administrative, with no clinical-dated
-- alternative to fall back to.
--
-- scored_at IS UTC. The trailing 'Z' is STRIPPED, not converted, so the stored
-- wall-clock equals the source UTC wall-clock. Same convention as cbc_latest_results.
-- A late-evening UTC timestamp can fall on the PRIOR local calendar day at a US site;
-- convert before reporting a local date.
--
-- UNDATED ROWS ARE KEPT, NOT DROPPED: 3,801 scored observations have no issued
-- timestamp AND no encounter_reference, so they cannot be dated at all. They sort
-- last instead of being filtered, so the 104 patients whose ONLY scores are undated
-- still get a row, with scored_at NULL -- visibly unranked rather than silently
-- absent. Any patient holding at least one dated score always returns that dated
-- score. ==> Treat scored_at IS NULL as "most recent score, date unknown", and
-- exclude those 104 rows for anything time-based.
--
-- NO STATUS FILTER IS AVAILABLE. observation.status is uniformly 'unknown' on all
-- 43,456 rows, so unlike the CBC table entered-in-error rows cannot be
-- distinguished. Do not read the absence of a status filter as an oversight.
--
-- VERIFIED on prod 2026-09-29: observation_code_coding cannot fan out (exactly one
-- target coding per observation); multi-line components are rare (75 of 42,380 carry
-- more than one scored 'Line N', occasionally differing, e.g. Line 1 = 70 / Line 2 =
-- 80 -- lowest line number wins, then observation_id, so the result is
-- deterministic); returns 1,627 patients (1,246 Lansky / 381 Karnofsky as the most
-- recent scale, 104 undated); issued dates span 2014-12-08 to 2026-09-15;
-- org_short_code is 'chop' on 43,455 rows and 'seattle' on 1.
--
-- MATERIALIZATION: a TABLE, i.e. a POINT-IN-TIME SNAPSHOT. The source is live, so it
-- goes stale as new scores are filed -- `dbt run` to refresh. For an always-current
-- surface change materialized to 'view'; the select body needs no change.
--
-- CONTAINS PHI: patient_fhir_id plus real calendar scored_at timestamps.
-- radiant_data_dev is the correct home; the grant-aware surface is
-- ac_v_lansky_karnofsky_latest.

with perf_obs as (
    select
        o.id                                            as observation_id,
        o.subject_reference,
        substring_index(o.subject_reference, '/', -1)    as patient_fhir_id,
        case cc.code_coding_code
             when 'EPIC#1501'     then 'lansky'
             when 'MEDCIN#124024' then 'karnofsky'
        end                                             as scale,
        cc.code_coding_code                             as scale_code,
        o.code_text                                     as source_code_text,
        -- issued is the ONLY populated date for this domain; administrative
        cast(replace(replace(nullif(o.issued, ''), 'T', ' '), 'Z', '') as datetime)
                                                        as scored_at,
        o.org_short_code
    from {{ source('radiant_fhir', 'observation') }} o
    join {{ source('radiant_fhir', 'observation_code_coding') }} cc
        on cc.observation_id = o.id
    where cc.code_coding_code in ('EPIC#1501', 'MEDCIN#124024')
),

scored as (
    select
        p.patient_fhir_id,
        p.subject_reference,
        p.scale,
        p.scale_code,
        p.source_code_text,
        p.scored_at,
        p.observation_id,
        p.org_short_code,
        -- leading-digit parse; separator is inconsistent ('80-', '80%', '100 -')
        cast(regexp_extract(c.component_value_string, '^([0-9]+)', 1) as int)
                                                        as score,
        c.component_value_string                        as score_text,
        c.component_code_text                           as component_line,
        cast(regexp_extract(c.component_code_text, '([0-9]+)', 1) as int)
                                                        as line_no
    from perf_obs p
    join {{ source('radiant_fhir', 'observation_component') }} c
        on c.observation_id = p.observation_id
    where regexp_extract(c.component_value_string, '^([0-9]+)', 1) <> ''
),

ranked as (
    select
        scored.*,
        row_number() over (
            partition by patient_fhir_id
            order by
                -- dated scores outrank undated; NULL scored_at sorts last
                case when scored_at is null then 1 else 0 end,
                scored_at desc,
                line_no,
                observation_id
        ) as rn
    from scored
)

select
    patient_fhir_id,
    subject_reference,
    scale,
    score,
    scored_at,
    score_text,
    scale_code,
    source_code_text,
    component_line,
    observation_id,
    org_short_code,
    -- every scored_at here derives from issued, an administrative date
    case when scored_at is null then 'undated' else 'administrative' end
                                                        as date_semantic
from ranked
where rn = 1
