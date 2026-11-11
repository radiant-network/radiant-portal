drop table if exists radiant_tests.pcx_30_demographics;
drop table if exists radiant_tests.pcx_30_demographics_deid;

create table radiant_tests.pcx_30_demographics as (
    with subj as (
        select distinct subject, cns_diagnosis_category
        from radiant_tests.diagnosis
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

	pts as (
        select distinct
            id,
            identifier_mrn,
            'chop' as org_short_code,
            given_name,
            family_name,
            birth_date,
            race,
            ethnicity,
            gender,
            address_postal_code
        from radiant_iceberg_catalog.fhir_chop_v2_2_0_qa_db.patient

        union distinct

        select distinct
            patient_id,
            identifier_value,
            'seattle' as org_short_code,
            given_name,
            family_name,
            birth_date,
            race,
            ethnicity,
            gender,
            address_postal_code
        from
            radiant_iceberg_catalog.fhir_seattle_prd_v2_2_0_qa_db.patient_identifier
        inner join
            radiant_iceberg_catalog.fhir_seattle_prd_v2_2_0_qa_db.patient
            on patient_id = patient.id
        where identifier_type_text = 'SCHMRN'

        union distinct

        select distinct
            patient_id,
            identifier_value,
            'ucsf' as org_short_code,
            given_name,
            family_name,
            birth_date,
            race,
            ethnicity,
            gender,
            address_postal_code
        from
            radiant_iceberg_catalog.fhir_ucsf_prd_v2_2_0_qa_db.patient_identifier
        inner join
            radiant_iceberg_catalog.fhir_ucsf_prd_v2_2_0_qa_db.patient
            on patient_id = patient.id
        where identifier_type_text = 'MRN'
    )

    select
        stg_cbtn_enrollment_final.organization_name,
        coalesce(pts.identifier_mrn,stg_cbtn_enrollment_final.mrn) mrn,
        coalesce(pts.given_name,stg_cbtn_enrollment_final.first_name) as given_name,
        coalesce(pts.family_name,stg_cbtn_enrollment_final.last_name) as family_name,
        coalesce(pts.birth_date,stg_cbtn_enrollment_final.dob) as birth_date,
        coalesce(pts.race,participants.race) as race,
        coalesce(pts.ethnicity, participants.ethnicity) as ethnicity,
        coalesce(pts.gender,participants.legal_sex) as gender,
        coalesce(pts.address_postal_code, 'XXXXX') as address_postal_code,
        subj.cns_diagnosis_category as diagnosis_type_cohort,
        case when pts.identifier_mrn is null then 'cbtn-non-radiant' else 'radiant' end as data_type_cohort
    from radiant_tests.stg_cbtn_enrollment_final
    inner join subj on subj.subject=stg_cbtn_enrollment_final.research_id
    left join pts on stg_cbtn_enrollment_final.mrn=pts.identifier_mrn
    left join radiant_tests.participants on stg_cbtn_enrollment_final.research_id=participants.research_id


);

create table radiant_tests.pcx_30_demographics_deid as (
    with subj as (
        select distinct subject, cns_diagnosis_category
        from radiant_tests.diagnosis
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
    
    pts as (
        select distinct
            id,
            identifier_mrn,
            'chop' as org_short_code,
            given_name,
            family_name,
            birth_date,
            race,
            ethnicity,
            gender,
            address_postal_code
        from radiant_iceberg_catalog.fhir_chop_v2_2_0_qa_db.patient

        union distinct

        select distinct
            patient_id,
            identifier_value,
            'seattle' as org_short_code,
            given_name,
            family_name,
            birth_date,
            race,
            ethnicity,
            gender,
            address_postal_code
        from
            radiant_iceberg_catalog.fhir_seattle_prd_v2_2_0_qa_db.patient_identifier
        inner join
            radiant_iceberg_catalog.fhir_seattle_prd_v2_2_0_qa_db.patient
            on patient_id = patient.id
        where identifier_type_text = 'SCHMRN'

        union distinct

        select distinct
            patient_id,
            identifier_value,
            'ucsf' as org_short_code,
            given_name,
            family_name,
            birth_date,
            race,
            ethnicity,
            gender,
            address_postal_code
        from
            radiant_iceberg_catalog.fhir_ucsf_prd_v2_2_0_qa_db.patient_identifier
        inner join
            radiant_iceberg_catalog.fhir_ucsf_prd_v2_2_0_qa_db.patient
            on patient_id = patient.id
        where identifier_type_text = 'MRN'
    )

    select
        stg_cbtn_enrollment_final.organization_name,
        stg_cbtn_enrollment_final.research_id,
        concat(stg_cbtn_enrollment_final.research_id, '_given_name') as given_name,
        concat(stg_cbtn_enrollment_final.research_id, '_family_name') as family_name,
        stg_cbtn_enrollment_final.dob_year as birth_date,
        coalesce(pts.race,participants.race) as race,
        coalesce(pts.ethnicity, participants.ethnicity) as ethnicity,
        coalesce(pts.gender,participants.legal_sex) as gender,
        case
            when coalesce(address_postal_code, '') = '' then 'XXXXX'
            when
                left(address_postal_code, 3) in (
                    '036',
                    '692',
                    '878',
                    '059',
                    '790',
                    '879',
                    '063',
                    '821',
                    '884',
                    '102',
                    '823',
                    '890',
                    '203',
                    '830',
                    '893',
                    '556',
                    '831'
                )
                then 'XXXXX'
            else concat(left(address_postal_code, 3), 'XX')
        end as address_postal_code,
        subj.cns_diagnosis_category as diagnosis_type_cohort,
        case when pts.identifier_mrn is null then 'cbtn-non-radiant' else 'radiant' end as data_type_cohort
    from radiant_tests.stg_cbtn_enrollment_final
    inner join subj on subj.subject=stg_cbtn_enrollment_final.research_id
    left join pts on stg_cbtn_enrollment_final.mrn=pts.identifier_mrn
    left join radiant_tests.participants on stg_cbtn_enrollment_final.research_id=participants.research_id

)
