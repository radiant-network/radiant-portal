-- A clinical sign-off report (e.g. a DGD Nexus clinical report export) is attached to a case as
-- its own task, distinct from the pipeline/annotation tasks, so the file is reachable from the
-- case without going through the somatic annotation ETL.
--
-- Its documents must carry data_type_code 'clinical_report'. A VCF (format_code = 'vcf') tagged
-- 'snv' / 'ssnv' / 'gcnv' is what the ETL staging view treats as variant data, so those codes
-- would risk the report being extracted as regular variant data.
INSERT INTO public.task_type (code, name_en) VALUES ('clinical_report', 'Clinical Report') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.data_type (code, name_en) VALUES ('clinical_report', 'Clinical Report') ON CONFLICT (code) DO NOTHING;
