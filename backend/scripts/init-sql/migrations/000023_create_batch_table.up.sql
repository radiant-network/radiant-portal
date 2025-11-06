CREATE TABLE IF NOT EXISTS "batch"
(
    "id"                   UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL ,
    "dry_run"              BOOLEAN NOT NULL DEFAULT FALSE,
    "batch_type"           TEXT NOT NULL,
    "status"               TEXT NOT NULL,
    "created_on"           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_on"           TIMESTAMP NULL,
    "finished_on"          TIMESTAMP NULL,
    "username"             TEXT NOT NULL,
    "payload"              JSONB NOT NULL,
    "summary"              JSONB NULL,
    "errors"               JSONB NULL
);
