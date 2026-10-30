-- event_level_fields_openpedcan_prod.sql
--
-- THE LIVE BUILD for radiant_data_dev.pcx_30_event_level and _deid. It SUPERSEDES
-- event_level_fields_prod.sql, which was archived 2026-10-05 to
-- prelim_30_tables_archive/ (and removed from the repo; retrievable at
-- `git show 5663779e3:pcx_demo_table_sql_objects/radiant-prod/event_level_fields_prod.sql`).
-- The two built the same two tables, so leaving both runnable was a footgun --
-- whichever ran last won.
--
-- Upgrades an "NOS/NEC" cns_integrated_diagnosis with a more specific molecular
-- subtype from radiant_data_dev.openpedcan_histologies_annotated.
--
-- Downstream consumers that project cns_integrated_diagnosis_source and must be
-- redeployed alongside any change here:
--   combined_views/event_level_combined_view.sql  (re-derives this logic -- see below)
--   access_controlled_views/event_level_access_controlled.sql{,.tmpl}
--   data_dictionary/data_dictionary_table.sql  (display_order 23)
--
-- Join: openpedcan_histologies_annotated.sample_id = diagnosis.sample_subject_name
-- New column: cns_integrated_diagnosis_source ('CBTN' | 'OpenPedCan')
--
-- =====================================================================
-- MEASURED CAVEATS (profiled on prod 2026-10-05, cohort = ATRT + Medulloblastoma,
-- research_study_name = 'CBTN'). Re-measure if the source tables are reloaded.
-- =====================================================================
--
-- 1. SOURCE COLUMN IS `integrated_diagnosis`. The two plausible alternatives
--    were profiled and rejected:
--      * `who_cns_diagnosis` is a near-mirror of cns_integrated_diagnosis --
--        exactly 1 sample in the cohort would ever change value.
--      * `harmonized_diagnosis` is populated more often but carries VAGUER
--        values (bare 'Medulloblastoma' on 18 samples, 'Atypical Teratoid
--        Rhabdoid Tumor (ATRT)' on 63) which are not upgrades.
--      * `molecular_subtype` is the upstream of integrated_diagnosis and has
--        identical specific-value coverage -- no added yield.
--
-- 2. `integrated_diagnosis` IS NOT SAFE ON A BARE NON-NULL TEST. For cohort
--    NOS/NEC samples it also contains 'Not Reported' (1 sample), bare
--    'Medulloblastoma' (18), 'Atypical Teratoid Rhabdoid Tumor (ATRT)' (63),
--    'Medulloblastoma, NOS or NEC' (2) and 'CNS Embryonal tumor, NEC/NOS' (1).
--    A coalesce() on non-null would ship 'Not Reported' as a diagnosis.
--    Hence the CLOSED POSITIVE ALLOWLIST in opc_specific below -- a value not
--    on that list is never used. Adding a new subtype to the source table
--    means adding it here deliberately.
--
-- 3. JOIN FAN-OUT. openpedcan_histologies_annotated is biospecimen/assay-level:
--    one sample_id carries up to 23 rows (4754 samples have 1 row, 3093 have 2).
--    Joined raw, the group_concat/min aggregates in `prelim` would multiply.
--    opc_specific pre-aggregates to exactly one row per sample_id.
--
-- 4. `sample_subject_name` IS THE LITERAL STRING 'N/A', NOT NULL, on 928 of
--    1791 cohort diagnosis rows (52%). Those events have no specimen link and
--    can never be upgraded. The join carries an explicit <> 'N/A' guard so the
--    string is never matched against a real sample_id.
--
-- 5. VOCABULARY MISMATCH between the two tables. openpedcan values are mapped
--    to the existing CBTN cns_integrated_diagnosis vocabulary so the column
--    keeps ONE permitted-value list:
--      'Atypical Teratoid Rhabdoid Tumor, SHH' -> 'ATRT-SHH'               (22 samples)
--      'Atypical Teratoid Rhabdoid Tumor, MYC' -> 'ATRT-MYC'               (20)
--      'Atypical Teratoid Rhabdoid Tumor, TYR' -> 'ATRT-TYR'               (11)
--      'Medulloblastoma, group 3'              -> 'Medulloblastoma, Group 3' (38)  [case differs]
--      'Medulloblastoma, group 4'              -> 'Medulloblastoma, Group 4' (86)  [case differs]
--      'Medulloblastoma, WNT-activated'        -> unchanged, already exact  (12)
--    NO NEW PERMITTED VALUES ARE INTRODUCED -- every target already exists in
--    cns_integrated_diagnosis.
--
-- 6. 'Medulloblastoma, SHH-activated' (50 samples) IS DELIBERATELY EXCLUDED.
--    openpedcan does not split SHH by TP53 status; the CBTN vocabulary only has
--    'Medulloblastoma, SHH-activated and TP53-wildtype' / '... and TP53-mutant'.
--    Emitting the unqualified term would introduce a 'permitted value' outside
--    the CBTN list, and picking either TP53 variant would be an unsupported
--    clinical claim. Those 50 samples stay 'Medulloblastoma, NOS or NEC'.
--
-- 7. CONFLICTS. Sample 7316-7965 carries both 'Medulloblastoma, SHH-activated'
--    and 'Medulloblastoma, group 3'. Excluding SHH-activated (caveat 6) leaves
--    a single value, so NO sample in the cohort has an ambiguous allowlisted
--    value, and NO Initial-CNS-Tumor group has >1 distinct allowlisted value.
--    max() in opc_specific / the Initial branch is therefore a deterministic
--    pick over a verified-singleton set, not an arbitrary tie-break. If the
--    source is reloaded, re-check:
--      select sample_id from openpedcan_histologies_annotated
--      where integrated_diagnosis in (<allowlist>)
--      group by 1 having count(distinct integrated_diagnosis) > 1;
--
-- 8. GRAIN -- EVENT-LEVEL ONLY, NO CROSS-EVENT BROADCAST. A specific subtype is
--    applied only to the event whose own specimen matched. It is NOT propagated
--    to the same patient's other events (e.g. a later Progressive). Broadcasting
--    per patient would have upgraded 455 rows instead of 189, but would assert a
--    subtype on events with no specimen of their own.
--
-- 9. PARTIALLY-MATCHED Initial CNS Tumor GROUPS ARE UPGRADED WHOLE. That branch
--    already collapses multiple specimens into one row per patient, so a
--    per-specimen upgrade would SPLIT 3 patients' single initial row into two --
--    one still NOS, one specific (C1154847 -> ATRT-TYR, C3559497 -> ATRT-SHH,
--    C67527 -> Medulloblastoma, WNT-activated). Instead, if ANY specimen in the
--    group matches, the whole group takes that value, preserving one initial row
--    per patient. This stays event-scoped -- it never crosses event_type.
--    The non-initial branch emits one row per diagnosis row and so uses strict
--    per-row attribution with no broadcast at all.
--
-- 10. YIELD. 1102 NOS/NEC diagnosis rows across 590 cohort patients.
--     This script upgrades 189 rows / 174 patients. cns_integrated_diagnosis_source
--     = 'OpenPedCan' marks exactly those; everything else is 'CBTN'. Zero rows
--     have a resolved value reachable from both sources, so the new column adds
--     no rows to either output table.
--
-- 11. The upgrade fires ONLY when the CBTN value matches '%NOS or NEC%'. A value
--     that is already specific is never overwritten -- notably, openpedcan would
--     otherwise DOWNGRADE 'Medulloblastoma, SHH-activated and TP53-wildtype' to
--     'Medulloblastoma, SHH-activated'.
-- =====================================================================

drop table if exists radiant_data_dev.pcx_30_event_level;
drop table if exists radiant_data_dev.pcx_30_event_level_deid;

create table radiant_data_dev.pcx_30_event_level as (
    with subj as (
        select distinct subject, cns_diagnosis_category
        from radiant_data_dev.diagnosis
        where
            cns_diagnosis_category in (
                'Atypical teratoid/rhabdoid tumor', 'Medulloblastoma'
            )
--            and coordinating_institution in (
--                'The Children''s Hospital of Philadelphia',
--                'Seattle Children''s Hospital',
--                'UCSF Benioff Children''s Hospital'
--            )
    ),

    pt_roster as (
        select
            stg_cbtn_enrollment_final.mrn,
            stg_cbtn_enrollment_final.research_id,
            cast(dob as date) as dob,
            organization_name,
            subj.cns_diagnosis_category as diagnosis_type_cohort,
            case when radiant_patient_mrn_list.mrn is null then 'cbtn-non-radiant' else 'radiant' end as data_type_cohort
        from radiant_data_dev.stg_cbtn_enrollment_final
        left join
            radiant_data_dev.radiant_patient_mrn_list
            on stg_cbtn_enrollment_final.mrn = radiant_patient_mrn_list.mrn
        inner join subj on subj.subject=stg_cbtn_enrollment_final.research_id
    ),

    -- One row per sample_id (caveat 3), carrying ONLY an allowlisted
    -- openpedcan subtype already mapped to the CBTN vocabulary (caveats 2, 5, 6).
    opc_specific as (
        select
            sample_id,
            max(opc_cns_integrated_diagnosis) as opc_cns_integrated_diagnosis
        from (
            select
                sample_id,
                case integrated_diagnosis
                    when 'Atypical Teratoid Rhabdoid Tumor, SHH'
                        then 'ATRT-SHH'
                    when 'Atypical Teratoid Rhabdoid Tumor, MYC'
                        then 'ATRT-MYC'
                    when 'Atypical Teratoid Rhabdoid Tumor, TYR'
                        then 'ATRT-TYR'
                    when 'Medulloblastoma, group 3'
                        then 'Medulloblastoma, Group 3'
                    when 'Medulloblastoma, group 4'
                        then 'Medulloblastoma, Group 4'
                    when 'Medulloblastoma, WNT-activated'
                        then 'Medulloblastoma, WNT-activated'
                end as opc_cns_integrated_diagnosis
            from radiant_data_dev.openpedcan_histologies_annotated
            where
                integrated_diagnosis in (
                    'Atypical Teratoid Rhabdoid Tumor, SHH',
                    'Atypical Teratoid Rhabdoid Tumor, MYC',
                    'Atypical Teratoid Rhabdoid Tumor, TYR',
                    'Medulloblastoma, group 3',
                    'Medulloblastoma, group 4',
                    'Medulloblastoma, WNT-activated'
                )
        ) mapped
        group by sample_id
    ),

    -- diagnosis + the candidate openpedcan subtype for THIS row's specimen.
    -- cns_integrated_diagnosis is renamed so nothing downstream shadows the
    -- resolved output column of the same name.
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
            opc_specific.opc_cns_integrated_diagnosis
        from radiant_data_dev.diagnosis
        left join opc_specific
            on opc_specific.sample_id = diagnosis.sample_subject_name
            -- 'N/A' is a literal value, not NULL (caveat 4)
            and diagnosis.sample_subject_name <> 'N/A'
    ),

    prelim as (
        select distinct
            organization_name,
            mrn,
            dob,
            event_type,
            min(age_at_event_days) as event_date,
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
            -- Whole-group upgrade (caveat 9): any matched specimen in this
            -- patient's initial-tumor group lifts the group.
            case
                when
                    cns_integrated_diagnosis_cbtn like '%NOS or NEC%'
                    and max(opc_cns_integrated_diagnosis) is not null
                    then max(opc_cns_integrated_diagnosis)
                else cns_integrated_diagnosis_cbtn
            end as cns_integrated_diagnosis,
            case
                when
                    cns_integrated_diagnosis_cbtn like '%NOS or NEC%'
                    and max(opc_cns_integrated_diagnosis) is not null
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
            organization_name, mrn, dob, event_type,
            cns_diagnosis_category, cns_integrated_diagnosis_cbtn

        union distinct

        -- Non-initial events emit one row per diagnosis row, so attribution is
        -- strictly per-specimen here -- no broadcast (caveats 8, 9).
        select
            organization_name,
            mrn,
            dob,
            event_type,
            age_at_event_days as event_date,
            metastasis,
            metastasis_location,
            metastasis_location_other,
            cns_diagnosis_category,
            case
                when
                    cns_integrated_diagnosis_cbtn like '%NOS or NEC%'
                    and opc_cns_integrated_diagnosis is not null
                    then opc_cns_integrated_diagnosis
                else cns_integrated_diagnosis_cbtn
            end as cns_integrated_diagnosis,
            case
                when
                    cns_integrated_diagnosis_cbtn like '%NOS or NEC%'
                    and opc_cns_integrated_diagnosis is not null
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
        order by mrn, cast(event_date as int)
    )

    select
        organization_name,
        mrn,
        event_type,
        date_add(dob, interval cast(event_date as int) day) as event_date,
        metastasis,
        metastasis_location,
        metastasis_location_other,
        cns_diagnosis_category,
        cns_integrated_diagnosis,
        cns_integrated_diagnosis_source,
        tumor_locations,
        tumor_location_other
    from prelim


);


