-- Codes are compared byte for byte, so CHOP and chop can coexist as two distinct organizations —
-- and the same holds for every table keyed by a code. These functional unique indexes close that
-- door without touching the existing keys: the PKs and FKs stay deterministic, so StarRocks'
-- binary joins over the JDBC federation keep matching exactly what Postgres accepts. (A
-- non-deterministic ICU collation would have done neither: it has no effect on the StarRocks read
-- path, and it would have made referential integrity case-insensitive on one side only.)
--
-- Two groups, differing only in whether the code is unique per tenant or globally:
--   * tenant-scoped, human-authored: organization, project, panel, exam, role, analysis_catalog
--   * global: tenant, plus the seed-populated controlled vocabularies
--
-- The vocabularies hold no collisions today and nobody types their codes through the UI, so the
-- index guards against future drift rather than existing data — a new seed row, a hand-run INSERT,
-- an ETL load. It also backs the lower(code) ordering the repositories now use.
--
-- Codes stay stored and displayed with the case they were entered in: this adds a constraint,
-- not a transformation.

DO $$
DECLARE
    rel        text;
    scoped     boolean;
    found      text;
    collisions text := '';
BEGIN
    FOR rel, scoped IN
        SELECT * FROM (VALUES
            ('organization', true), ('project', true), ('panel', true),
            ('exam', true), ('role', true), ('analysis_catalog', true),

            ('tenant', false),
            ('affected_status', false), ('ancestry', false), ('case_category', false),
            ('case_type', false), ('consanguinity', false), ('data_category', false),
            ('data_type', false), ('experimental_strategy', false), ('family_relationship', false),
            ('file_format', false), ('histology_type', false), ('life_status', false),
            ('obs_interpretation', false), ('observation', false), ('onset', false),
            ('organization_category', false), ('panel_type', false), ('platform', false),
            ('priority', false), ('sample_type', false), ('sequencing_read_technology', false),
            ('sex', false), ('status', false), ('task_type', false)
        ) AS t(rel, scoped)
    LOOP
        IF scoped THEN
            EXECUTE format(
                'SELECT string_agg(label, '', '' ORDER BY label) FROM ('
                '  SELECT %L || '' '' || tenant_code || ''/'' || lower(code) AS label'
                '  FROM public.%I GROUP BY tenant_code, lower(code) HAVING count(*) > 1'
                ') d', rel, rel) INTO found;
        ELSE
            EXECUTE format(
                'SELECT string_agg(label, '', '' ORDER BY label) FROM ('
                '  SELECT %L || '' '' || lower(code) AS label'
                '  FROM public.%I GROUP BY lower(code) HAVING count(*) > 1'
                ') d', rel, rel) INTO found;
        END IF;

        IF found IS NOT NULL THEN
            collisions := collisions || CASE WHEN collisions = '' THEN '' ELSE ', ' END || found;
        END IF;
    END LOOP;

    IF collisions <> '' THEN
        RAISE EXCEPTION
            'cannot enforce case-insensitive unique codes: collisions already exist (%). Rename one code of each pair, then re-run.',
            collisions;
    END IF;
END $$;

-- Tenant-scoped: unique within the tenant, so two tenants may still share a code.
CREATE UNIQUE INDEX IF NOT EXISTS organization_code_ci_key     ON public.organization     (lower(code), tenant_code);
CREATE UNIQUE INDEX IF NOT EXISTS project_code_ci_key          ON public.project          (lower(code), tenant_code);
CREATE UNIQUE INDEX IF NOT EXISTS panel_code_ci_key            ON public.panel            (lower(code), tenant_code);
CREATE UNIQUE INDEX IF NOT EXISTS exam_code_ci_key             ON public.exam             (lower(code), tenant_code);
CREATE UNIQUE INDEX IF NOT EXISTS role_code_ci_key             ON public.role             (lower(code), tenant_code);
CREATE UNIQUE INDEX IF NOT EXISTS analysis_catalog_code_ci_key ON public.analysis_catalog (lower(code), tenant_code);

-- Global: tenant and the controlled vocabularies, all keyed by PRIMARY KEY (code).
CREATE UNIQUE INDEX IF NOT EXISTS tenant_code_ci_key                     ON public.tenant                     (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS affected_status_code_ci_key            ON public.affected_status            (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS ancestry_code_ci_key                   ON public.ancestry                   (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS case_category_code_ci_key              ON public.case_category              (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS case_type_code_ci_key                  ON public.case_type                  (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS consanguinity_code_ci_key              ON public.consanguinity              (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS data_category_code_ci_key              ON public.data_category              (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS data_type_code_ci_key                  ON public.data_type                  (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS experimental_strategy_code_ci_key      ON public.experimental_strategy      (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS family_relationship_code_ci_key        ON public.family_relationship        (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS file_format_code_ci_key                ON public.file_format                (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS histology_type_code_ci_key             ON public.histology_type             (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS life_status_code_ci_key                ON public.life_status                (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS obs_interpretation_code_ci_key         ON public.obs_interpretation         (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS observation_code_ci_key                ON public.observation                (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS onset_code_ci_key                      ON public.onset                      (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS organization_category_code_ci_key      ON public.organization_category      (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS panel_type_code_ci_key                 ON public.panel_type                 (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS platform_code_ci_key                   ON public.platform                   (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS priority_code_ci_key                   ON public.priority                   (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS sample_type_code_ci_key                ON public.sample_type                (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS sequencing_read_technology_code_ci_key ON public.sequencing_read_technology (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS sex_code_ci_key                        ON public.sex                        (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS status_code_ci_key                     ON public.status                     (lower(code));
CREATE UNIQUE INDEX IF NOT EXISTS task_type_code_ci_key                  ON public.task_type                  (lower(code));
