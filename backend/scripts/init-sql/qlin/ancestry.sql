-- French labels are the authoritative ones from clin-fhir's qc-ethnicity CodeSystem. DO UPDATE
-- rather than DO NOTHING: this file replays on every launch, so it must be able to correct a label
-- on a volume where the rows already exist.
INSERT INTO ancestry (code, name_en, name_fr) VALUES
    ('CA-FR', 'French Canadian', 'Canadien français'),
    ('EU',    'European Caucasian', 'Caucasien européen'),
    ('ES-AS', 'East and Southeast Asian', 'Asiatique de l''est et du sud-est')
ON CONFLICT (code) DO UPDATE SET name_en = EXCLUDED.name_en, name_fr = EXCLUDED.name_fr;
