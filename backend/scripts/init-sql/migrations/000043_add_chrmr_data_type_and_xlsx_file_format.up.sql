INSERT INTO public.data_type (code, name_en) VALUES ('chrmr', 'Mitochondrial Report') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.file_format (code, name_en) VALUES ('xlsx', 'XLSX Spreadsheet File') ON CONFLICT (code) DO NOTHING;
