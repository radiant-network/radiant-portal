/*
   radiant_data_dev.brim_patient_level  (TABLE)

   BRIM PATIENT-LEVEL exports, unpivoted to one row per variable per patient.

   From: patient-level export CSVs (POST /api/v1/results/, patient_export=true),
         named <date>-<project>-patient-<id>-patient-level.csv
   Loaded by: ../../load_brim_patient_level.py  (not dbt, not this file)

   WHY NOT brim_output. Different grain, different endpoint. brim_output is one
   row per label PER NOTE with 28 columns carrying note_id, offsets, raw_text,
   reasoning, confidence and the review trail -- per-note provenance is the point
   of that table. The patient-level export carries NONE of it, so merging would
   mean NULLing 26 of 28 columns, leaving rows indistinguishable from real ones in
   any query that does not filter on source_file yet unable to support the
   provenance joins everything downstream performs. Join the two on
   (patient_id, variable_name) when you want both.

   LONG FORM, because the wide form's COLUMNS ARE THE DATA: the export's width
   changes whenever the project gains a variable (measured 93 -> 94 in one day), so
   a wide table would need a migration per variable and two vintages of one patient
   would not be union-compatible. column_ordinal preserves the export's own order.

   APPEND-ONLY; the hazard is a duplicate load, not data loss. No primary key, so
   the loader refuses a source_file already present unless --replace. The basename
   carries the export DATE, so a re-export is accepted as a NEW vintage -- these
   values do move -- which means consumers MUST pick one:

     where loaded_at = (select max(loaded_at) from radiant_data_dev.brim_patient_level
                        where patient_id = b.patient_id)

   BLANK IS '' , NOT NULL (loaded verbatim) -- test trim(coalesce(value,''))=''.
   Non-blank is not informative either: 'No evidence', 'Unknown', 'Not Available',
   'Not Applicable', 'Cannot determine' and the zero-date sentinels all count as
   non-blank, and crf_variable_crosswalk.yaml's null_sentinels does not cover them.

   SIZING measured over 186 unpivoted rows: value 276, variable_name 77,
   patient_id 7. value is STRING because it grows (semicolon-joined criteria
   lists); variable_name is generous because brim_output's reaches 263.

   patient_id MUST stay varchar: zero-padded values exist and a numeric type
   destroys them. Project 54 mixes padded and unpadded and the padding is NOT ours
   to normalise -- the export accepts an id as BRIM holds it and 404s the padded
   variant of an unpadded one. Zero-padding is a live join trap against the portal
   patient table.

   PHI: birth dates and other real calendar dates. radiant_data_dev only; anything
   exposing it through cbtn_tenant needs the can_read_phi gate plus date
   suppression (see ../../access_controlled_views/).

   project_id is stored because brim_output's lesson is that an export table WILL
   accumulate unrelated projects -- that one mixes six -- and the patient-level
   export does not carry it, so the loader stamps it.
*/

CREATE TABLE IF NOT EXISTS radiant_data_dev.brim_patient_level (
  `patient_id`     varchar(128)   NULL COMMENT "BRIM Patient_MRN, verbatim; varchar to preserve leading zeros",
  `variable_name`  varchar(512)   NULL COMMENT "BRIM variable name, i.e. the export's column header",
  `value`          varchar(65533) NULL COMMENT "value verbatim; '' when unpopulated, never NULL",
  `project_id`     varchar(32)    NULL COMMENT "BRIM project the export was scoped to; stamped by the loader",
  `column_ordinal` int            NULL COMMENT "1-based position in the source export, after Patient_MRN",
  `source_file`    varchar(256)   NULL COMMENT "provenance: basename of the loaded export",
  `loaded_at`      datetime       NULL COMMENT "provenance: when this row was inserted"
) ENGINE=OLAP
DUPLICATE KEY(`patient_id`, `variable_name`)
COMMENT "BRIM patient-level exports, unpivoted to one row per variable per patient. Append-only. Distinct grain from brim_output, which is one row per label per note."
DISTRIBUTED BY RANDOM;
