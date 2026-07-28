-- Admin API MVP: the three tenant-scoped management actions and the tenant_admin role that
-- holds them. can_manage_org is enforced now (org create/edit); can_manage_user and
-- can_manage_role are seeded here so tenant_admin is defined once, though their routes ship
-- later. Data-safe and idempotent (ON CONFLICT DO NOTHING).

INSERT INTO public.action (code, scope, description) VALUES
    ('can_manage_user', 'tenant', 'Create, edit, and disable users in the tenant; assign and unassign roles.'),
    ('can_manage_org',  'tenant', 'Create and edit organizations in the tenant.'),
    ('can_manage_role', 'tenant', 'Create, edit, and delete custom roles in the tenant.')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.role (tenant_code, code, name, description) VALUES
    ('radiant', 'tenant_admin', 'Tenant Administrator', 'Manage users, organizations, and roles in the tenant.')
ON CONFLICT (tenant_code, code) DO NOTHING;

INSERT INTO public.role_action (tenant_code, role_code, action_code) VALUES
    ('radiant', 'tenant_admin', 'can_manage_user'),
    ('radiant', 'tenant_admin', 'can_manage_org'),
    ('radiant', 'tenant_admin', 'can_manage_role')
ON CONFLICT (tenant_code, role_code, action_code) DO NOTHING;
