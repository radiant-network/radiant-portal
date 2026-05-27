-- Multi-tenancy authorization + org→tenant linkage.
-- Data-safe: works on a non-empty database (QA) and an empty one (dev).
-- All identifiers are varchar "code" natural keys (no integer surrogate ids),
-- so every reference column is named *_code. Users are keyed by email (the one
-- identifier always known at invite time, IdP-agnostic); keycloak_id is a
-- nullable attribute filled on first login.
-- See docs/adr/multi-tenancy-security.md §5.

-- =============================================================================
-- 1. Tenant + default tenant for pre-existing data
-- =============================================================================
CREATE TABLE public.tenant (
    code       varchar(50)  PRIMARY KEY,
    name       varchar(200) NOT NULL,
    created_at timestamptz  NOT NULL DEFAULT now()
);

-- Everything that exists before multi-tenancy belongs to a single default tenant.
INSERT INTO public.tenant (code, name) VALUES ('radiant', 'Radiant')
ON CONFLICT (code) DO NOTHING;

-- =============================================================================
-- 2. Organization: attach to the default tenant (backfill, then NOT NULL)
-- =============================================================================
ALTER TABLE public.organization
    ADD COLUMN tenant_code varchar(50) REFERENCES public.tenant(code);
UPDATE public.organization SET tenant_code = 'radiant' WHERE tenant_code IS NULL;
ALTER TABLE public.organization ALTER COLUMN tenant_code SET NOT NULL;

-- =============================================================================
-- 3. Child tables: add (org_code, tenant_code), backfill from the integer FK,
--    then drop the old integer columns. Done BEFORE dropping organization.id
--    so the join to organization.id still resolves.
-- =============================================================================

-- cases (two org references: ordering org + diagnosis lab)
ALTER TABLE public.cases ADD COLUMN tenant_code                varchar(50);
ALTER TABLE public.cases ADD COLUMN ordering_organization_code varchar(50);
ALTER TABLE public.cases ADD COLUMN diagnosis_lab_code         varchar(50);
UPDATE public.cases c SET ordering_organization_code = o.code
    FROM public.organization o WHERE c.ordering_organization_id = o.id;
UPDATE public.cases c SET diagnosis_lab_code = o.code
    FROM public.organization o WHERE c.diagnosis_lab_id = o.id;
UPDATE public.cases SET tenant_code = 'radiant';
ALTER TABLE public.cases ALTER COLUMN tenant_code SET NOT NULL;
ALTER TABLE public.cases DROP CONSTRAINT cases_ordering_organization_id_fkey;
ALTER TABLE public.cases DROP CONSTRAINT case_performer_lab_id_fkey;
ALTER TABLE public.cases DROP COLUMN ordering_organization_id;
ALTER TABLE public.cases DROP COLUMN diagnosis_lab_id;

-- patient
ALTER TABLE public.patient ADD COLUMN tenant_code       varchar(50);
ALTER TABLE public.patient ADD COLUMN organization_code varchar(50);
UPDATE public.patient p SET organization_code = o.code
    FROM public.organization o WHERE p.organization_id = o.id;
UPDATE public.patient SET tenant_code = 'radiant';
ALTER TABLE public.patient ALTER COLUMN tenant_code SET NOT NULL;
ALTER TABLE public.patient DROP CONSTRAINT patient_managing_organization_id_fkey;
ALTER TABLE public.patient DROP COLUMN organization_id;

-- sample
ALTER TABLE public.sample ADD COLUMN tenant_code       varchar(50);
ALTER TABLE public.sample ADD COLUMN organization_code varchar(50);
UPDATE public.sample s SET organization_code = o.code
    FROM public.organization o WHERE s.organization_id = o.id;
UPDATE public.sample SET tenant_code = 'radiant';
ALTER TABLE public.sample ALTER COLUMN tenant_code SET NOT NULL;
ALTER TABLE public.sample DROP CONSTRAINT sample_submitter_organization_id_fkey;
ALTER TABLE public.sample DROP COLUMN organization_id;

-- sequencing_experiment
ALTER TABLE public.sequencing_experiment ADD COLUMN tenant_code         varchar(50);
ALTER TABLE public.sequencing_experiment ADD COLUMN sequencing_lab_code varchar(50);
UPDATE public.sequencing_experiment s SET sequencing_lab_code = o.code
    FROM public.organization o WHERE s.sequencing_lab_id = o.id;
UPDATE public.sequencing_experiment SET tenant_code = 'radiant';
ALTER TABLE public.sequencing_experiment ALTER COLUMN tenant_code SET NOT NULL;
ALTER TABLE public.sequencing_experiment DROP CONSTRAINT sequencing_experiment_performer_lab_id_fkey;
ALTER TABLE public.sequencing_experiment DROP COLUMN sequencing_lab_id;

-- =============================================================================
-- 4. Now safe to drop organization.id and swap PK to (code, tenant_code)
-- =============================================================================
ALTER TABLE public.organization DROP CONSTRAINT organization_pkey;       -- was PRIMARY KEY (id)
ALTER TABLE public.organization DROP CONSTRAINT organization_code_key;   -- was UNIQUE (code)
ALTER TABLE public.organization DROP COLUMN id;                          -- drops the identity sequence too
ALTER TABLE public.organization ADD CONSTRAINT organization_pkey PRIMARY KEY (code, tenant_code);

