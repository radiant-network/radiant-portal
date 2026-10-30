{{ config(
    materialized='table',
    tags=['pcx_30', 'intermediate']
) }}

-- The `pts` CTE from demographics_prod.sql: FHIR patient attributes resolved through
-- the site-specific MRN identifier types.
--
-- Same three-way identifier_type_text / org_short_code rule as the
-- radiant_patient_mrn_list model (EPI@chop, SCHMRN@seattle, MRN@ucsf), but selecting
-- the demographic columns rather than just the id. Kept as its own model instead of
-- extending radiant_patient_mrn_list, because the wider select changes the distinct
-- grain and that model is consumed elsewhere.
--
-- PHI: carries given_name, family_name, birth_date and full postal code. The _deid
-- consumer never projects the names or birth_date, and masks the postal code.
--
-- NOTE the left join to stg_cbtn_enrollment_final contributes no column to the
-- select. It is preserved verbatim from the source CTE; any fan-out it causes is
-- absorbed by the select distinct.
--
-- GRAIN: one row per distinct combination of the selected columns -- effectively one
-- row per (patient_id, identifier_value), but not asserted here.

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
from {{ source('radiant_fhir', 'patient_identifier') }} pi
left join {{ source('dwh_source', 'stg_cbtn_enrollment_final') }} enr
    on pi.identifier_value = enr.mrn
left join {{ source('radiant_fhir', 'patient') }} pat
    on pi.patient_id = pat.id
where (pi.identifier_type_text = 'EPI' and pi.org_short_code = 'chop')
   or (pi.identifier_type_text = 'SCHMRN' and pi.org_short_code = 'seattle')
   or (pi.identifier_type_text = 'MRN' and pi.org_short_code = 'ucsf')
