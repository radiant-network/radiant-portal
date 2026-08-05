INSERT INTO public.task_type (code, name_en) VALUES ('clinical_report', 'Clinical Report') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.data_type (code, name_en) VALUES ('clinical_report', 'Clinical Report') ON CONFLICT (code) DO NOTHING;