-- =============================================================================
-- 5. Compound FKs on child tables → organization(code, tenant_code)
-- =============================================================================
ALTER TABLE public.cases
    ADD CONSTRAINT cases_ordering_organization_fkey
        FOREIGN KEY (ordering_organization_code, tenant_code)
        REFERENCES public.organization(code, tenant_code);
ALTER TABLE public.cases
    ADD CONSTRAINT cases_diagnosis_lab_fkey
        FOREIGN KEY (diagnosis_lab_code, tenant_code)
        REFERENCES public.organization(code, tenant_code);
ALTER TABLE public.patient
    ADD CONSTRAINT patient_managing_organization_fkey
        FOREIGN KEY (organization_code, tenant_code)
        REFERENCES public.organization(code, tenant_code);
ALTER TABLE public.sample
    ADD CONSTRAINT sample_submitter_organization_fkey
        FOREIGN KEY (organization_code, tenant_code)
        REFERENCES public.organization(code, tenant_code);
ALTER TABLE public.sequencing_experiment
    ADD CONSTRAINT sequencing_experiment_performer_lab_fkey
        FOREIGN KEY (sequencing_lab_code, tenant_code)
        REFERENCES public.organization(code, tenant_code);

-- =============================================================================
-- 6. Authorization tables
-- =============================================================================
CREATE TABLE public.users (
    email       varchar(255) PRIMARY KEY,
    keycloak_id uuid,                       -- filled on first login; IdP-agnostic
    first_name  varchar(100),
    last_name   varchar(100),
    created_at  timestamptz  NOT NULL DEFAULT now(),
    disabled_at timestamptz
);

CREATE TABLE public.role (
    tenant_code varchar(50)  NOT NULL REFERENCES public.tenant(code),
    code        varchar(50)  NOT NULL,
    name        varchar(200) NOT NULL,
    description varchar(500),
    PRIMARY KEY (tenant_code, code)
);

CREATE TABLE public.action (
    code        varchar(50)  PRIMARY KEY,
    scope       varchar(10)  NOT NULL CHECK (scope IN ('org', 'tenant')),
    description varchar(500) NOT NULL
);

CREATE TABLE public.role_action (
    tenant_code varchar(50) NOT NULL,
    role_code   varchar(50) NOT NULL,
    action_code varchar(50) NOT NULL REFERENCES public.action(code),
    PRIMARY KEY (tenant_code, role_code, action_code),
    FOREIGN KEY (tenant_code, role_code)
        REFERENCES public.role(tenant_code, code) ON DELETE CASCADE
);

CREATE TABLE public.user_tenant_role (
    email       varchar(255) NOT NULL REFERENCES public.users(email),
    tenant_code varchar(50)  NOT NULL,
    role_code   varchar(50)  NOT NULL,
    granted_at  timestamptz  NOT NULL DEFAULT now(),
    granted_by  varchar(255),
    PRIMARY KEY (email, tenant_code, role_code),
    FOREIGN KEY (tenant_code, role_code)
        REFERENCES public.role(tenant_code, code) ON DELETE CASCADE
);

-- org_code = '*' means "all organizations in this tenant".
-- No FK on (org_code, tenant_code) because of the wildcard; the admin handler
-- validates org_code != '*' ⇒ exists in organization(code, tenant_code).
CREATE TABLE public.user_org_role (
    email       varchar(255) NOT NULL REFERENCES public.users(email),
    tenant_code varchar(50)  NOT NULL,
    org_code    varchar(50)  NOT NULL,
    role_code   varchar(50)  NOT NULL,
    granted_at  timestamptz  NOT NULL DEFAULT now(),
    granted_by  varchar(255),
    PRIMARY KEY (email, tenant_code, org_code, role_code),
    FOREIGN KEY (tenant_code, role_code)
        REFERENCES public.role(tenant_code, code) ON DELETE CASCADE
);

CREATE INDEX ix_user_tenant_role_tenant ON public.user_tenant_role (tenant_code, role_code);
CREATE INDEX ix_user_org_role_tenant_org ON public.user_org_role (tenant_code, org_code, role_code);

-- =============================================================================
-- 7. Default action catalog
-- =============================================================================
INSERT INTO public.action (code, scope, description) VALUES
    ('can_read_pii',          'org',    'View PHI columns (mrn, first/last name, date_of_birth, …) for rows at this org'),
    ('can_interpret_variant', 'org',    'Create or update a variant interpretation at this org'),
    ('can_comment_variant',   'org',    'Create, edit, or delete notes on a variant occurrence at this org'),
    ('can_flag_variant',      'org',    'Set or remove flag/pin/star on a variant occurrence at this org'),
    ('can_download_file',     'org',    'Generate presigned download URLs for case documents at this org'),
    ('can_ingest_data',       'org',    'Submit batches (cases, patients, samples, sequencing) for this org'),
    ('can_search_case',       'tenant', 'Search and view cases across the tenant (PHI masked per can_read_pii)'),
    ('can_view_kb',           'tenant', 'View the knowledge base: variants, genes, HPO/MONDO terms, frequencies')
ON CONFLICT (code) DO NOTHING;
