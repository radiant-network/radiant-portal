CREATE TABLE public.ancestry (
    code text NOT NULL,
    name_en text NOT NULL
);

ALTER TABLE ONLY public.ancestry
    ADD CONSTRAINT ancestry_pkey PRIMARY KEY (code);

INSERT INTO public.ancestry (code, name_en) VALUES
    ('BLK',    'Black'),
    ('EAS',    'East Asian'),
    ('IND',    'Indigenous people'),
    ('LAT-AM', 'Latin American'),
    ('MENA',   'Middle Eastern or North African'),
    ('SO-AS',  'South Asian'),
    ('SE-AS',  'Southeast Asian'),
    ('WHT',    'White'),
    ('NH-PI',  'Native Hawaiian or Pacific Islander'),
    ('MIX',    'Mixed'),
    ('OTH',    'Other');
