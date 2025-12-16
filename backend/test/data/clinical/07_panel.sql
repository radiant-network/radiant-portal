INSERT INTO panel(code, name, type_code)
VALUES ('EPILEP', 'Epilepsy', 'physical');

UPDATE analysis_catalog SET panel_id = 1 WHERE code = 'WGA';