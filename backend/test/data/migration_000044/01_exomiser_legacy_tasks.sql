-- Fixtures of the 000044 migration tests, pinned to schema version 43: the tests migrate a database to 43,
-- load this folder, then apply 000044. Do not follow later schema changes here: this folder must stay valid
-- at version 43. Rows are copied from test/data/clinical, with the same ids, minus what the tests do not read.
--   task 5:  radiant_germline_annotation of case 1 (sequencings 1, 2; 1 is the proband's), output 251
--   task 30: radiant_germline_annotation on sequencing 22 with no case, output 264
--   task 77: radiant_germline_annotation of case 3 (sequencing 7, the proband's)
--   task 86: radiant_germline_cnv_annotation of case 70 (sequencing 70, the proband's), output 286
--   case 8:  sequencing 22 (the proband's), no annotation task

INSERT INTO organization (code, name, category_code, tenant_code, notification_emails)
VALUES ('CHUSJ', 'Centre hospitalier universitaire Sainte-Justine', 'healthcare_provider', 'radiant', NULL),
       ('CHOP', 'Children Hospital of Philadelphia', 'healthcare_provider', 'radiant', NULL),
       ('CQGC', 'Quebec Clinical Genomic Center', 'sequencing_center', 'radiant', NULL);

INSERT INTO project (id, code, name, description, tenant_code)
VALUES (1, 'N1', 'NeuroDev Phase I', 'Phase one NeuroDev cases', 'radiant');

INSERT INTO patient (id, submitter_patient_id, submitter_patient_id_type, organization_code, tenant_code, sex_code, date_of_birth, life_status_code, first_name, last_name, jhn)
VALUES (1, 'MRN-283773', 'mrn', 'CHUSJ', 'radiant', 'female', '2012-02-03', 'alive', 'Juliette', 'Gagnon', 'GAG1202030277'),
       (3, 'MRN-283775', 'mrn', 'CHUSJ', 'radiant', 'male', '1973-03-23', 'alive', 'Marie', 'Lambert', 'LAM7303233380'),
       (8, 'MRN-283780', 'mrn', 'CHUSJ', 'radiant', 'male', '1988-06-02', 'alive', 'Raphaël', 'Bouchard', 'BOU8806022778'),
       (22, 'MRN-283794', 'mrn', 'CHUSJ', 'radiant', 'male', '2008-01-05', 'alive', 'Juliette', 'Lefebvre', 'LEF0801056320');

INSERT INTO "cases" (id, proband_id, project_id, analysis_catalog_id, status_code, diagnosis_lab_code, tenant_code, primary_condition, note, created_on, updated_on, priority_code, case_type_code, case_category_code, condition_code_system, ordering_physician, ordering_organization_code, submitter_case_id)
VALUES (1, 3, 1, 1, 'in_progress', 'CQGC', 'radiant', 'MONDO:0700092', 'Administrative comment', '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00', 'routine', 'germline', 'postnatal', 'mondo', 'Felix Laflamme', 'CHUSJ', '1:1'),
       (3, 8, 1, 2, 'submitted', 'CQGC', 'radiant', 'MONDO:0700092', 'Administrative comment', '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00', 'routine', 'germline', 'postnatal', 'mondo', 'Christopher Watson', 'CHOP', '1:3'),
       (8, 22, 1, 1, 'submitted', 'CQGC', 'radiant', 'MONDO:0700092', 'Administrative comment', '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00', 'routine', 'germline', 'postnatal', 'mondo', 'Lauren Maxwell', 'CHOP', '1:8'),
       (70, 3, 1, 1, 'in_progress', 'CQGC', 'radiant', 'MONDO:0700092', 'Administrative comment', '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00', 'routine', 'germline', 'postnatal', 'mondo', 'Isabella Murphy', 'CHOP', '1:70');

INSERT INTO "sample" (id, type_code, parent_sample_id, tissue_site, histology_code, submitter_sample_id, patient_id, organization_code, tenant_code)
VALUES (1, 'dna', NULL, NULL, 'normal', 'S13224', 3, 'CQGC', 'radiant'),
       (2, 'dna', NULL, NULL, 'normal', 'S13225', 1, 'CQGC', 'radiant'),
       (7, 'dna', NULL, NULL, 'normal', 'S13230', 8, 'CQGC', 'radiant'),
       (22, 'dna', NULL, NULL, 'normal', 'S14069', 22, 'CQGC', 'radiant');

INSERT INTO "sequencing_experiment" (id, sample_id, status_code, aliquot, sequencing_lab_code, tenant_code, run_name, run_alias, run_date, capture_kit, created_on, updated_on, experimental_strategy_code, sequencing_read_technology_code, platform_code)
VALUES (1, 1, 'completed', 'NA12892', 'CQGC', 'radiant', 1617, 'A00516_0169', '2021-08-17', 'SureSelect Custom DNA Target', '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00', 'wgs', 'short_read', 'illumina'),
       (2, 2, 'completed', 'NA12891', 'CQGC', 'radiant', 1618, 'A00516_0170', '2021-08-17', 'SureSelect Custom DNA Target', '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00', 'wgs', 'short_read', 'illumina'),
       (7, 7, 'submitted', 'S13230', 'CQGC', 'radiant', 1623, 'A00516_0175', '2021-08-17', 'SureSelect Custom DNA Target', '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00', 'wgs', 'short_read', 'illumina'),
       (22, 22, 'submitted', 'HG00513', 'CQGC', 'radiant', 1638, 'A00516_0190', '2021-08-17', 'SureSelect Custom DNA Target', '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00', 'wgs', 'short_read', 'illumina'),
       (70, 1, 'completed', 'NA12892', 'CQGC', 'radiant', 1617, 'A00516_0169', '2021-08-17', 'SureSelect Custom DNA Target', '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00', 'wgs', 'short_read', 'illumina');

INSERT INTO "case_has_sequencing_experiment" (sequencing_experiment_id, case_id)
VALUES (1, 1),
       (2, 1),
       (7, 3),
       (22, 8),
       (70, 70);

INSERT INTO "task" (id, task_type_code, pipeline_name, pipeline_version, genome_build, created_on, tenant_code)
VALUES (5, 'radiant_germline_annotation', 'Dragen', '4.4.4', 'GRch38', '2021-10-12 13:08:00', 'radiant'),
       (30, 'radiant_germline_annotation', NULL, '1.0.0', 'GRch38', '2021-10-12 13:08:00', 'radiant'),
       (77, 'radiant_germline_annotation', 'Dragen', '4.4.4', 'GRch38', '2021-10-12 13:08:00', 'radiant'),
       (86, 'radiant_germline_cnv_annotation', 'Dragen', '4.4.4', 'GRch38', '2026-04-01 13:08:00', 'radiant');

INSERT INTO "task_context" (task_id, sequencing_experiment_id, case_id)
VALUES (5, 1, 1),
       (5, 2, 1),
       (30, 22, NULL),
       (77, 7, 3),
       (86, 70, 70);

INSERT INTO "document" (id, name, data_category_code, data_type_code, format_code, size, url, hash, created_on, tenant_code)
VALUES (1, 'FI0037662.S13230.cram', 'genomic', 'alignment', 'cram', 110187385978, 's3://cqdg-prod-file-workspace/sarek/preprocessing/', '5d41402abc4b2a76b9719d911017c592', '2021-09-12T13:08:00-04:00', 'radiant'),
       (251, 'FI0005564.S14359.vcf.gz', 'genomic', 'snv', 'vcf', 304055583, 's3://cqdg-prod-file-workspace/sarek/preprocessing/', '5d41402abc4b2a76b9719d911017c842', '2021-09-12T13:08:00-04:00', 'radiant'),
       (264, 'FI0005568.S14359.vcf.gz', 'genomic', 'snv', 'vcf', 2411725, 's3://cqdg-prod-file-workspace/sarek/preprocessing/', '5d41402abc4b2a76b9719d911017c855', '2021-09-12T13:08:00-04:00', 'radiant'),
       (286, 'case70.annotated.cnv.vcf.gz', 'genomic', 'gcnv', 'vcf', 1286, 's3://cqdg-prod-file-workspace/dragen/case70/case70.annotated.cnv.vcf.gz', '5d41402abc4b2a76b9719d911017d286', '2026-04-01T13:08:00-04:00', 'radiant');

INSERT INTO "task_has_document" (task_id, document_id, type)
VALUES (5, 251, 'output'),
       (30, 264, 'output'),
       (86, 286, 'output');
