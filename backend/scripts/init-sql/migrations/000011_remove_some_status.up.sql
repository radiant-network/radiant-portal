INSERT INTO "status" ("code", "name_en")
VALUES ('in_progress', 'In Progress');

UPDATE "cases" SET status_code = 'submitted' where status_code = 'on-hold';
UPDATE "cases" SET status_code = 'in_progress' where status_code = 'active';
UPDATE "sequencing_experiment" SET status_code = 'submitted' where status_code = 'on-hold';
UPDATE "sequencing_experiment" SET status_code = 'in_progress' where status_code = 'active';

DELETE FROM "status" WHERE code = 'active' OR code = 'on-hold';