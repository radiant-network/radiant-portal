{{ config(
    materialized='table',
    tags=['pcx_30', 'deid']
) }}

-- De-identified disease-event level table. Port of the _deid half of
-- event_level_fields_openpedcan_prod.sql, which SUPERSEDED the archived
-- event_level_fields_prod.sql (two scripts building the same table was a footgun --
-- whichever ran last won; that ambiguity is gone now that one model owns the table).
--
-- Upgrades an "NOS/NEC" cns_integrated_diagnosis with a more specific molecular
-- subtype from OpenPedCan, via two arms:
--   ARM 1  NOS/NEC                        -> any allowlisted subtype
--   ARM 2  'Medulloblastoma, non-WNT/non-SHH' -> Group 3 / Group 4 ONLY
-- Arm 2 is a NESTED SPECIFICITY refinement (Group 3/4 ARE non-WNT/non-SHH subtypes),
-- not a conflict, which is why it reads the Group-3/4-only `opc_mb_group` rather than
-- the full allowlist -- a WNT or ATRT value would CONTRADICT a non-WNT/non-SHH call.
-- The 2 non-WNT/non-SHH rows where OpenPedCan says SHH-activated are a genuine
-- disagreement and are deliberately left on the CBTN value.
--
-- Already-specific values are never overwritten: without the closed arms, OpenPedCan
-- would DOWNGRADE 'Medulloblastoma, SHH-activated and TP53-wildtype' to
-- 'Medulloblastoma, SHH-activated'.
--
-- NO CROSS-EVENT BROADCAST (caveat 8). A subtype applies only to the event whose own
-- specimen matched; it is never propagated to the same patient's other events.
-- Broadcasting per patient would have upgraded 455 rows instead of 189, asserting a
-- subtype on events with no specimen. The one exception is deliberate and narrow:
-- a PARTIALLY-MATCHED Initial CNS Tumor group is upgraded WHOLE (caveat 9), because
-- that arm already collapses a patient's specimens into one row and a per-specimen
-- upgrade would SPLIT 3 patients' single initial row in two. It never crosses
-- event_type. Consequence for testing: on the non-initial arm a row whose own
-- sample_subject_name is 'N/A' keeps the CBTN value even when a SIBLING event of the
-- same patient and event_type matched -- so test at the per-ROW grain, not
-- per-(patient, event_type), or two patients will look like failures.
--
-- YIELD when last profiled (2026-10-05): 1102 NOS/NEC rows across 590 cohort
-- patients; 189 rows / 174 patients upgraded. cns_integrated_diagnosis_source marks
-- exactly those. Zero rows are reachable from both sources, so the source column adds
-- no rows.
--
-- Downstream consumers that project cns_integrated_diagnosis_source and must be
-- redeployed alongside any change here (NOT yet converted to dbt):
--   combined_views/event_level_combined_view.sql  (re-derives this logic)
--   access_controlled_views/event_level_access_controlled.sql{,.tmpl}
--   data_dictionary/data_dictionary_table.sql  (display_order 23)

with pt_roster as (
    select * from {{ ref('int_pcx_30_cohort_roster') }}
),

opc_specific as (
    select * from {{ ref('int_pcx_30_openpedcan_subtype') }}
),

-- diagnosis + the candidate OpenPedCan subtype for THIS row's specimen.
-- cns_integrated_diagnosis is renamed so nothing downstream shadows the resolved
-- output column of the same name.
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
        -- Group-3/4-only candidate for the non-WNT/non-SHH refinement below.
        -- Deliberately NARROWER than the allowlist: a WNT or ATRT value would
        -- CONTRADICT a non-WNT/non-SHH call rather than refine it, so it must
        -- never reach that arm.
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
        -- 'N/A' is a literal value, not NULL, on 52% of cohort diagnosis rows
        -- (caveat 4), so it must never be matched against a real sample_id
        and diagnosis.sample_subject_name <> 'N/A'
),

-- Initial CNS Tumor: one row per patient, specimens collapsed, group upgraded whole.

-- FIELD PROVENANCE AND REVIEWER OVERRIDES (added 2026-11-05)
-- -----------------------------------------------------------------------
-- `field_provenance` records, per row, which values an independent automated
-- source produced: `field=source`, with `!` marking a value a clinical
-- reviewer accepted IN PLACE OF the curator's. The rule is "provenance only,
-- UNLESS a reviewer accepts an overriding value" (owner, 2026-11-05).
-- Detail -- who decided, when, the original value, the case id -- lives in
-- `pcx_30_field_provenance` and `pcx_30_promotion_decisions`, deliberately NOT
-- in more columns here.
--
-- `published` wraps the WHOLE three-arm union, not its last arm, so the row
-- key is computed once over the union's output.

