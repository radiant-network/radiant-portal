CREATE TABLE public.exam (
    code text NOT NULL,
    name_en text NOT NULL,
    name_fr text NOT NULL,
    tenant_code text NOT NULL REFERENCES public.tenant(code)
);

ALTER TABLE ONLY public.exam
    ADD CONSTRAINT exam_pkey PRIMARY KEY (code, tenant_code);

INSERT INTO public.exam (code, name_en, name_fr, tenant_code) VALUES
    ('other', 'Other', 'Autre', 'radiant');

ALTER TABLE public.obs_categorical
    ADD COLUMN exam_code text NULL,
    ADD CONSTRAINT obs_categorical_exam_fkey FOREIGN KEY (exam_code, tenant_code) REFERENCES public.exam(code, tenant_code);

ALTER TABLE public.obs_string
    ADD COLUMN exam_code text NULL,
    ADD CONSTRAINT obs_string_exam_fkey FOREIGN KEY (exam_code, tenant_code) REFERENCES public.exam(code, tenant_code),
    ADD COLUMN interpretation_code text NULL REFERENCES public.obs_interpretation(code);

INSERT INTO public.obs_interpretation (code, name_en) VALUES
    ('abnormal', 'Abnormal'),
    ('normal', 'Normal');

INSERT INTO public.observation (code, name_en) VALUES
    ('exam', 'Exam');
