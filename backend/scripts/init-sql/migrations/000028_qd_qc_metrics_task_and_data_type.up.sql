INSERT INTO public.task_type (code, name_en) VALUES ('quality_control_metrics', 'Quality Control Metrics') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.data_type (code, name_en) VALUES ('aggqc', 'Aggregate Quality Control Report') ON CONFLICT (code) DO NOTHING;
