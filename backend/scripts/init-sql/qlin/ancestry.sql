INSERT INTO ancestry (code, name_en) VALUES
    ('CA-FR', 'French Canadian'),
    ('EU',    'European Caucasian'),
    ('ES-AS', 'East and Southeast Asian')
ON CONFLICT (code) DO NOTHING;
