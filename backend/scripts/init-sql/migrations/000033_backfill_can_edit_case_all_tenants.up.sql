-- Migration 000032 granted can_edit_case to radiant's geneticist only, so every tenant
-- provisioned before it kept a geneticist role without the action. Backfill them all.

INSERT INTO public.role_action (tenant_code, role_code, action_code)
SELECT r.tenant_code, r.code, 'can_edit_case'
FROM public.role r
WHERE r.code = 'geneticist' AND r.is_default
ON CONFLICT (tenant_code, role_code, action_code) DO NOTHING;
