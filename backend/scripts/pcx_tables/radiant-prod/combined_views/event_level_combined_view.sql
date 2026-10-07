/*
   v_pcx_30_event_level_combined

   Combined identified + de-identified disease events in ONE relation.

   CONTAINS PHI (mrn + calendar event_date alongside research_id). Internal use only.

   Field pairing rule: identical columns appear once; differing columns appear
   twice, adjacent, identified value first.
   mrn        / research_id
   event_date / age_at_event_days

   NOTE on the -1 sentinel: age_at_event_days carries -1 for an unknown date.
   date_add(dob, -1 day) therefore yields dob minus one day for those rows. This
   behaviour is inherited verbatim from pcx_30_event_level so the view matches the
   existing identified table; it is NOT corrected here.

   OPENPEDCAN DIAGNOSIS UPGRADE (2026-10-05). An '%NOS or NEC%'
   cns_integrated_diagnosis is replaced by a more specific molecular subtype from
   radiant_data_dev.openpedcan_histologies_annotated, and
   cns_integrated_diagnosis_source ('CBTN' | 'OpenPedCan') records which won.

   This logic is DUPLICATED here on purpose, not inherited. This view does NOT
   read pcx_30_event_level -- it re-derives the same aggregation straight from
   radiant_data_dev.diagnosis. So the upgrade had to be restated rather than
   passed through, and the two implementations must be kept in step.
   AUTHORITATIVE COPY + the 12 measured caveats (the 'N/A' literal on 52% of
   rows, the up-to-23-row fan-out per sample_id, the 'Not Reported' value a bare
   non-null test would ship, the deliberately excluded
   'Medulloblastoma, SHH-activated', the whole-group upgrade rule):
   ../event_level_fields_openpedcan_prod.sql -- read it before editing this.
   Verified 2026-10-05 to yield values identical to pcx_30_event_level.
 */

drop view if exists radiant_data_dev.v_pcx_30_event_level_combined;

create view radiant_data_dev.v_pcx_30_event_level_combined as (
    with subj as (
        select distinct subject, cns_diagnosis_category
        from radiant_data_dev.diagnosis
        where
            cns_diagnosis_category in (
                'Atypical teratoid/rhabdoid tumor', 'Medulloblastoma'
            )
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
        inner join subj on subj.subject = stg_cbtn_enrollment_final.research_id
    ),

    -- One row per sample_id (the source is biospecimen-level and fans out up to
    -- 23 rows per sample), carrying ONLY an allowlisted openpedcan subtype
    -- already mapped to the CBTN vocabulary. The allowlist is CLOSED and
    -- positive: a value not named here is never used, which is what keeps
    -- 'Not Reported' / bare 'Medulloblastoma' / 'CNS Embryonal tumor, NEC/NOS'
    -- out. 'Medulloblastoma, SHH-activated' is excluded deliberately -- CBTN has
    -- no unqualified SHH term, only '... and TP53-wildtype' / '... and
    -- TP53-mutant'.
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
    -- cns_integrated_diagnosis is renamed so the resolved output column of the
    -- same name cannot shadow it in the GROUP BY below.
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
            -- 'N/A' is a literal value here, not NULL, on 52% of cohort rows
            and diagnosis.sample_subject_name <> 'N/A'
    ),

    -- One aggregation pass carrying mrn, research_id and dob together, so both
    -- the calendar-date and age-in-days projections come off the same row.
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
            -- Whole-group upgrade: this branch already collapses several
            -- specimens into one row per patient, so a per-specimen upgrade
            -- would SPLIT a partially-matched group into one NOS row and one
            -- specific row. If ANY specimen in the group matches, the group
            -- takes that value. Still event-scoped -- never crosses event_type.
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
            organization_name, mrn, research_id, dob, event_type,
            cns_diagnosis_category, cns_integrated_diagnosis_cbtn

        union distinct

        -- Non-initial events emit one row per diagnosis row, so attribution is
        -- strictly per-specimen here -- no broadcast.
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
    left join radiant_data_dev.pcx_30_organization_ref org
        on org.name = prelim.organization_name
);
