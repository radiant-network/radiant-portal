/*
   pcx_30_data_dictionary  (TABLE, radiant_data_dev)

   Field-level data dictionary for the seven pcx_30_*_deid release tables.
   Loaded from prelim_30_deid_tables/data_dictionary.csv -- that CSV remains the
   authoring source of truth; this table is its queryable projection.

   Column notes:
     display_order  preserves the authored CSV row order (SQL does not guarantee
                    row order, so ORDER BY display_order reproduces the CSV).
     table_name     the .csv suffix stripped, so it joins to the real table names
                    and to information_schema.tables.table_name.
     source_file    the original CSV filename, retained verbatim.
     field_name     NULL on the 7 table-level rows (those describe the whole
                    table rather than a single field).
     description    verbatim from the CSV.

   The source column was named "table", which is a SQL reserved word -- renamed
   here to table_name.

   2026-10-02: added protocol_name + protocol_arm for
   pcx_30_medical_therapy_level_deid (display_order 29 and 30), which shifted every
   later display_order by 2 -- 71 rows became 73. Because display_order is positional,
   DO NOT hand-insert a row mid-list: regenerate this whole values block from the CSV
   so the numbering and the CSV order cannot drift apart. Verified on regeneration
   that all 71 pre-existing rows were reproduced with identical content and relative
   order, and that nothing was dropped.

   2026-10-05: added cns_integrated_diagnosis_source for pcx_30_event_level_deid
   (display_order 23), shifting every later display_order by 1 -- 73 rows became 74.
   Regenerated wholesale from data_dictionary.csv per the instruction above rather
   than hand-inserted. Verified all 73 pre-existing rows reproduced with identical
   content and relative order, protocol_name/protocol_arm included.
 */

drop table if exists radiant_data_dev.pcx_30_data_dictionary;

create table radiant_data_dev.pcx_30_data_dictionary (
  `display_order` INT          COMMENT 'authored row order from data_dictionary.csv',
  `table_name`    VARCHAR(128) COMMENT 'release table name (.csv suffix stripped)',
  `source_file`   VARCHAR(128) COMMENT 'original CSV filename',
  `field_name`    VARCHAR(128) COMMENT 'field described; NULL = row describes the table',
  `description`   VARCHAR(2000) COMMENT 'field or table description'
)
ENGINE=OLAP
COMMENT 'Data dictionary for the pcx_30_*_deid release tables'
DISTRIBUTED BY RANDOM;

insert into radiant_data_dev.pcx_30_data_dictionary
  (display_order, table_name, source_file, field_name, description)
