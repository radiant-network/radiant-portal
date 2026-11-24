/*
   radiant_data_dev.pcx_30_pnoc035_brim_url  (TABLE)

   Curated BRIM UI deep links for the PNOC035 eligibility variable, joined by
   pnoc035_eligibility_prod.sql.

   THE DDL IS VERSIONED HERE; THE ROWS ARE NOT, AND MUST NOT BE. Both columns
   identify -- patient_mrn directly, and brim_url via BRIM's internal patient id,
   which resolves in the UI to the named patient. This repo is PUBLIC: no INSERTs,
   no seed CSV, no example values in any tracked file. An earlier revision of the
   eligibility script hard-coded one patient's MRN and link and was pushed here.

   Populate out of band from an operator session:
     insert into radiant_data_dev.pcx_30_pnoc035_brim_url
       (patient_mrn, brim_url, note, loaded_at) values (?, ?, ?, now());

   URL form: <host>/overview/project/<p>/visualize_variable/?var_ids=<v>&patient_id=<i>
   The variable id comes from GET /api/v1/projects/<p>/variables/ and the internal
   patient id from the generation queue's task_options.G_PATIENT_IDS -- neither is
   in the detailed export, which is why these are curated rather than derived.

   create-IF-NOT-EXISTS and it must stay that way: unlike the CTAS snapshots here,
   this is hand-curated and recorded nowhere else, so dropping it loses it.

   PHI in both columns. radiant_data_dev only; the access-controlled eligibility
   view masks brim_url behind can_read_phi.
*/

CREATE TABLE IF NOT EXISTS radiant_data_dev.pcx_30_pnoc035_brim_url (
  `patient_mrn` varchar(128)  NULL COMMENT "BRIM Patient_id (MRN-shaped), verbatim; join key to the eligibility table",
  `brim_url`    varchar(512)  NULL COMMENT "BRIM UI deep link; embeds BRIM's internal patient id, so it re-identifies",
  `note`        varchar(512)  NULL COMMENT "why this patient has a curated link",
  `loaded_at`   datetime      NULL COMMENT "when the row was curated"
) ENGINE=OLAP
DUPLICATE KEY(`patient_mrn`)
COMMENT "Curated BRIM UI deep links for PNOC035 eligibility. DDL is versioned; rows are operator-populated and must never be committed."
DISTRIBUTED BY RANDOM;
