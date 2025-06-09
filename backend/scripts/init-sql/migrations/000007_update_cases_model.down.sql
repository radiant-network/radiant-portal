-- DELETE panel tables
DROP TABLE "panel_type";
DROP TABLE "panel";
DROP TABLE "panel_has_genes";

-- Revert sequencing_experiment changes
ALTER TABLE "sequencing_experiment"
    ADD COLUMN "platform_code" TEXT REFERENCES "platform" ("code");
ALTER TABLE "sequencing_experiment"
    ADD COLUMN "experimental_strategy_code" TEXT REFERENCES "experimental_strategy" ("code");
UPDATE "sequencing_experiment"
SET platform_code = (SELECT platform_code FROM experiment where experiment.id = sequencing_experiment.experiment_id)
WHERE experiment_id IS NOT NULL;
UPDATE sequencing_experiment
SET experimental_strategy_code = (SELECT experimental_strategy_code
                                  FROM experiment
                                  where experiment.id = sequencing_experiment.experiment_id)
WHERE experiment_id IS NOT NULL;
ALTER TABLE "sequencing_experiment"
    DROP COLUMN "experiment_id";

DROP TABLE "experiment";

-- Revert case changes
CREATE TABLE IF NOT EXISTS "case_type"
(
    "code"    TEXT PRIMARY KEY,
    "name_en" TEXT NOT NULL
);

INSERT INTO "case_type" ("code", "name_en")
VALUES ('heriditary_single', 'Hereditary Disease - Single Case'),
       ('heriditary_family', 'Hereditary Disease - Family Case'),
       ('tumor', 'Tumor Case')
ON CONFLICT (code) DO NOTHING;

ALTER TABLE "case"
    ADD COLUMN "type_code" TEXT REFERENCES "case_type" ("code");
ALTER TABLE "case"
    ADD COLUMN "panel_id" INTEGER;
UPDATE "case"
SET panel_id = (select panel_id from case_analysis where case_analysis.id = "case".case_analysis_id)
WHERE case_analysis_id IS NOT NULL;

ALTER TABLE "case"
    DROP COLUMN "case_analysis_id";

DROP TABLE "case_analysis";
DROP TABLE "case_analysis_type";

-- Revert request changes
ALTER TABLE "request"
    ADD COLUMN "status_code" TEXT REFERENCES "status" ("code");
UPDATE "request"
SET "status_code" = (SELECT "status_code" from "case" where "case".request_id = request.id)
where id is not null;
ALTER TABLE "case"
    ALTER COLUMN "status_code" SET NOT NULL;
ALTER TABLE "request"
    ADD COLUMN "request_code" TEXT;
ALTER TABLE "request"
    ADD COLUMN "created_on" TIMESTAMP;
UPDATE "request"
SET "created_on" = (SELECT "created_on" from "case" where "case".request_id = request.id)
where id is not null;
ALTER TABLE "case"
    ALTER COLUMN "created_on" SET NOT NULL;
ALTER TABLE "request"
    ADD COLUMN "updated_on" TIMESTAMP;
UPDATE "request"
SET "updated_on" = (SELECT "updated_on" from "case" where "case".request_id = request.id)
where id is not null;
ALTER TABLE "case"
    ALTER COLUMN "updated_on" SET NOT NULL;

-- Revert sample changes
ALTER TABLE "sample"
    RENAME COLUMN "submitter_sample_id" TO "submitter_id";

