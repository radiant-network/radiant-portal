INSERT INTO project (id, code, name, description, tenant_code)
VALUES (1, 'N1', 'NeuroDev Phase I', 'Phase one NeuroDev cases', 'radiant'),
       (2, 'N2', 'NeuroDev Phase II', 'Phase two NeuroDev cases', 'radiant')
ON CONFLICT (id) DO NOTHING;
