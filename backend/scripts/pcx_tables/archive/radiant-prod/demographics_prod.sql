drop table if exists radiant_data_dev.pcx_30_demographics;
drop table if exists radiant_data_dev.pcx_30_demographics_deid;

create table radiant_data_dev.pcx_30_demographics as (
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

	pts as (
        select distinct
            pat.id,
            pi.identifier_value,
            pat.org_short_code,
            pat.given_name,
            pat.family_name,
            pat.birth_date,
            pat.race,
            pat.ethnicity,
            pat.gender,
            pat.address_postal_code
     from radiant_iceberg_catalog.fhir_cbtn_tenant_db.patient_identifier pi 
	 left join radiant_data_dev.stg_cbtn_enrollment_final enr on pi.identifier_value=enr.mrn
	 left join radiant_iceberg_catalog.fhir_cbtn_tenant_db.patient pat on pi.patient_id=pat.id
	 where (pi.identifier_type_text='EPI' and pi.org_short_code='chop')
		or 
		  (pi.identifier_type_text='SCHMRN' and pi.org_short_code='seattle')
		or 
			(pi.identifier_type_text='MRN' and pi.org_short_code='ucsf')
    )

    select
        stg_cbtn_enrollment_final.organization_name,
        coalesce(pts.identifier_value,stg_cbtn_enrollment_final.mrn) mrn,
        coalesce(pts.given_name,stg_cbtn_enrollment_final.first_name) as given_name,
        coalesce(pts.family_name,stg_cbtn_enrollment_final.last_name) as family_name,
        coalesce(pts.birth_date,stg_cbtn_enrollment_final.dob) as birth_date,
        coalesce(pts.race,participants.race) as race,
        coalesce(pts.ethnicity, participants.ethnicity) as ethnicity,
        lower(coalesce(pts.gender,participants.legal_sex)) as gender,
        coalesce(pts.address_postal_code, 'XXXXX') as address_postal_code,
        subj.cns_diagnosis_category as diagnosis_type_cohort,
        case when pts.identifier_value is null then 'cbtn-non-radiant' else 'radiant' end as data_type_cohort
    from radiant_data_dev.stg_cbtn_enrollment_final
    inner join subj on subj.subject=stg_cbtn_enrollment_final.research_id
    left join pts on stg_cbtn_enrollment_final.mrn=pts.identifier_value
    left join radiant_data_dev.participants on stg_cbtn_enrollment_final.research_id=participants.research_id


);

create table radiant_data_dev.pcx_30_demographics_deid as (
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

	pts as (
        select distinct
            pat.id,
            pi.identifier_value,
            pat.org_short_code,
            pat.given_name,
            pat.family_name,
            pat.birth_date,
            pat.race,
            pat.ethnicity,
            pat.gender,
            pat.address_postal_code
     from radiant_iceberg_catalog.fhir_cbtn_tenant_db.patient_identifier pi 
	 left join radiant_data_dev.stg_cbtn_enrollment_final enr on pi.identifier_value=enr.mrn
	 left join radiant_iceberg_catalog.fhir_cbtn_tenant_db.patient pat on pi.patient_id=pat.id
	 where (pi.identifier_type_text='EPI' and pi.org_short_code='chop')
		or 
		  (pi.identifier_type_text='SCHMRN' and pi.org_short_code='seattle')
		or 
			(pi.identifier_type_text='MRN' and pi.org_short_code='ucsf')
    )

    
    select
        stg_cbtn_enrollment_final.organization_name,
        stg_cbtn_enrollment_final.research_id,
        concat(stg_cbtn_enrollment_final.research_id, '_given_name') as given_name,
        concat(stg_cbtn_enrollment_final.research_id, '_family_name') as family_name,
        stg_cbtn_enrollment_final.dob_year as birth_year,
        coalesce(pts.race,participants.race) as race,
        coalesce(pts.ethnicity, participants.ethnicity) as ethnicity,
        lower(coalesce(pts.gender,participants.legal_sex)) as gender,
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
        case when pts.identifier_value is null then 'cbtn-non-radiant' else 'radiant' end as data_type_cohort
    from radiant_data_dev.stg_cbtn_enrollment_final
    inner join subj on subj.subject=stg_cbtn_enrollment_final.research_id
    left join pts on stg_cbtn_enrollment_final.mrn=pts.identifier_value
    left join radiant_data_dev.participants on stg_cbtn_enrollment_final.research_id=participants.research_id

);
