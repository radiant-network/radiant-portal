INSERT INTO public.data_type (code, name_en) VALUES ('chrmr', 'Mitochondrial Report') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.data_type (code, name_en) VALUES ('nrrv', 'Annotated Variant Report') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.data_type (code, name_en) VALUES ('snvpg', 'Germline SNV (masked/filtered)') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.data_type (code, name_en) VALUES ('alirpg', 'Aligned Reads (masked)') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.file_format (code, name_en) VALUES ('xlsx', 'XLSX File') ON CONFLICT (code) DO NOTHING;
