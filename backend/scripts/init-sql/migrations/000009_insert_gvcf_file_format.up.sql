INSERT INTO file_format (code, name_en)
VALUES ('gvcf', 'gVCF File')
ON CONFLICT (code) DO NOTHING;
