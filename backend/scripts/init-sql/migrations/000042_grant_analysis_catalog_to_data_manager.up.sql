-- Migration 000041 granted can_manage_analysis_catalog to tenant_admin only. Data managers also
-- maintain the gene panels, so grant it to the default data_manager role of every tenant.
-- The action is tenant-scoped: a data_manager granted at a single organization may upload the
-- gene panels of the whole tenant.
-- Data-safe and idempotent.

INSERT INTO public.role_action (tenant_code, role_code, action_code)
SELECT r.tenant_code, r.code, 'can_manage_analysis_catalog'
FROM public.role r
WHERE r.code = 'data_manager' AND r.is_default
ON CONFLICT (tenant_code, role_code, action_code) DO NOTHING;

-- Default roles are locked (no edit), so their labels are still the seeded copy; keep them in
-- step with the create-tenant DefaultRoles template.
UPDATE public.role SET
    description_en = 'Submit and manage data batches (cases, patients, samples, sequencing) at the selected organization(s), and manage the network''s gene panels.',
    description_fr = 'Soumettre et gérer des lots de données (cas, patients, échantillons, séquençage) dans les organisations sélectionnées, et gérer les panels de gènes du réseau.'
WHERE code = 'data_manager' AND is_default;
