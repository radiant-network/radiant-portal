/*
   radiant_data_dev.radiant_patient_mrn_list -- stage 1b of the refresh
   (UPSTREAM_SOURCES.md §5).

   AUTHORITATIVE COPY: pcx_demo_table_sql_objects/radiant-prod/patient_mrn_list_prod.sql
   in the RADIANT-Timeline-Abstraction repo. A byte-identical copy is kept at
   'Nov 2026/prelim_30_sql/patient_mrn_list_radiant_prod.sql' in the demos folder, which
   is where this script was recovered from. Edit the repo copy and re-sync; `diff` the
   two to detect drift. The demos copy is NOT version-controlled -- do not treat it as
   the original.

   Recovered and repaired 2026-10-02 from the demos copy, which until then was the only
   copy and could not be run as-is: removed two broken scratch lines (a `create table`
   with no column list, then an unterminated `drop table`, which errored before reaching
   the real statement) and added the `if exists` guard. The SELECT is otherwise verbatim.
   The pre-repair original is preserved beside the demos copy as
   'patient_mrn_list_radiant_prod.sql.orig-20260921'.

   MUST run AFTER stg_cbtn_enrollment_final is loaded -- research_id is a LEFT JOIN to
   it, so running this against a stale enrollment table silently under-populates
   research_id.

   The three institution/identifier pairs below are hardcoded; a fourth site will NOT
   be picked up automatically. See UPSTREAM_SOURCES.md §3a.

   NOTE ON ATOMICITY: drop-then-CTAS leaves this table ABSENT if the Iceberg read
   fails, and 16 downstream files depend on it. For a live refresh, prefer building
   into a temp name, verifying, then swapping with two metadata renames:

     create table radiant_data_dev.radiant_patient_mrn_list_new<stamp> as ( <select below> );
     -- verify: row count, distinct patient_id = row count, research_id coverage,
     --         and 0 rows in (old EXCEPT new) on (patient_id, mrn)
     alter table radiant_data_dev.radiant_patient_mrn_list rename radiant_patient_mrn_list_bak<stamp>;
     alter table radiant_data_dev.radiant_patient_mrn_list_new<stamp> rename radiant_patient_mrn_list;

   THIS HEADER IS A BLOCK COMMENT DELIBERATELY. It was '--' line comments when first
   committed, which broke the file under `mysql < file`: the client splits input on ';',
   and StarRocks then REJECTS the resulting comment-only statement ('Unexpected input
   <EOF>') where MySQL server tolerates it. The SQL example above genuinely needs its
   semicolons, so the header must stay a block comment -- those are immune to the split.
   Do not convert it back to '--' lines.
*/

drop table if exists radiant_data_dev.radiant_patient_mrn_list;

create table radiant_data_dev.radiant_patient_mrn_list as (

select distinct patient_id, identifier_value as mrn, enr.research_id
from radiant_iceberg_catalog.fhir_cbtn_tenant_db.patient_identifier pi
left join radiant_data_dev.stg_cbtn_enrollment_final enr on pi.identifier_value=enr.mrn
	where (pi.identifier_type_text='EPI' and org_short_code='chop')
		or
		  (pi.identifier_type_text='SCHMRN' and org_short_code='seattle')
		or
			(pi.identifier_type_text='MRN' and org_short_code='ucsf')

)
