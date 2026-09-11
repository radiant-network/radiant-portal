-- Pre-migration check for 000033_case_insensitive_code_unique_indexes.
--
-- Run against every environment BEFORE deploying. Migration 000033 adds unique indexes on
-- lower(code) across every code-keyed table and aborts if any already holds two codes differing
-- only by case. This runs the same scan and reports instead of raising, so the offending rows can
-- be renamed first. "no collisions" means 000033 will apply.
--
--   psql "$DATABASE_URL" -f backend/scripts/init-sql/check_code_collisions.sql

DO $$
DECLARE
    rel    text;
    scoped boolean;
    hit    record;
    total  int := 0;
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
        FOR hit IN EXECUTE format(
            'SELECT %s AS scope, lower(code) AS code, count(*) AS occurrences,'
            '       string_agg(code, '', '' ORDER BY code) AS variants'
            ' FROM public.%I GROUP BY %s lower(code) HAVING count(*) > 1'
            ' ORDER BY 1, 2',
            CASE WHEN scoped THEN 'tenant_code' ELSE '''(global)''' END,
            rel,
            CASE WHEN scoped THEN 'tenant_code,' ELSE '' END)
        LOOP
            RAISE NOTICE '% [%] %  (% rows: %)', rel, hit.scope, hit.code, hit.occurrences, hit.variants;
            total := total + 1;
        END LOOP;
    END LOOP;

    IF total = 0 THEN
        RAISE NOTICE 'no collisions — migration 000033 will apply';
    ELSE
        RAISE NOTICE '% collision group(s) must be resolved before migrating', total;
    END IF;
END $$;
