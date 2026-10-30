{{ config(
    materialized='view',
    tags=['pcx_30', 'combined', 'phi']
) }}

-- Combined identified + de-identified demographics in ONE relation.
--
-- CONTAINS PHI. This view re-links research_id to mrn, real given/family name, real
-- birth date, and real ZIP. It is an internal QA / crosswalk surface and must NOT be
-- shared the way pcx_30_demographics_deid is.
--
-- Field pairing rule: columns whose value is identical in the identified and
-- de-identified builds appear once. Columns that differ appear twice, adjacent,
-- identified value first, with the de-identified variant suffixed _deid (or carrying
-- its own distinct name, e.g. research_id / birth_year).
--
-- PHASE 3: the `subj` and `pts` CTEs are now refs to int_pcx_30_diagnosis_cohort and
-- int_pcx_30_fhir_patient_attributes, shared with pcx_30_demographics_deid, so the
-- cohort definition and the FHIR identifier-resolution rule exist once.
--
-- STILL READS stg_cbtn_enrollment_final DIRECTLY rather than the cohort roster: it
-- needs first_name, last_name, dob and dob_year, which the roster does not carry.
-- And data_type_cohort is derived from whether the FHIR identifier resolved, NOT from
-- the RADIANT MRN list as the roster does -- probably equivalent but not provably so,
-- so the original derivation is preserved.

with subj as (
    select * from {{ ref('int_pcx_30_diagnosis_cohort') }}
),

pts as (
    select * from {{ ref('int_pcx_30_fhir_patient_attributes') }}
)

select
    stg_cbtn_enrollment_final.organization_name,
    org.code as organization_code,

    -- identifier pair
    coalesce(pts.identifier_value, stg_cbtn_enrollment_final.mrn) as mrn,
    stg_cbtn_enrollment_final.research_id,

    -- name pairs (deid side is a placeholder built from research_id)
    coalesce(pts.given_name, stg_cbtn_enrollment_final.first_name) as given_name,
    concat(stg_cbtn_enrollment_final.research_id, '_given_name') as given_name_deid,
    coalesce(pts.family_name, stg_cbtn_enrollment_final.last_name) as family_name,
    concat(stg_cbtn_enrollment_final.research_id, '_family_name') as family_name_deid,

    -- birth pair: full date vs year only
    coalesce(pts.birth_date, stg_cbtn_enrollment_final.dob) as birth_date,
    stg_cbtn_enrollment_final.dob_year as birth_year,

    -- identical in both builds
    coalesce(pts.race, participants.race) as race,
    coalesce(pts.ethnicity, participants.ethnicity) as ethnicity,
    lower(coalesce(pts.gender, participants.legal_sex)) as gender,

    -- postal code pair: real vs masked
    coalesce(pts.address_postal_code, 'XXXXX') as address_postal_code,
    case
        when coalesce(pts.address_postal_code, '') = '' then 'XXXXX'
        when
            left(pts.address_postal_code, 3) in (
                '036', '692', '878', '059', '790', '879', '063',
                '821', '884', '102', '823', '890', '203', '830',
                '893', '556', '831'
            )
            then 'XXXXX'
        else concat(left(pts.address_postal_code, 3), 'XX')
    end as address_postal_code_deid,

    -- identical in both builds
    subj.cns_diagnosis_category as diagnosis_type_cohort,
    case when pts.identifier_value is null then 'cbtn-non-radiant' else 'radiant' end as data_type_cohort
from {{ source('dwh_source', 'stg_cbtn_enrollment_final') }} stg_cbtn_enrollment_final
inner join subj on subj.subject = stg_cbtn_enrollment_final.research_id
left join pts on stg_cbtn_enrollment_final.mrn = pts.identifier_value
left join {{ source('dwh_source', 'participants') }} participants
    on stg_cbtn_enrollment_final.research_id = participants.research_id
left join {{ ref('pcx_30_organization_ref') }} org
    on org.name = stg_cbtn_enrollment_final.organization_name
