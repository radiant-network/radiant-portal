INSERT INTO public.action (code, scope, grantable, name_en, name_fr, description_en, description_fr) VALUES
    ('can_edit_case', 'org', true,
     'Edit cases',
     'Modifier les cas',
     'Change a case''s status as it is reviewed and interpreted.',
     'Modifier le statut d''un cas au fil de sa révision et de son interprétation.')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.role_action (tenant_code, role_code, action_code) VALUES
    ('radiant', 'geneticist', 'can_edit_case')
ON CONFLICT (tenant_code, role_code, action_code) DO NOTHING;
