INSERT INTO project (id, code, name, description)
VALUES (1, 'N1', 'NeuroDev Phase I', 'Phase one NeuroDev cases'),
       (2, 'N2', 'NeuroDev Phase II', 'Phase two NeuroDev cases')
ON CONFLICT (id) DO NOTHING;
