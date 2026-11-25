-- An empty name_fr, as an untranslated exam holds (its name_fr is NOT NULL): the case read falls back to name_en.
INSERT INTO ancestry (code, name_en, name_fr)
VALUES ('NO-FR', 'Ancestry without French label', '')
ON CONFLICT (code) DO NOTHING;
