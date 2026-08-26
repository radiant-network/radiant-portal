-- A role's name must be unique within its tenant, compared case-insensitively, so a custom role
-- can never render identically to an existing one. One index per localized name:
-- the name a reader sees depends on their locale, so an EN-only index would let a role named
-- "Généticien" coexist with the seeded geneticist ("Geneticist" / "Généticien"). Per-column rather
-- than one combined constraint, because a role may hold the same string in both columns — a caller
-- that supplies no French name gets the English one there.
DO $$
DECLARE
    duplicates text;
BEGIN
    SELECT string_agg(label, ', ')
    INTO duplicates
    FROM (
        SELECT format('%s/%s (name_en)', tenant_code, lower(name_en)) AS label
        FROM public.role
        GROUP BY tenant_code, lower(name_en)
        HAVING count(*) > 1

        UNION ALL

        SELECT format('%s/%s (name_fr)', tenant_code, lower(name_fr)) AS label
        FROM public.role
        WHERE name_fr IS NOT NULL
        GROUP BY tenant_code, lower(name_fr)
        HAVING count(*) > 1
    ) d;

    IF duplicates IS NOT NULL THEN
        RAISE EXCEPTION
            'cannot enforce unique role names: duplicates already exist (tenant/name: %). Rename one role of each pair, then re-run.',
            duplicates;
    END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS role_unique_name_per_tenant
    ON public.role (tenant_code, lower(name_en));

CREATE UNIQUE INDEX IF NOT EXISTS role_unique_name_fr_per_tenant
    ON public.role (tenant_code, lower(name_fr));
