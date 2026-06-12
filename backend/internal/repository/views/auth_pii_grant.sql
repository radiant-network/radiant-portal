CREATE VIEW auth.pii_grant AS
SELECT ur.user_id, ur.tenant_code, ur.org_code
FROM radiant_jdbc.public.user_role ur
JOIN radiant_jdbc.public.role_action ra
  ON ra.tenant_code = ur.tenant_code AND ra.role_code = ur.role_code
WHERE ra.action_code = 'can_read_pii' AND ur.org_code <> '*'
UNION
SELECT ur.user_id, o.tenant_code, o.code
FROM radiant_jdbc.public.user_role ur
JOIN radiant_jdbc.public.role_action ra
  ON ra.tenant_code = ur.tenant_code AND ra.role_code = ur.role_code
JOIN radiant_jdbc.public.organization o
  ON o.tenant_code = ur.tenant_code
WHERE ra.action_code = 'can_read_pii' AND ur.org_code = '*'