values
  (1, 'pcx_30_demographics_deid', 'pcx_30_demographics_deid.csv', NULL, 'Patient demographic and cohort information, including birth year, race, ethnicity, sex, geographic area, and the diagnosis and data source cohorts the patient belongs to.'),
  (2, 'pcx_30_demographics_deid', 'pcx_30_demographics_deid.csv', 'organization_name', 'Name of the institution that contributed the patient''s data to this release.'),
  (3, 'pcx_30_demographics_deid', 'pcx_30_demographics_deid.csv', 'research_id', 'De-identified patient research identifier.'),
  (4, 'pcx_30_demographics_deid', 'pcx_30_demographics_deid.csv', 'given_name', 'De-identification placeholder for the patient''s first name; contains no real name information.'),
  (5, 'pcx_30_demographics_deid', 'pcx_30_demographics_deid.csv', 'family_name', 'De-identification placeholder for the patient''s last name; contains no real name information.'),
  (6, 'pcx_30_demographics_deid', 'pcx_30_demographics_deid.csv', 'birth_year', 'Patient''s year of birth. Month and day are removed for de-identification.'),
  (7, 'pcx_30_demographics_deid', 'pcx_30_demographics_deid.csv', 'race', 'Patient''s race as reported by the contributing institution.'),
  (8, 'pcx_30_demographics_deid', 'pcx_30_demographics_deid.csv', 'ethnicity', 'Patient''s ethnicity as reported by the contributing institution.'),
  (9, 'pcx_30_demographics_deid', 'pcx_30_demographics_deid.csv', 'gender', 'Patient''s administrative sex as recorded by the contributing institution.'),
  (10, 'pcx_30_demographics_deid', 'pcx_30_demographics_deid.csv', 'address_postal_code', 'Patient''s residential ZIP code, partially masked for de-identification.'),
  (11, 'pcx_30_demographics_deid', 'pcx_30_demographics_deid.csv', 'diagnosis_type_cohort', 'The patient''s primary diagnosis group used to define the cohort for this release.'),
  (12, 'pcx_30_demographics_deid', 'pcx_30_demographics_deid.csv', 'data_type_cohort', 'The source cohort the patient''s data came from: ''radiant'' for RADIANT patients, ''cbtn-non-radiant'' for CBTN patients not in RADIANT.'),
  (13, 'pcx_30_event_level_deid', 'pcx_30_event_level_deid.csv', NULL, 'Disease events across the patient''s cancer journey, including initial diagnosis, progression, recurrence, second malignancy, and death, with the diagnosis, tumor location, and metastasis status recorded at each event.'),
  (14, 'pcx_30_event_level_deid', 'pcx_30_event_level_deid.csv', 'organization_name', 'Name of the institution that contributed the patient''s data to this release.'),
  (15, 'pcx_30_event_level_deid', 'pcx_30_event_level_deid.csv', 'research_id', 'De-identified patient research identifier.'),
  (16, 'pcx_30_event_level_deid', 'pcx_30_event_level_deid.csv', 'event_type', 'The type of diagnosis-related event determined via surgery, imaging, or clinical observation.'),
  (17, 'pcx_30_event_level_deid', 'pcx_30_event_level_deid.csv', 'age_at_event_days', 'Patient age in days at the diagnosis-related event. A value of -1 indicates an unknown date.'),
  (18, 'pcx_30_event_level_deid', 'pcx_30_event_level_deid.csv', 'metastasis', 'Whether metastatic disease was present at the time of the event.'),
  (19, 'pcx_30_event_level_deid', 'pcx_30_event_level_deid.csv', 'metastasis_location', 'The site of the metastasis.'),
  (20, 'pcx_30_event_level_deid', 'pcx_30_event_level_deid.csv', 'metastasis_location_other', 'Free-text value supplied when the coded metastasis_location does not cover the finding (the site of the metastasis).'),
  (21, 'pcx_30_event_level_deid', 'pcx_30_event_level_deid.csv', 'cns_diagnosis_category', 'The diagnosis at the time of the event (broad diagnosis category).'),
  (22, 'pcx_30_event_level_deid', 'pcx_30_event_level_deid.csv', 'cns_integrated_diagnosis', 'The diagnosis at the time of the event (WHO integrated histologic plus molecular diagnosis). Where CBTN recorded only a non-specific "NOS or NEC" value and a more specific molecular subtype was available from OpenPedCan for that event''s biospecimen, the more specific value is shown instead; cns_integrated_diagnosis_source records which source won.'),
  (23, 'pcx_30_event_level_deid', 'pcx_30_event_level_deid.csv', 'cns_integrated_diagnosis_source', 'Which source supplied cns_integrated_diagnosis on this row: ''CBTN'' where the value is as CBTN recorded it, or ''OpenPedCan'' where a non-specific CBTN "NOS or NEC" value was replaced by a more specific molecular subtype from openpedcan_histologies_annotated, matched on the event''s biospecimen sample ID.'),
  (24, 'pcx_30_event_level_deid', 'pcx_30_event_level_deid.csv', 'tumor_locations', 'The anatomical site of the tumor.'),
  (25, 'pcx_30_event_level_deid', 'pcx_30_event_level_deid.csv', 'tumor_location_other', 'Free-text value supplied when the coded tumor_locations does not cover the finding (the anatomical site of the tumor).'),
  (26, 'pcx_30_medical_therapy_level_deid', 'pcx_30_medical_therapy_level_deid.csv', NULL, 'Systemic therapy treatment, including the treatment protocol, whether the patient was enrolled on that protocol, the treatment timing expressed as patient age in days, the chemotherapy agents administered, and whether the regimen was part of the patient''s initial treatment.'),
  (27, 'pcx_30_medical_therapy_level_deid', 'pcx_30_medical_therapy_level_deid.csv', 'organization_name', 'Name of the institution that contributed the patient''s data to this release.'),
  (28, 'pcx_30_medical_therapy_level_deid', 'pcx_30_medical_therapy_level_deid.csv', 'research_id', 'De-identified patient research identifier.'),
  (29, 'pcx_30_medical_therapy_level_deid', 'pcx_30_medical_therapy_level_deid.csv', 'protocol_name_and_arm', 'Name of the treatment protocol the patient is enrolled on or being treated in accordance with.'),
  (30, 'pcx_30_medical_therapy_level_deid', 'pcx_30_medical_therapy_level_deid.csv', 'protocol_name', 'The protocol name alone, taken from protocol_name_and_arm by splitting on the first colon. When the value has no colon the whole value is repeated here, so a sentinel such as Not Applicable, Not Reported or Other appears unchanged. The same trial appears both with and without an arm, and all of its rows share one protocol_name, so this column can be grouped on.'),
  (31, 'pcx_30_medical_therapy_level_deid', 'pcx_30_medical_therapy_level_deid.csv', 'protocol_arm', 'The arm, stratum or regimen within the protocol, taken from protocol_name_and_arm by splitting on the first colon; any further colons are kept, for example Stratum N1: Standard Risk. Not Applicable when the value has no colon, which covers both a protocol that genuinely has no arm and a protocol that is itself unrecorded, so read protocol_name before treating this as an absence of arm.'),
  (32, 'pcx_30_medical_therapy_level_deid', 'pcx_30_medical_therapy_level_deid.csv', 'chemotherapy_type', 'Whether the regimen followed a treatment protocol (with or without enrollment) or other standard of care.'),
  (33, 'pcx_30_medical_therapy_level_deid', 'pcx_30_medical_therapy_level_deid.csv', 'age_at_regimen_start_days', 'Patient age in days at the start of the medical therapy regimen.'),
  (34, 'pcx_30_medical_therapy_level_deid', 'pcx_30_medical_therapy_level_deid.csv', 'age_at_regimen_stop_days', 'Patient age in days at the end of the medical therapy regimen.'),
  (35, 'pcx_30_medical_therapy_level_deid', 'pcx_30_medical_therapy_level_deid.csv', 'chemotherapy_agents', 'Therapeutic agent being administered.'),
  (36, 'pcx_30_medical_therapy_level_deid', 'pcx_30_medical_therapy_level_deid.csv', 'is_initial_treatment', 'yes/no column indicating whether this regimen was part of the patient''s initial treatment (the treatment that occurred prior to the first relapse, progression, second malignancy, or death). ''no'' also covers rows where this could not be determined.'),
  (37, 'pcx_30_patient_level_deid', 'pcx_30_patient_level_deid.csv', NULL, 'Patient survival information, including the most recent known vital status and the patient age in days at which it was determined.'),
  (38, 'pcx_30_patient_level_deid', 'pcx_30_patient_level_deid.csv', 'research_id', 'De-identified patient research identifier.'),
  (39, 'pcx_30_patient_level_deid', 'pcx_30_patient_level_deid.csv', 'age_at_vital_status_days', 'Patient age in days at the most recent known vital status.'),
  (40, 'pcx_30_patient_level_deid', 'pcx_30_patient_level_deid.csv', 'vital_status', 'The patient''s most recent known vital status, as of the patient age in age_at_vital_status_days.'),
  (41, 'pcx_30_radiation_level_deid', 'pcx_30_radiation_level_deid.csv', NULL, 'Radiation therapy treatment, including the treatment timing expressed as patient age in days, the field or site treated, the radiation method delivered, the prescribed dose, and whether the course was part of the patient''s initial treatment.'),
  (42, 'pcx_30_radiation_level_deid', 'pcx_30_radiation_level_deid.csv', 'organization_name', 'Name of the institution that contributed the patient''s data to this release.'),
  (43, 'pcx_30_radiation_level_deid', 'pcx_30_radiation_level_deid.csv', 'research_id', 'De-identified patient research identifier.'),
  (44, 'pcx_30_radiation_level_deid', 'pcx_30_radiation_level_deid.csv', 'age_at_radiation_start_days', 'Patient age in days at the start of the radiation round.'),
  (45, 'pcx_30_radiation_level_deid', 'pcx_30_radiation_level_deid.csv', 'age_at_radiation_stop_days', 'Patient age in days at the end of the radiation round.'),
  (46, 'pcx_30_radiation_level_deid', 'pcx_30_radiation_level_deid.csv', 'radiation_site', 'Field or site of radiation.'),
  (47, 'pcx_30_radiation_level_deid', 'pcx_30_radiation_level_deid.csv', 'radiation_site_other', 'Free-text value supplied when the coded radiation_site does not cover the finding (field or site of radiation).'),
  (48, 'pcx_30_radiation_level_deid', 'pcx_30_radiation_level_deid.csv', 'radiation_type', 'Method or type of radiation delivered.'),
  (49, 'pcx_30_radiation_level_deid', 'pcx_30_radiation_level_deid.csv', 'radiation_type_other', 'Free-text value supplied when the coded radiation_type does not cover the finding (method or type of radiation delivered).'),
  (50, 'pcx_30_radiation_level_deid', 'pcx_30_radiation_level_deid.csv', 'total_radiation_dose', 'Dose of craniospinal radiation given.'),
  (51, 'pcx_30_radiation_level_deid', 'pcx_30_radiation_level_deid.csv', 'total_radiation_dose_unit', 'Unit of measure for total_radiation_dose (dose of craniospinal radiation given).'),
  (52, 'pcx_30_radiation_level_deid', 'pcx_30_radiation_level_deid.csv', 'total_radiation_dose_focal', 'Total radiation given to the primary site.'),
  (53, 'pcx_30_radiation_level_deid', 'pcx_30_radiation_level_deid.csv', 'total_radiation_dose_focal_unit', 'Unit of measure for total_radiation_dose_focal (total radiation given to the primary site).'),
  (54, 'pcx_30_radiation_level_deid', 'pcx_30_radiation_level_deid.csv', 'is_initial_treatment', 'yes/no column indicating whether this radiation course was part of the patient''s initial treatment (the treatment that occurred prior to the first relapse, progression, second malignancy, or death), based on the course start age. ''no'' also covers rows where this could not be determined.'),
  (55, 'pcx_30_surgery_level_deid', 'pcx_30_surgery_level_deid.csv', NULL, 'Tumor-directed surgery, including the patient age in days at the procedure, the extent of tumor resection achieved, and whether the surgery was part of the patient''s initial treatment.'),
  (56, 'pcx_30_surgery_level_deid', 'pcx_30_surgery_level_deid.csv', 'organization_name', 'Name of the institution that contributed the patient''s data to this release.'),
  (57, 'pcx_30_surgery_level_deid', 'pcx_30_surgery_level_deid.csv', 'research_id', 'De-identified patient research identifier.'),
  (58, 'pcx_30_surgery_level_deid', 'pcx_30_surgery_level_deid.csv', 'age_at_surgery_days', 'Patient age in days when the tumor-related surgery (resection or biopsy) was performed. A value of -1 indicates an unknown date.'),
  (59, 'pcx_30_surgery_level_deid', 'pcx_30_surgery_level_deid.csv', 'extent_of_tumor_resection', 'Extent of tumor resection performed during the surgery.'),
  (60, 'pcx_30_surgery_level_deid', 'pcx_30_surgery_level_deid.csv', 'is_initial_treatment', 'yes/no column indicating whether this surgery was part of the patient''s initial treatment (the treatment that occurred prior to the first relapse, progression, second malignancy, or death). ''no'' also covers rows where this could not be determined.'),
  (61, 'pcx_30_treatment_summary_deid', 'pcx_30_treatment_summary_deid.csv', NULL, 'Summary measures of each patient''s initial treatment, including patient age in days at initial diagnosis and at first event, the age in days at the first-ever and first-initial radiation and chemotherapy, the age at first-ever methotrexate, whether each was part of initial treatment, and the order in which radiation and chemotherapy were given.'),
  (62, 'pcx_30_treatment_summary_deid', 'pcx_30_treatment_summary_deid.csv', 'research_id', 'De-identified patient research identifier.'),
  (63, 'pcx_30_treatment_summary_deid', 'pcx_30_treatment_summary_deid.csv', 'organization_name', 'Name of the institution that contributed the patient''s data to this release.'),
  (64, 'pcx_30_treatment_summary_deid', 'pcx_30_treatment_summary_deid.csv', 'age_at_initial_dx_days', 'Patient age in days at initial CNS diagnosis. A value of -1 indicates an unknown date.'),
  (65, 'pcx_30_treatment_summary_deid', 'pcx_30_treatment_summary_deid.csv', 'age_at_first_event_days', 'Patient age in days at first event that is of event type progression, recurrence, second malignancy, or deceased. A value of -1 indicates an unknown date.'),
  (66, 'pcx_30_treatment_summary_deid', 'pcx_30_treatment_summary_deid.csv', 'age_at_first_radiation_ever_days', 'Patient age in days at the start of the patient''s first radiation treatment ever, whether or not it was part of initial treatment.'),
  (67, 'pcx_30_treatment_summary_deid', 'pcx_30_treatment_summary_deid.csv', 'age_at_initial_radiation_days', 'Patient age in days at the start of the first radiation treatment that was part of the patient''s initial treatment. Null when no radiation fell within the initial treatment window.'),
  (68, 'pcx_30_treatment_summary_deid', 'pcx_30_treatment_summary_deid.csv', 'age_at_first_chemo_ever_days', 'Patient age in days at the start of the patient''s first chemotherapy regimen ever, for any agent, whether or not it was part of initial treatment.'),
  (69, 'pcx_30_treatment_summary_deid', 'pcx_30_treatment_summary_deid.csv', 'age_at_initial_chemo_days', 'Patient age in days at the start of the first chemotherapy regimen that was part of the patient''s initial treatment. Null when no chemotherapy fell within the initial treatment window.'),
  (70, 'pcx_30_treatment_summary_deid', 'pcx_30_treatment_summary_deid.csv', 'age_at_first_methotrexate_ever_days', 'Patient age in days at the start of the patient''s first methotrexate regimen ever, whether or not it was part of initial treatment.'),
  (71, 'pcx_30_treatment_summary_deid', 'pcx_30_treatment_summary_deid.csv', 'had_initial_radiation', 'Yes/No column indicating whether the patient had radiation as part of their initial treatment (the treatment that occurred prior to the first relapse, progression, second malignancy, or death). ''no'' also covers rows where this could not be determined.'),
  (72, 'pcx_30_treatment_summary_deid', 'pcx_30_treatment_summary_deid.csv', 'had_initial_chemo', 'Yes/No column indicating whether the patient had chemotherapy, for any agent, as part of their initial treatment (the treatment that occurred prior to the first relapse, progression, second malignancy, or death). ''no'' also covers rows where this could not be determined.'),
  (73, 'pcx_30_treatment_summary_deid', 'pcx_30_treatment_summary_deid.csv', 'had_initial_methotrexate', 'Yes/No column indicating whether the patient had methotrexate as part of their initial treatment (the treatment that occurred prior to the first relapse, progression, second malignancy, or death). ''no'' also covers rows where this could not be determined.'),
  (74, 'pcx_30_treatment_summary_deid', 'pcx_30_treatment_summary_deid.csv', 'initial_treatment_order', 'The order of initial treatments the patient received, specific to radiation, chemotherapy, both, or neither. Values: radiation_before_chemotherapy, chemo_before_radiation, radiation_and_chemo_same_day, chemo_only_no_initial_radiation, radiation_only_no_initial_chemo, no_initial_radiation_or_chemo.');
