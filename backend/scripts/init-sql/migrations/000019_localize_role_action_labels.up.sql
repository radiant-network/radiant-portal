-- Localize role and action labels: rename the English columns with an _en suffix, add French
-- (_fr) columns, then backfill EN/FR labels for the seeded actions and radiant's default roles.
-- action also gains name_en/name_fr (it previously had no name). The new _fr columns and action
-- name columns are nullable; existing rows keep their English text under *_en.

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
-- 2. Backfill translations. Actions are global; roles are seeded per tenant, so only radiant's
--    default roles are set here — new tenants get their translations from the create-tenant
--    DefaultRoles template.
-- =============================================================================
UPDATE public.action AS a SET
    name_en        = t.name_en,
    name_fr        = t.name_fr,
    description_fr = t.description_fr
FROM (VALUES
    ('can_read_pii',          'Read PII',              'Consulter les renseignements de santé',       'Consulter les colonnes de renseignements personnels de santé (dossier médical, prénom/nom, date de naissance, …) pour les lignes de cette organisation.'),
    ('can_interpret_variant', 'Interpret Variant',     'Interpréter un variant',                       'Créer ou mettre à jour l''interprétation d''un variant dans cette organisation.'),
    ('can_comment_variant',   'Comment Variant',       'Commenter un variant',                         'Créer, modifier ou supprimer des notes sur une occurrence de variant dans cette organisation.'),
    ('can_flag_variant',      'Flag Variant',          'Marquer un variant',                           'Ajouter ou retirer un drapeau, une épingle ou une étoile sur une occurrence de variant dans cette organisation.'),
    ('can_download_file',     'Download File',         'Télécharger des fichiers',                     'Générer des URL de téléchargement présignées pour les documents de cas de cette organisation.'),
    ('can_ingest_data',       'Ingest Data',           'Ingérer des données',                          'Soumettre des lots (cas, patients, échantillons, séquençage) pour cette organisation.'),
    ('can_search_case',       'Search Cases',          'Rechercher des cas',                           'Rechercher et consulter les cas du locataire (renseignements de santé masqués selon can_read_pii).'),
    ('can_view_kb',           'View Knowledge Base',   'Consulter la base de connaissances',           'Consulter la base de connaissances : variants, gènes, termes HPO/MONDO, fréquences.'),
    ('can_manage_user',       'Manage Users',          'Gérer les utilisateurs',                       'Créer, modifier et désactiver les utilisateurs du locataire; attribuer et retirer des rôles.'),
    ('can_manage_org',        'Manage Organizations',  'Gérer les organisations',                      'Créer et modifier les organisations du locataire.'),
    ('can_manage_role',       'Manage Roles',          'Gérer les rôles',                              'Créer, modifier et supprimer des rôles personnalisés dans le locataire.')
) AS t(code, name_en, name_fr, description_fr)
WHERE a.code = t.code;

UPDATE public.role AS r SET
    name_fr        = t.name_fr,
    description_fr = t.description_fr
FROM (VALUES
    ('member',       'Membre',                  'Rechercher des cas et consulter la base de connaissances.'),
    ('geneticist',   'Généticien',              'Consulter les renseignements de santé, télécharger des fichiers, et interpréter, commenter et marquer des variants.'),
    ('data_manager', 'Gestionnaire de données', 'Soumettre des lots (cas, patients, échantillons, séquençage).'),
    ('tenant_admin', 'Administrateur',          'Gérer les utilisateurs, les organisations et les rôles du locataire.')
) AS t(code, name_fr, description_fr)
WHERE r.tenant_code = 'radiant' AND r.code = t.code;
