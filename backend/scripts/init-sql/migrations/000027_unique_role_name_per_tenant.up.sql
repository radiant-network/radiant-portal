-- Admin API MVP: a role's name must be unique within its tenant, so creating a custom role that
-- clashes with an existing one (including a seeded role's name) is refused with 409 rather than
-- producing two roles the admin UI renders identically. Compared case-insensitively: "Clinical
-- Reviewer" and "clinical reviewer" are the same name to a reader, so they must not coexist.
--
-- Enforced by the index rather than by a read-then-insert check so two concurrent creates cannot
-- both land; the repository maps this constraint's violation to 409.

-- Fail loudly and legibly if a tenant already holds two roles with the same name: the index below
-- cannot be built over such rows, and Postgres's own error names neither the tenant nor the name.
-- Rename one role of each pair listed, then let the migration run again.
DO $$
DECLARE
    duplicates text;
BEGIN
    SELECT string_agg(format('%s/%s', tenant_code, name), ', ')
    INTO duplicates
    FROM (
        SELECT tenant_code, lower(name_en) AS name
        FROM public.role
        GROUP BY tenant_code, lower(name_en)
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
