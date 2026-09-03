INSERT INTO public.data_type (code, name_en) VALUES ('zip', 'Zip Archive') ON CONFLICT (code) DO NOTHING;
