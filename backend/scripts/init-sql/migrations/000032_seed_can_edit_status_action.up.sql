-- Case Status Switcher: editing a case status becomes a gated capability. The action is
-- org-scoped (it resolves to the diagnosis lab of the case, like the other clinical write
-- actions) and grantable, so a tenant's custom roles may confer it. Shipped in radiant's
-- default geneticist role; the UI does not enforce it yet.
--
-- Labels are set inline (the action table gained name_en/name_fr/description_fr in 000019)
-- and grantable defaults to true (000026). Data-safe and idempotent.

INSERT INTO public.action (code, scope, grantable, name_en, name_fr, description_en, description_fr) VALUES
    ('can_edit_status', 'org', true,
     'Edit case status',
     'Modifier le statut des cas',
     'Change the status of a case at the selected organization(s).',
     'Modifier le statut d''un cas dans les organisations sélectionnées.')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.role_action (tenant_code, role_code, action_code) VALUES
    ('radiant', 'geneticist', 'can_edit_status')
ON CONFLICT (tenant_code, role_code, action_code) DO NOTHING;
