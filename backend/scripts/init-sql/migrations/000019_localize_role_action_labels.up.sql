-- Localize role and action labels: rename the English columns with an _en suffix, add French
-- (_fr) columns, then set the reconciled EN/FR copy for the seeded actions and radiant's default
-- roles. action also gains name_en/name_fr (it previously had no name). The new _fr columns and
-- action name columns are nullable; the UPDATEs below fill every label, overriding the seed text
-- from migrations 000009/000012/000018.

-- =============================================================================
-- 1. Schema: rename *_en, add *_fr (+ name_en/name_fr on action)
-- =============================================================================
ALTER TABLE public.role RENAME COLUMN name TO name_en;
ALTER TABLE public.role RENAME COLUMN description TO description_en;
ALTER TABLE public.role ADD COLUMN name_fr        varchar(200);
ALTER TABLE public.role ADD COLUMN description_fr varchar(500);

ALTER TABLE public.action RENAME COLUMN description TO description_en;
ALTER TABLE public.action ADD COLUMN name_en        varchar(200);
ALTER TABLE public.action ADD COLUMN name_fr        varchar(200);
ALTER TABLE public.action ADD COLUMN description_fr varchar(500);

-- =============================================================================
-- 2. Reconciled copy. Actions are global; roles are seeded per tenant, so only radiant's default
--    roles are set here — new tenants get their labels from the create-tenant DefaultRoles template.
-- =============================================================================
UPDATE public.action AS a SET
    name_en        = t.name_en,
    name_fr        = t.name_fr,
    description_en = t.description_en,
    description_fr = t.description_fr
FROM (VALUES
    ('can_read_pii',          'Read PHI',              'Consulter les renseignements personnels', 'View protected health information (PHI) for patients.', 'Consulter les renseignements personnels sur la santé (RPS) des patients.'),
    ('can_interpret_variant', 'Interpret variants',    'Interpréter les variants',                'Create or update variant interpretations.', 'Créer ou mettre à jour des interprétations de variants.'),
    ('can_comment_variant',   'Comment on variants',   'Commenter les variants',                  'Add, edit, or delete notes on variant occurrences.', 'Ajouter, modifier ou supprimer des notes sur les occurrences de variants.'),
    ('can_flag_variant',      'Flag variants',         'Signaler les variants',                   'Flag variant occurrences.', 'Signaler des occurrences de variants.'),
    ('can_download_file',     'Download files',        'Télécharger les fichiers',                'Download case documents.', 'Télécharger les documents de cas.'),
    ('can_ingest_data',       'Ingest data',           'Importer des données',                    'Submit data batches (cases, patients, samples, sequencing).', 'Soumettre des lots de données (cas, patients, échantillons, séquençage).'),
    ('can_search_case',       'Search cases',          'Rechercher des cas',                      'Search and view cases across the network. PHI is masked unless you have Read PHI.', 'Rechercher et consulter les cas du réseau. Les RPS sont masqués sauf si vous détenez « Consulter les RPS ».'),
    ('can_view_kb',           'View knowledge base',   'Consulter la base de connaissances',      'Browse the network''s de-identified knowledge base: genes, variants, phenotype/disease terms, and population frequencies.', 'Parcourir la base de connaissances dépersonnalisée du réseau : gènes, variants, termes phénotypiques/de maladies et fréquences populationnelles.'),
    ('can_manage_user',       'Manage members',        'Gérer les membres',                       'Create, edit, and delete members; assign and unassign roles.', 'Créer, modifier et supprimer des membres; attribuer et retirer des rôles.'),
    ('can_manage_org',        'Manage organizations',  'Gérer les organisations',                 'Create and edit organizations in the network.', 'Créer et modifier les organisations du réseau.'),
    ('can_manage_role',       'Manage roles',          'Gérer les rôles',                         'Create, edit, and delete custom roles in the network.', 'Créer, modifier et supprimer des rôles personnalisés dans le réseau.')
) AS t(code, name_en, name_fr, description_en, description_fr)
WHERE a.code = t.code;

UPDATE public.role AS r SET
    name_en        = t.name_en,
    name_fr        = t.name_fr,
    description_en = t.description_en,
    description_fr = t.description_fr
FROM (VALUES
    ('tenant_admin', 'Administrator',           'Administrateur',           'Full administrative access to this network: manage members, organizations, and roles.', 'Accès administratif complet à ce réseau : gérer les membres, les organisations et les rôles.'),
    ('member',       'Member',                  'Membre',                   'Baseline access for everyone: search cases and browse the knowledge base (genes, variants, phenotypes, population frequencies).', 'Accès de base pour tous : rechercher des cas et consulter la base de connaissances (gènes, variants, phénotypes, fréquences populationnelles).'),
    ('geneticist',   'Geneticist',              'Généticien',               'Interpret, comment on, and flag variants, read PHI, and download case files at the selected organization(s).', 'Interpréter, commenter et marquer les variants, consulter les RPS et télécharger les fichiers de cas dans les organisations sélectionnées.'),
    ('data_manager', 'Data Manager',            'Gestionnaire de données',  'Submit and manage data batches (cases, patients, samples, sequencing) at the selected organization(s).', 'Soumettre et gérer des lots de données (cas, patients, échantillons, séquençage) dans les organisations sélectionnées.')
) AS t(code, name_en, name_fr, description_en, description_fr)
WHERE r.tenant_code = 'radiant' AND r.code = t.code;
