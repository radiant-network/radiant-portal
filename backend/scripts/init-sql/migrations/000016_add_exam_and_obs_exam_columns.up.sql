CREATE TABLE public.exam (
    code text NOT NULL,
    name_en text NOT NULL,
    name_fr text NOT NULL
);

ALTER TABLE ONLY public.exam
    ADD CONSTRAINT exam_pkey PRIMARY KEY (code);

INSERT INTO public.exam (code, name_en, name_fr) VALUES
    ('acyl',  'Acylcarnitines', 'Acylcarnitines'),
    ('bmet',  'Metabolic Work-Up', 'Bilan métabolique'),
    ('bmus',  'Muscle Biopsy', 'Biopsie musculaire'),
    ('caap',  'Plasma Amino Acid Chromatography', 'Chromatographie acides aminés plasmatiques'),
    ('cgh',   'Comparative Genomic Hybridization', 'Hybridation génomique comparative'),
    ('ckin',  'Serum Creatine Kinase', 'Créatine kinase sérique'),
    ('cnvpg', 'Genomic CNV analysis', 'Analyse CNV pan-génomique'),
    ('ctgr',  'CTG Repeat Testing (Steinert Disease)', 'Test répétitions CTG (maladie de Steinert)'),
    ('eabd',  'Abdominal Ultrasound', 'Échographie abdominale'),
    ('ecar',  'Cardiac Ultrasound', 'Échographie cardiaque'),
    ('eeg',   'Electroencephalogram (EEG)', 'Électroencéphalogramme (EEG)'),
    ('emg',   'Electromyography (EMG)', 'Electromyographie (EMG)'),
    ('gcnr',  'GCN Repeat Testing (Oculopharyngeal Muscular Dystrophy)', 'Test répétitions GCN (dystrophie musculaire oculopharyngée)'),
    ('irmc',  'Cerebral MRI', 'IRM cérébrale'),
    ('irmm',  'Muscle MRI', 'IRM musculaire'),
    ('lp',    'Lymphocyte Phenotyping', 'Phénotypage lymphocytaire'),
    ('lpwgs', 'CNV (Microarray/LP-WGS)', 'CNV (micropuce/LP-WGS)'),
    ('opht',  'Ophthalmological Examination', 'Examen ophtalmologique'),
    ('pg',    'Gene Panel', 'Panel de gènes'),
    ('qfpcr', 'Rapid detection of fetal aneuploidies (QF-PCR)', 'Détection rapide des aneuploïdies (QF-PCR)'),
    ('srmn',  'NMR Spectroscopy', 'Spectroscopie RMN'),
    ('tgdd',  'Deletions and Duplications Testing (Duchenne and Becker Dystrophies)', 'Test délétions et duplication (dystrophies Duchenne et Becker)'),
    ('tsxf',  'Fragile X Syndrome Testing', 'Test syndrome de X fragile'),
    ('other', 'Other', 'Autre');

ALTER TABLE public.obs_categorical
    ADD COLUMN exam_code text NULL REFERENCES public.exam(code);

ALTER TABLE public.obs_string
    ADD COLUMN exam_code text NULL REFERENCES public.exam(code),
    ADD COLUMN interpretation_code text NULL REFERENCES public.obs_interpretation(code);

INSERT INTO public.obs_interpretation (code, name_en) VALUES
    ('abnormal', 'Abnormal'),
    ('normal', 'Normal');

INSERT INTO public.observation (code, name_en) VALUES
    ('exam', 'Exam');
