INSERT INTO "status" ("code", "name_en")
VALUES ('on-hold', 'On-hold'),
       ('active', 'Active');

UPDATE "cases" SET status_code = 'active' where status_code = 'in_progress';
UPDATE "sequencing_experiment" SET status_code = 'active' where status_code = 'in_progress';

DELETE FROM "status" WHERE code = 'in_progress';