-- Gene panel upload (RAD-10).
--   panel_type 'uploaded'          — marks the panels that PUT /{tenant}/gene_panels owns. Each
--                                    upload replaces only these, so the prescription panels of the
--                                    analysis catalog (same panel table) stay unchanged.
--   can_manage_analysis_catalog    — tenant-scoped action that gates the upload. Granted to the
--                                    default tenant_admin role of every tenant.
-- Data-safe and idempotent.

INSERT INTO public.panel_type (code, name_en) VALUES ('uploaded', 'Uploaded')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.action (code, scope, grantable, name_en, name_fr, description_en, description_fr) VALUES
    ('can_manage_analysis_catalog', 'tenant', true,
     'Manage analysis catalog',
     'Gérer le catalogue d''analyses',
     'Upload and replace the gene panels of the tenant.',
     'Téléverser et remplacer les panels de gènes du réseau.')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.role_action (tenant_code, role_code, action_code)
SELECT r.tenant_code, r.code, 'can_manage_analysis_catalog'
FROM public.role r
WHERE r.code = 'tenant_admin' AND r.is_default
ON CONFLICT (tenant_code, role_code, action_code) DO NOTHING;
