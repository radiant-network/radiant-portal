{{ config(
    materialized='table',
    tags=['pcx_30', 'deid']
) }}

-- De-identified patient demographics.
--
-- NOTE this model does NOT use int_pcx_30_cohort_roster. The source script resolves
-- the cohort differently from its siblings: it joins FHIR patient attributes
-- (int_pcx_30_fhir_patient_attributes) rather than radiant_patient_mrn_list, and
-- derives data_type_cohort from whether the FHIR identifier resolved, not from
-- whether the MRN is in the RADIANT list. Those two predicates are probably
-- equivalent -- both filter the same identifier_type/org rule -- but they are NOT
-- provably so, so the original derivation is preserved verbatim rather than
-- refactored onto the shared roster.
--
-- DE-IDENTIFICATION APPLIED HERE (this is the whole point of the model):
--   * given_name / family_name are SYNTHETIC, built from research_id -- the real
--     names are never projected.
--   * birth_year replaces the full birth date (reads stg's dob_year, not dob).
--   * address_postal_code is truncated to ZIP3 + 'XX', and fully suppressed to
--     'XXXXX' for the 17 HIPAA low-population ZIP3 prefixes and for empty values.
--   * mrn is not projected at all.

with subj as (
    select * from {{ ref('int_pcx_30_diagnosis_cohort') }}
),

pts as (
    select * from {{ ref('int_pcx_30_fhir_patient_attributes') }}
)

select
    enr.organization_name,
    enr.research_id,
    concat(enr.research_id, '_given_name') as given_name,
    concat(enr.research_id, '_family_name') as family_name,
    enr.dob_year as birth_year,
    coalesce(pts.race, participants.race) as race,
    coalesce(pts.ethnicity, participants.ethnicity) as ethnicity,
    lower(coalesce(pts.gender, participants.legal_sex)) as gender,
    case
        when coalesce(pts.address_postal_code, '') = '' then 'XXXXX'
        when
            left(pts.address_postal_code, 3) in (
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
        else concat(left(pts.address_postal_code, 3), 'XX')
    end as address_postal_code,
    subj.cns_diagnosis_category as diagnosis_type_cohort,
    case
        when pts.identifier_value is null then 'cbtn-non-radiant'
        else 'radiant'
    end as data_type_cohort
from {{ source('dwh_source', 'stg_cbtn_enrollment_final') }} enr
inner join subj on subj.subject = enr.research_id
left join pts on enr.mrn = pts.identifier_value
left join {{ source('dwh_source', 'participants') }} participants
    on enr.research_id = participants.research_id
