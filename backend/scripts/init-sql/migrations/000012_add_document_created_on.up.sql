ALTER TABLE document
    ADD COLUMN "created_on" TIMESTAMP NOT NULL default now();