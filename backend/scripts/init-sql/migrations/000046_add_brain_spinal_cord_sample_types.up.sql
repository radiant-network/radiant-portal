INSERT INTO public.sample_type (code, name_en) VALUES ('brain', 'Brain'), ('spinal_cord', 'Spinal Cord') ON CONFLICT (code) DO NOTHING;
