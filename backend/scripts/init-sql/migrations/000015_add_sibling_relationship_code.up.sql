INSERT INTO "family_relationship" ("code", "name_en")
VALUES ('sibling', 'Sibling')
ON CONFLICT (code) DO NOTHING;