published as (
select distinct
    organization_name,
    research_id,
    event_type,
    -- cast to int: diagnosis.age_at_event_days is FLOAT, and min() over a float
    -- promotes to decimal(38,9), so this published column rendered as
    -- '5541.000000000'. Lossless -- verified 2026-10-02 that 0 of 1846 non-null
    -- values carry a fractional part. Keeps the -1 unknown-date sentinel and NULL.
    cast(min(age_at_event_days) as int) as age_at_event_days,
    -- ORDER BY on every group_concat, and array_sort on the array_unique_agg below.
    -- Without them this model is NOT reproducible run-to-run: the concatenation order
    -- is whatever order the aggregate happened to see its input, so a handful of rows
    -- differ in these columns between two identical rebuilds with no data change
    -- (measured 0, then 2, then 1 row across three consecutive executions,
    -- COHORT_EXPANSION_PLAN.md section 6e; zero differences on non-concat columns).
    -- That broke the one check that can catch a patient LEAVING the cohort -- a
    -- row-level diff of the exported CSVs -- because a net row count cannot detect a
    -- departure and the row diff came back dirty on noise. Pre-existing and
    -- independent of the cohort expansion; fixed here so the diff is trustworthy.
    --
    -- The ordering is alphabetical and carries NO clinical meaning. It changes only
    -- the ORDER of elements within these concatenated strings, never which elements
    -- are present, so the first build after this lands may differ from the live table
    -- on exactly these columns -- that is the fix taking effect, not a data change.
    --
    -- MEASURED ON PROD 2026-11-04, default scope, this model and
    -- v_pcx_30_event_level_combined both compiled and run read-only against the live
    -- relations: every column EXCEPT these concatenated ones is identical, 0 rows in
    -- each direction; and whole rows with each concatenated column normalised to its
    -- sorted element list are also identical, 0 rows in each direction. On the view
    -- 34 of 1,869 rows differ in the raw tumor_locations string -- all 34 ordering
    -- only. So the content claim above is measured, not assumed.
    --
    -- One caveat on reproducing that check: the view carries 1,869 rows over only
    -- 1,867 distinct (research_id, event_type, age_at_event_days) keys, so joining
    -- live to new on that triple fans out on 2 keys and compares mismatched pairs.
    -- Doing so reports 2 spurious content differences. Compare whole rows with EXCEPT
    -- as described above rather than joining on a non-unique key.
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
    -- array_sort for the same reproducibility reason as the group_concats above:
    -- array_unique_agg is an aggregate and its element order is unspecified, so this
    -- column was a fourth nondeterminism source. The plan's section 6e named only the
    -- group_concats; this one was found alongside them 2026-11-04.
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
    organization_name, research_id, event_type,
    cns_diagnosis_category, cns_integrated_diagnosis_cbtn

union distinct

-- Non-initial events emit one row per diagnosis row, so attribution is strictly
-- per-specimen here -- no broadcast at all (caveats 8, 9).
select
    organization_name,
    research_id,
    event_type,
    -- cast to int on BOTH union arms. Casting only the aggregated arm above is not
    -- enough: this arm reads the FLOAT column straight from diagnosis, and the
    -- union's common type then promotes the published column back to decimal(38,9).
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
-- initial-diagnosis row, taken as-is.
--
-- WHY THIS ARM EXISTS. The first arm filters cns_diagnosis_category to ATRT /
-- Medulloblastoma, and the second filters event_type <> 'Initial CNS Tumor'. So
-- before this arm, a patient outside those two categories was dropped by BOTH --
-- silently losing their initial diagnosis, and with it the age_at_initial_dx_days
-- anchor that is_initial_treatment depends on. Measured on prod 2026-10-23 under
-- the expanded cohort: 3,313 of 6,963 patients had no event_level row at all
-- (3,239 of them because an initial diagnosis was their ONLY event), and
-- is_initial_treatment was 'no' for every newly admitted surgery.
--
-- SCOPED BY PATIENT, NOT BY ROW -- this is the load-bearing detail. The predicate is
-- pt_roster.diagnosis_type_cohort = 'Not Applicable', i.e. "this PATIENT is not an
-- ATRT/MB patient", NOT "this ROW is not an ATRT/MB diagnosis". 97 ATRT/MB patients
-- also carry rows in other categories (measured 2026-10-23); a row-level predicate
-- would give each of them a second Initial CNS Tumor event from arm 1 AND this arm.
-- The cohort rule is that an ATRT/MB patient is represented by their ATRT/MB
-- diagnosis, so they must be excluded here as patients.
--
-- SELF-GATING: under the default pcx_30_cohort_scope ('atrt_mb') the roster contains
-- no 'Not Applicable' rows at all, so this arm matches nothing and contributes zero
-- rows. The published table is unchanged unless the cohort is deliberately expanded.
-- Verified by row-level comparison against the live table 2026-10-23.
--
-- ONE ROW PER PATIENT, NOT A COLLAPSE. Arm 1 aggregates a patient's initial rows
-- (min age, group_concat of specimens) because they are all the same ATRT/MB
-- diagnosis. That is wrong here: these patients' initial rows can carry DIFFERENT
-- diagnoses (71 of 537 multi-row patients do), and group_concat'ing across them
-- would manufacture a diagnosis the registry never recorded. So this arm picks the
-- single earliest row and publishes it verbatim.
--
-- ORDERING, and its two traps:
--   * age_at_event_days = -1 is the unknown-date sentinel, not an early date, so
--     sorting on it naively would elect an undated row as "first". -1 and NULL are
--     pushed LAST. Only 4 patients carry both a sentinel row and a real-age row, but
--     for those 4 the naive order picks the wrong diagnosis. 56 patients have ONLY
--     sentinel rows and still get their row, with the -1 preserved (as arm 1 does).
--   * 56 patients have more than one row AT their earliest age -- 14 of them with
--     differing cns_diagnosis_category and 24 with differing integrated diagnosis.
--     "First" is genuinely ambiguous for those, so the remaining sort keys are
--     alphabetical and exist ONLY to make the choice deterministic across rebuilds.
--     They are not a clinical ranking. If which diagnosis wins matters for those 14,
--     that is a decision to make explicitly rather than inherit from a sort.
--
-- 157 patients in this cohort have no 'Initial CNS Tumor' row at all and still get
-- no initial event -- the registry simply never recorded one. Not fixable here.
select
    organization_name,
    research_id,
    event_type,
    -- cast to int on EVERY arm, for the same float->decimal(38,9) promotion reason
    -- documented on the two arms above.
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
        pt_roster.research_id,
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
            partition by pt_roster.research_id
            order by
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
,

keyed as (
    -- pcx_row_uid -- md5 over every base column in DDL order, '|#|'-joined,
    -- with a NUL-wrapped NULL sentinel so a NULL and the literal 'NULL' hash
    -- differently. Reproduces promote_to_pcx30._uid EXACTLY: verified
    -- 2026-11-05 against all five live release tables, 38,488 of 38,488 rows.
    -- It is the only join key these tables have -- the models are
    -- `select distinct` with no row identity of their own -- and being
    -- content-addressed is the right failure mode: if an upstream value moves,
    -- the uid moves, the provenance join misses, and a stamp measured against
    -- the old value stops applying rather than being applied to a value nobody
    -- reviewed.
    select
        published.*,
        {{ pcx_row_uid([
            'organization_name',
            'research_id',
            'event_type',
            'age_at_event_days',
            'metastasis',
            'metastasis_location',
            'metastasis_location_other',
            'cns_diagnosis_category',
            'cns_integrated_diagnosis',
            'cns_integrated_diagnosis_source',
            'tumor_locations',
            'tumor_location_other',
        ]) }} as pcx_row_uid
    from published
),

prov as (
    -- Field provenance, pivoted to one row per release row. `!` marks a
    -- reviewer-accepted OVERRIDE (the value differs from what the curator
    -- typed); no marker means corroborated, value unchanged.
    {{ pcx_30_field_provenance_pivot('event', [
        'cns_diagnosis_category',
        'cns_integrated_diagnosis',
        'metastasis',
        'tumor_locations',
    ]) }}
)

-- Column order is the base table's, unchanged; field_provenance is appended
-- LAST so a positional consumer (the CSV exports) sees only an added column.
select
    keyed.organization_name,
    keyed.research_id,
    keyed.event_type,
    keyed.age_at_event_days,
    coalesce(prov.ov_metastasis, keyed.metastasis) as metastasis,
    keyed.metastasis_location,
    keyed.metastasis_location_other,
    coalesce(prov.ov_cns_diagnosis_category, keyed.cns_diagnosis_category) as cns_diagnosis_category,
    coalesce(prov.ov_cns_integrated_diagnosis, keyed.cns_integrated_diagnosis) as cns_integrated_diagnosis,
    keyed.cns_integrated_diagnosis_source,
    coalesce(prov.ov_tumor_locations, keyed.tumor_locations) as tumor_locations,
    keyed.tumor_location_other,
    prov.field_provenance
from keyed
left join prov on prov.pcx_row_uid = keyed.pcx_row_uid
