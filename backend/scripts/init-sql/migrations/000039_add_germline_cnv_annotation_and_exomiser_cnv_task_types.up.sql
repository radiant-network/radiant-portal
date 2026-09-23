INSERT INTO public.task_type (code, name_en) VALUES ('radiant_germline_cnv_annotation', 'RADIANT Germline CNV Annotation') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.task_type (code, name_en) VALUES ('exomiser_cnv', 'Exomiser CNV') ON CONFLICT (code) DO NOTHING;
