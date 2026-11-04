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
        -- ORDER BY on every group_concat, and array_sort on the array_unique_agg
        -- below -- kept in step with pcx_30_event_level_deid, which carries the full
        -- rationale. Without them these columns differ between two identical rebuilds
        -- with no data change (COHORT_EXPANSION_PLAN.md section 6e). Alphabetical,
        -- carrying no clinical meaning: the ORDER of elements within the string
        -- changes, never which elements are present.
        coalesce(
            group_concat(
                distinct case
                    when metastasis = 'Yes' then metastasis
                end
                order by case
                    when metastasis = 'Yes' then metastasis
                end
                separator ';'
            ),
            'No'
        ) as metastasis,
        coalesce(
            group_concat(
                distinct case
                    when metastasis = 'Yes' then metastasis_location
                end
                order by case
                    when metastasis = 'Yes' then metastasis_location
                end
                separator ';'
            ),
            'Not Applicable'
        ) as metastasis_location,
        coalesce(
            group_concat(
                distinct case
                    when
                        metastasis_location = 'Other'
                        then metastasis_location_other
                end
                order by case
                    when
                        metastasis_location = 'Other'
                        then metastasis_location_other
                end
                separator ';'
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
            array_sort(
                array_unique_agg(
                    array_map(x -> trim(x), split(tumor_locations, ';'))
                )
            ),
            ';'
        ) as tumor_locations,
        coalesce(
            group_concat(
                distinct case
                    when
                        tumor_location_other <> 'Not Applicable'
                        then tumor_location_other
                end
                order by case
                    when
                        tumor_location_other <> 'Not Applicable'
                        then tumor_location_other
                end
                separator ';'
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

    union distinct

    -- Initial CNS Tumor for the NON-ATRT/Medulloblastoma cohort: the patient's FIRST
    -- initial-diagnosis row, taken as-is. The identified counterpart of the third arm
    -- in pcx_30_event_level_deid -- see that model for the full rationale, the -1
    -- sentinel trap and the deterministic-tie-break caveat. Kept in step by hand:
    -- this view deliberately re-derives the aggregation rather than reading the deid
    -- table (it needs mrn and dob in the grain), which is the same second-copy
    -- tradeoff the header documents for the two upgrade arms.
    --
    -- WHY THIS ARM WAS THE PUBLISHING BLOCKER. Until it existed, this view carried
    -- only the two arms above, both of which exclude these patients -- arm 1 by
    -- cns_diagnosis_category, arm 2 by event_type. So an expanded build published
    -- ~6,957 patients in pcx_30_event_level_deid and 970 in this view: the table and
    -- the view disagreed on who was in the release. COHORT_EXPANSION_PLAN.md section
    -- 6g item 1 recorded it as the one item that had to be closed before any expanded
    -- build could be published. This is that closure.
    --
    -- SELF-GATING, exactly as in the deid model: under the default
    -- pcx_30_cohort_scope ('atrt_mb') the roster holds no 'Not Applicable' rows, so
    -- this arm contributes nothing and the view is unchanged.
    --
    -- PARTITION KEY carries the patient-IDENTITY columns, not research_id alone.
    -- Arm 1 groups by (organization_name, mrn, research_id, dob, ...), so a patient
    -- with two MRNs yields one row per MRN there; partitioning on research_id alone
    -- here would elect a single row and silently drop the other MRN, making this arm
    -- disagree with arm 1 on grain. Measured on prod 2026-11-04 against
    -- int_pcx_30_cohort_roster_all_cbtn: the 'Not Applicable' population has ZERO
    -- multi-MRN and ZERO multi-dob patients (6,957 rows / 6,957 research_ids / 6,957
    -- distinct (research_id, mrn) pairs), so this is defence against a future load,
    -- not a live fix -- the same posture as the NOT EXISTS in
    -- int_pcx_30_diagnosis_cohort. event_type is fixed by the WHERE and the
    -- diagnosis columns are deliberately NOT partition keys: picking one row per
    -- patient is the point of the arm.
    select
        organization_name,
        mrn,
        research_id,
        dob,
        event_type,
        -- cast on EVERY arm -- see the note on the aggregated arm above.
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
    from (
        select
            pt_roster.organization_name,
            pt_roster.mrn,
            pt_roster.research_id,
            pt_roster.dob,
            dx.event_type,
            dx.age_at_event_days,
            dx.metastasis,
            dx.metastasis_location,
            dx.metastasis_location_other,
            dx.cns_diagnosis_category,
            dx.cns_integrated_diagnosis_cbtn,
            dx.opc_cns_integrated_diagnosis,
            dx.opc_mb_group,
            dx.tumor_locations,
            dx.tumor_location_other,
            row_number() over (
                partition by
                    pt_roster.research_id,
                    pt_roster.mrn,
                    pt_roster.dob,
                    pt_roster.organization_name
                order by
                    -- -1 is the unknown-date sentinel, not an early date, so sentinel
                    -- and NULL ages sort LAST rather than electing an undated row as
                    -- "first". The remaining keys are alphabetical and exist ONLY for
                    -- determinism across rebuilds -- they are not a clinical ranking.
                    case
                        when dx.age_at_event_days is null then 1
                        when dx.age_at_event_days = -1 then 1
                        else 0
                    end,
                    dx.age_at_event_days,
                    dx.cns_diagnosis_category,
                    dx.cns_integrated_diagnosis_cbtn,
                    dx.tumor_locations,
                    dx.metastasis
            ) as rn
        from dx
        inner join pt_roster on dx.subject = pt_roster.research_id
        where
            dx.research_study_name = 'CBTN'
            and dx.event_type = 'Initial CNS Tumor'
            and pt_roster.diagnosis_type_cohort = 'Not Applicable'
    ) first_initial
    where rn = 1
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
