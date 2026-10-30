
{{ config(materialized='table',
tags=["ids"]) }}

select distinct patient_id, identifier_value as mrn, enr.research_id
from {{ source ('radiant_fhir','patient_identifier')}} pi
left join {{ source ('dwh_source','stg_cbtn_enrollment_final')}} enr on pi.identifier_value=enr.mrn
	where (pi.identifier_type_text='EPI' and org_short_code='chop')
		or
		  (pi.identifier_type_text='SCHMRN' and org_short_code='seattle')
		or
			(pi.identifier_type_text='MRN' and org_short_code='ucsf')
