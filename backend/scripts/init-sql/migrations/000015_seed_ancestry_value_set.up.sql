CREATE TABLE public.ancestry (
    code text NOT NULL,
    name_en text NOT NULL
);

ALTER TABLE ONLY public.ancestry
    ADD CONSTRAINT ancestry_pkey PRIMARY KEY (code);

INSERT INTO public.ancestry VALUES
    ('CA-FR',  'French Canadian'),
    ('EU',     'European Caucasian'),
    ('AFR',    'African or Caribbean'),
    ('LAT-AM', 'Hispanic and Latino American'),
    ('ES-AS',  'East and Southeast Asian'),
    ('SO-AS',  'South Asian'),
    ('ABOR',   'Aboriginal'),
    ('MIX',    'Mixted Ethnicities'),
    ('OTH',    'Other');
