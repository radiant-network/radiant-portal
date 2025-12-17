INSERT INTO panel(code, name, type_code)
VALUES ('EPILEP', 'Epilepsy', 'physical'),
       ('HEART', 'Heart diseases', 'physical');

UPDATE analysis_catalog SET panel_id = 1 WHERE code = 'WGA';
UPDATE analysis_catalog SET panel_id = 2 WHERE code = 'IDGD';