create table radiant_data_dev.pcx_30_event_level_deid as (

    with subj as (
        select distinct subject, cns_diagnosis_category
        from radiant_data_dev.diagnosis
        where
            cns_diagnosis_category in (
                'Atypical teratoid/rhabdoid tumor', 'Medulloblastoma'
            )
--            and coordinating_institution in (
--                'The Children''s Hospital of Philadelphia',
--                'Seattle Children''s Hospital',
--                'UCSF Benioff Children''s Hospital'
--            )
    ),

    pt_roster as (
        select
            stg_cbtn_enrollment_final.mrn,
            stg_cbtn_enrollment_final.research_id,
            cast(dob as date) as dob,
            organization_name,
            subj.cns_diagnosis_category as diagnosis_type_cohort,
            case when radiant_patient_mrn_list.mrn is null then 'cbtn-non-radiant' else 'radiant' end as data_type_cohort
        from radiant_data_dev.stg_cbtn_enrollment_final
        left join
            radiant_data_dev.radiant_patient_mrn_list
            on stg_cbtn_enrollment_final.mrn = radiant_patient_mrn_list.mrn
        inner join subj on subj.subject=stg_cbtn_enrollment_final.research_id
    ),

    opc_specific as (
        select
            sample_id,
            max(opc_cns_integrated_diagnosis) as opc_cns_integrated_diagnosis
        from (
            select
                sample_id,
                case integrated_diagnosis
                    when 'Atypical Teratoid Rhabdoid Tumor, SHH'
                        then 'ATRT-SHH'
                    when 'Atypical Teratoid Rhabdoid Tumor, MYC'
                        then 'ATRT-MYC'
                    when 'Atypical Teratoid Rhabdoid Tumor, TYR'
                        then 'ATRT-TYR'
                    when 'Medulloblastoma, group 3'
                        then 'Medulloblastoma, Group 3'
                    when 'Medulloblastoma, group 4'
                        then 'Medulloblastoma, Group 4'
                    when 'Medulloblastoma, WNT-activated'
                        then 'Medulloblastoma, WNT-activated'
                end as opc_cns_integrated_diagnosis
            from radiant_data_dev.openpedcan_histologies_annotated
            where
                integrated_diagnosis in (
                    'Atypical Teratoid Rhabdoid Tumor, SHH',
                    'Atypical Teratoid Rhabdoid Tumor, MYC',
                    'Atypical Teratoid Rhabdoid Tumor, TYR',
                    'Medulloblastoma, group 3',
                    'Medulloblastoma, group 4',
                    'Medulloblastoma, WNT-activated'
                )
        ) mapped
        group by sample_id
    ),

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
            opc_specific.opc_cns_integrated_diagnosis
        from radiant_data_dev.diagnosis
        left join opc_specific
            on opc_specific.sample_id = diagnosis.sample_subject_name
            and diagnosis.sample_subject_name <> 'N/A'
    )

    select distinct
        organization_name,
        research_id,
        event_type,
        -- cast to int: diagnosis.age_at_event_days is FLOAT, and min() over a float
        -- promotes to decimal(38,9), so this published column rendered as
        -- '5541.000000000'. Lossless -- verified 2026-10-02 that 0 of 1846 non-null
        -- values carry a fractional part. Keeps the -1 unknown-date sentinel and NULL.
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
        case
            when
                cns_integrated_diagnosis_cbtn like '%NOS or NEC%'
                and max(opc_cns_integrated_diagnosis) is not null
                then max(opc_cns_integrated_diagnosis)
            else cns_integrated_diagnosis_cbtn
        end as cns_integrated_diagnosis,
        case
            when
                cns_integrated_diagnosis_cbtn like '%NOS or NEC%'
                and max(opc_cns_integrated_diagnosis) is not null
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
        organization_name, research_id, event_type,
        cns_diagnosis_category, cns_integrated_diagnosis_cbtn

    union distinct

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
            else cns_integrated_diagnosis_cbtn
        end as cns_integrated_diagnosis,
        case
            when
                cns_integrated_diagnosis_cbtn like '%NOS or NEC%'
                and opc_cns_integrated_diagnosis is not null
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
    order by research_id, cast(age_at_event_days as int)
);
