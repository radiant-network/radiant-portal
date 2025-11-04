CREATE TABLE IF NOT EXISTS "consanguinity"
(
    "code"    TEXT PRIMARY KEY,
    "name_en" TEXT NOT NULL
);

INSERT INTO consanguinity (code, name_en)
VALUES ('unknown', 'Unknown'),
       ('consanguinity', 'Consanguinity in family'),
       ('no_consanguinity', 'No consanguinity in family')
ON CONFLICT (code) DO NOTHING;