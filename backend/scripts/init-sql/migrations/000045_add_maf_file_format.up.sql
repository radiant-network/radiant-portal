INSERT INTO public.file_format (code, name_en) VALUES ('maf', 'MAF File') ON CONFLICT (code) DO NOTHING;
