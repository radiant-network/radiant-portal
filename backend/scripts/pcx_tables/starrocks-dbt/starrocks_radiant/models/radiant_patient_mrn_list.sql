
{{ config(materialized='table',
tags=["ids"]) }}

/*
   radiant_patient_mrn_list -- the mrn <-> research_id <-> FHIR id bridge.

   TWO ARMS. fhir_identified: patients with a FHIR patient_identifier row, carrying
   research_id where enrollment knows them -- this was the whole model before
   2026-11-03. enrollment_only: patients CBTN enrolled but ABSENT from the FHIR
   data, so patient_id is NULL by construction.

   WHY THE SECOND ARM. Starting from patient_identifier made a FHIR row a
   precondition for appearing here at all, so an enrolled patient with no FHIR data
   was invisible to every consumer of this bridge: 4,495 of 7,240 enrollment MRNs
   were absent. The symptom was a CHLA patient who resolves to a research_id in
   enrollment but had no row, so a BRIM-derived PNOC035 eligibility row could not
   be given a research_id or an organization. 2,990 -> 7,485 rows.

   RAW EQUALITY IS CORRECT HERE -- DO NOT ADD ZERO-STRIPPING. The anti-join returns
   the SAME 4,495 MRNs under raw `=` and under regexp_replace(mrn,'^0+',''), because
   enrollment and the FHIR identifier values are one identifier space. Stripping
   belongs to the radiant_jdbc.public.patient join, whose submitter_patient_id is
   zero-padded; do not generalise. (UPSTREAM_SOURCES.md once claimed stripping was
   needed here; corrected in d22ea13ec.)

   THE `mrn is not null` GUARD IS LOAD-BEARING. `NOT IN` against a subquery
   yielding even one NULL is NULL for every row, so the enrollment arm would
   silently return ZERO rows and the model would look unchanged. Arm 1 can produce
   a NULL mrn, so this is not theoretical.

   37 enrollment rows carry a NULL research_id, 4 already FHIR-matched. The other
   33 would arrive with patient_id AND research_id NULL -- an MRN with nothing to
   bridge to -- so the arm requires a non-empty research_id. The 249 pre-existing
   NULL-research_id rows in arm 1 are different: they carry a FHIR patient_id.
*/

with fhir_identified as (

    select distinct
           pi.patient_id,
           pi.identifier_value as mrn,
           enr.research_id
    from {{ source('radiant_fhir','patient_identifier') }} pi
    left join {{ source('dwh_source','stg_cbtn_enrollment_final') }} enr
           on pi.identifier_value = enr.mrn
    where (pi.identifier_type_text = 'EPI' and org_short_code = 'chop')
       or (pi.identifier_type_text = 'SCHMRN' and org_short_code = 'seattle')
       or (pi.identifier_type_text = 'MRN' and org_short_code = 'ucsf')

),

enrollment_only as (

    select distinct
           cast(null as string) as patient_id,
           enr.mrn,
           enr.research_id
    from {{ source('dwh_source','stg_cbtn_enrollment_final') }} enr
    where enr.mrn is not null
      and trim(enr.mrn) <> ''
      and enr.research_id is not null
      and trim(enr.research_id) <> ''
      and enr.mrn not in (select mrn
                          from fhir_identified
                          where mrn is not null)

)

select patient_id, mrn, research_id from fhir_identified
union all
select patient_id, mrn, research_id from enrollment_only
