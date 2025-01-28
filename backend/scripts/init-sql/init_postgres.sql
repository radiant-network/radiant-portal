CREATE schema radiant;

SET schema 'radiant';

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE interpretation_germinal
(
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    sequencing_id            TEXT NOT NULL,
    locus_id                 TEXT NOT NULL,
    transcript_id            TEXT NOT NULL,
    condition                TEXT,
    classification           TEXT,
    classification_criterias TEXT,
    transmission_modes       TEXT,
    interpretation           TEXT,
    pubmed                   TEXT,
    created_by               TEXT,
    created_by_name          TEXT,
    created_at               TIMESTAMPTZ      DEFAULT NOW(),
    updated_by               TEXT,
    updated_by_name          TEXT,
    updated_at               TIMESTAMPTZ      DEFAULT NOW(),
    CONSTRAINT UC_Interpretation_germinal UNIQUE (sequencing_id, locus_id, transcript_id)
);

CREATE OR REPLACE FUNCTION tp_history_func() RETURNS TRIGGER AS
$$
DECLARE
tbl_history TEXT        := FORMAT('%I.%I', TG_TABLE_SCHEMA, TG_TABLE_NAME || '_history');
    next_id     BIGINT      := NEXTVAL(TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME || '_history_seq');
    curr_time   TIMESTAMPTZ := NOW();
    deleted_by  TEXT        := NULL;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        deleted_by = current_setting('history.deleted_by', true);
EXECUTE 'INSERT INTO ' || tbl_history || ' SELECT $1, $2, $3, $4, $5.*'
    USING next_id, curr_time, deleted_by, TG_OP, OLD;
RETURN OLD;
ELSIF (TG_OP = 'UPDATE') THEN
        EXECUTE 'INSERT INTO ' || tbl_history ||
                ' SELECT $1, $2, $3, $4, $5.*' USING next_id, curr_time, deleted_by, TG_OP, NEW;
RETURN NEW;
ELSIF (TG_OP = 'INSERT') THEN
        EXECUTE 'INSERT INTO ' || tbl_history ||
                ' SELECT $1, $2, $3, $4, $5.*' USING next_id, curr_time, deleted_by, TG_OP, NEW;
RETURN NEW;
END IF;
RETURN NULL;
-- Foreign key violation means required related entity doesn't exist anymore.
-- Just skipping trigger invocation
EXCEPTION
    WHEN foreign_key_violation THEN
        RETURN NULL;
END;
$$
LANGUAGE plpgsql;


CREATE SEQUENCE IF NOT EXISTS interpretation_germinal_history_seq
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1
    NO CYCLE;

CREATE TRIGGER trg_interpretation_germinal
    AFTER INSERT OR UPDATE OR DELETE
                    ON interpretation_germinal
                        FOR EACH ROW
                        EXECUTE PROCEDURE tp_history_func();

CREATE TABLE IF NOT EXISTS interpretation_germinal_history
(
    history_id               BIGSERIAL PRIMARY KEY,
    history_timestamp        TIMESTAMPTZ NOT NULL DEFAULT now(),
    history_deleted_by       VARCHAR,
    history_op               VARCHAR     NOT NULL,
    id                       UUID,
    sequencing_id            TEXT NOT NULL,
    locus_id                 TEXT NOT NULL,
    transcript_id            TEXT NOT NULL,
    condition                TEXT,
    classification           TEXT,
    classification_criterias TEXT,
    transmission_modes       TEXT,
    interpretation           TEXT,
    pubmed                   TEXT,
    created_by               TEXT,
    created_by_name          TEXT,
    created_at               TIMESTAMPTZ      DEFAULT NOW(),
    updated_by              TEXT,
    updated_by_name         TEXT,
    updated_at              TIMESTAMPTZ      DEFAULT NOW()
    );

CREATE TABLE interpretation_somatic
(
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    sequencing_id            TEXT NOT NULL,
    locus_id                 TEXT NOT NULL,
    transcript_id            TEXT NOT NULL,
    tumoral_type             TEXT,
    oncogenicity             TEXT,
    oncogenicity_classification_criterias   TEXT,
    clinical_utility         TEXT,
    interpretation           TEXT,
    pubmed                   TEXT,
    created_by               TEXT,
    created_by_name          TEXT,
    created_at               TIMESTAMPTZ      DEFAULT NOW(),
    updated_by               TEXT,
    updated_by_name          TEXT,
    updated_at               TIMESTAMPTZ      DEFAULT NOW(),
    CONSTRAINT UC_Interpretation_somatic UNIQUE (sequencing_id, locus_id, transcript_id)
);

CREATE SEQUENCE IF NOT EXISTS interpretation_somatic_history_seq
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1
    NO CYCLE;

CREATE TRIGGER trg_interpretation_somatic
    AFTER INSERT OR UPDATE OR DELETE
                    ON interpretation_somatic
                        FOR EACH ROW
                        EXECUTE PROCEDURE tp_history_func();

CREATE TABLE IF NOT EXISTS interpretation_somatic_history
(
    history_id               BIGSERIAL PRIMARY KEY,
    history_timestamp        TIMESTAMPTZ NOT NULL DEFAULT now(),
    history_deleted_by       VARCHAR,
    history_op               VARCHAR     NOT NULL,
    id                       UUID,
    sequencing_id            TEXT NOT NULL,
    locus_id                 TEXT NOT NULL,
    transcript_id            TEXT NOT NULL,
    tumoral_type             TEXT,
    oncogenicity             TEXT,
    oncogenicity_classification_criterias   TEXT,
    clinical_utility         TEXT,
    interpretation           TEXT,
    pubmed                   TEXT,
    created_by               TEXT,
    created_by_name          TEXT,
    created_at               TIMESTAMPTZ      DEFAULT NOW(),
    updated_by               TEXT,
    updated_by_name          TEXT,
    updated_at               TIMESTAMPTZ      DEFAULT NOW()
    );










