---- Sequencing experiment ----
CREATE TABLE IF NOT EXISTS "sequencing_read_technology"
(
    "code"    TEXT PRIMARY KEY,
    "name_en" TEXT NOT NULL
);
INSERT INTO sequencing_read_technology(code, name_en)
VALUES ('short_read', 'Short Read'),
       ('long_read', 'Long Read');

ALTER TABLE sequencing_experiment
    ADD COLUMN experimental_strategy_code TEXT REFERENCES "experimental_strategy" ("code");
ALTER TABLE sequencing_experiment
    ADD COLUMN sequencing_read_technology_code TEXT REFERENCES "sequencing_read_technology" ("code");
ALTER TABLE sequencing_experiment
    ADD COLUMN platform_code TEXT REFERENCES "platform" ("code");
ALTER TABLE sequencing_experiment
    RENAME COLUMN "performer_lab_id" TO "sequencing_lab_id";

UPDATE sequencing_experiment
SET experimental_strategy_code = (SELECT experimental_strategy_code
                                  FROM experiment
                                  WHERE sequencing_experiment.experiment_id = experiment.id)
WHERE experimental_strategy_code IS NULL;
UPDATE sequencing_experiment
SET platform_code = (SELECT platform_code FROM experiment WHERE sequencing_experiment.experiment_id = experiment.id)
where platform_code IS NULL;
UPDATE sequencing_experiment
SET sequencing_read_technology_code = 'short_read'
WHERE sequencing_read_technology_code IS NULL;

ALTER TABLE sequencing_experiment
    ALTER COLUMN experimental_strategy_code set NOT NULL;
ALTER TABLE sequencing_experiment
    ALTER COLUMN platform_code set NOT NULL;
ALTER TABLE sequencing_experiment
    ALTER COLUMN sequencing_read_technology_code set NOT NULL;

ALTER TABLE sequencing_experiment
    DROP COLUMN patient_id;
ALTER TABLE sequencing_experiment
    DROP COLUMN experiment_id;
ALTER TABLE sequencing_experiment
    DROP COLUMN request_id;
ALTER TABLE sequencing_experiment
    DROP COLUMN is_paired_end;
ALTER TABLE sequencing_experiment
    DROP COLUMN read_length;

-- Drop experiment table
DROP TABLE experiment;

-- Update experimental strategy
INSERT INTO experimental_strategy(code, name_en)
VALUES ('rnaseq', 'RNA-Seq'),
       ('targeted_dna', 'Targeted DNA Sequencing');
DELETE FROM experimental_strategy WHERE code = 'wts';

---- Case has sequencing experiment ----
CREATE TABLE IF NOT EXISTS "case_has_sequencing_experiment"
(
    "case_id"                  INTEGER NOT NULL REFERENCES "cases" ("id"),
    "sequencing_experiment_id" INTEGER NOT NULL REFERENCES "sequencing_experiment" ("id"),
    CONSTRAINT unique_case_has_seq_exp UNIQUE (
                                      "case_id",
                                      "sequencing_experiment_id"
        )
);

INSERT INTO case_has_sequencing_experiment (case_id, sequencing_experiment_id)
SELECT case_id, id
FROM sequencing_experiment;

ALTER TABLE sequencing_experiment
    DROP COLUMN case_id;

---- Task context ----
CREATE TABLE IF NOT EXISTS "task_context"
(
    "task_id"                  INTEGER NOT NULL REFERENCES "task" ("id"),
    "case_id"                  INTEGER,
    "sequencing_experiment_id" INTEGER NOT NULL,
    FOREIGN KEY (case_id, sequencing_experiment_id)
        REFERENCES case_has_sequencing_experiment (case_id, sequencing_experiment_id),
    CONSTRAINT unique_task_context UNIQUE ("task_id", "sequencing_experiment_id", "case_id")
);

---- Task ----

-- Drop existing join tables
DROP TABLE task_has_related_task;
DROP TABLE task_has_sequencing_experiment;

-- Empty existing task_has_document and task
TRUNCATE TABLE task_has_document;
TRUNCATE TABLE task CASCADE;

-- Update task table
ALTER TABLE task
    ADD COLUMN pipeline_name TEXT;
ALTER TABLE task
    ADD COLUMN pipeline_version TEXT NOT NULL;
ALTER TABLE task
    ADD COLUMN genome_build TEXT;
ALTER TABLE task
    RENAME COLUMN "type_code" TO "task_type_code";
ALTER TABLE task
    DROP COLUMN pipeline_id;

-- Update task_has_document
ALTER TABLE task_has_document
    ADD COLUMN type TEXT NOT NULL;
ALTER TABLE task_has_document DROP CONSTRAINT task_has_documents_pkey;
ALTER TABLE task_has_document ADD PRIMARY KEY (task_id, document_id, type);

-- Drop pipeline table
DROP TABLE pipeline;

-- Drop request table
DROP TABLE request;

-- Update task_type content
TRUNCATE TABLE task_type CASCADE;
INSERT INTO task_type(code, name_en)
VALUES ('alignment', 'Genome Alignment'),
       ('alignment_germline_variant_calling', 'Genome Alignment and Germline Variant Calling'), -- output cram gvcf vcf
       ('alignment_somatic_variant_calling', 'Genome Alignment and Somatic Variant Calling'),
       ('family_variant_calling', 'Family Joint Genotyping'), -- input
       ('somatic_variant_calling', 'Somatic Variant Calling by Tumor-Normal Paired Samples'),
       ('tumor_only_variant_calling', 'Somatic Variant Calling by Tumor-Only Sample'),
       ('radiant_germline_annotation', 'RADIANT Germline Annotation'), -- input vcf output vcf
       ('exomiser', 'Exomiser'), -- input gvcf output vcf
       ('rnaseq_analysis', 'RNAseq Analysis of Transcriptome Profiling and Gene Fusion Calling');