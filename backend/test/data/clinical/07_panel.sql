INSERT INTO panel(code, name, type_code, tenant_code)
VALUES ('EPILEP', 'Epilepsy', 'physical', 'radiant'),
       ('HEART', 'Heart diseases', 'physical', 'radiant');

UPDATE analysis_catalog SET panel_id = (select id from panel where code = 'EPILEP') WHERE code = 'WGA';
UPDATE analysis_catalog SET panel_id = (select id from panel where code = 'HEART') WHERE code = 'IDGD';