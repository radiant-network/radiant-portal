/*
   radiant_data_dev.pcx_30_surgery_brim_url  (TABLE)

   Curated BRIM UI deep links, one per surgery, joined by
   v_pcx_30_surgery_level_combined. Sibling of pcx_30_pnoc035_brim_url -- read that
   file's header for the shared reasoning and the URL form.

   THE DDL IS VERSIONED HERE; THE ROWS ARE NOT, AND MUST NOT BE. patient_mrn and
   brim_url both identify, and this repo is PUBLIC. Populate out of band:
     insert into radiant_data_dev.pcx_30_surgery_brim_url
       (patient_mrn, age_at_surgery_days, brim_url, note, loaded_at)
       values (?, ?, ?, ?, now());

   IF NOT EXISTS, and never a dbt model: hand-curated, recorded nowhere else, so a
   drop-and-recreate loses it.

   (patient_mrn, age_at_surgery_days) is NOT a unique surgery key -- 38 of 9,326 rows
   share a (patient, age) pair, so a link on one decorates both. Accepted for the Nov
   2026 demo; pcx_row_uid (macros/pcx_30_provenance.sql) is the right key if this
   outlives it. DUPLICATE KEY enforces nothing either, so a second row for one
   surgery duplicates that row in both views.
*/

CREATE TABLE IF NOT EXISTS radiant_data_dev.pcx_30_surgery_brim_url (
  `patient_mrn`         varchar(128) NULL COMMENT "BRIM Patient_id (MRN-shaped), verbatim; join key to v_pcx_30_surgery_level_combined.mrn",
  `age_at_surgery_days` varchar(64)  NULL COMMENT "age_at_surgery_days of the surgery this link evidences, as the view spells it (varchar; may be a negative or 'Not Reported' sentinel)",
  `brim_url`            varchar(512) NULL COMMENT "BRIM UI deep link; embeds BRIM's internal patient id, so it re-identifies",
  `note`                varchar(512) NULL COMMENT "why this surgery has a curated link",
  `loaded_at`           datetime     NULL COMMENT "when the row was curated"
) ENGINE=OLAP
DUPLICATE KEY(`patient_mrn`, `age_at_surgery_days`)
COMMENT "Curated BRIM UI deep links per surgery. DDL is versioned; rows are operator-populated and must never be committed."
DISTRIBUTED BY RANDOM;
