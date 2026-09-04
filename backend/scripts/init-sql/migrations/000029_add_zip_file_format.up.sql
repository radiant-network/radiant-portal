INSERT INTO public.file_format (code, name_en) VALUES ('zip', 'ZIP Archive File') ON CONFLICT (code) DO NOTHING;
