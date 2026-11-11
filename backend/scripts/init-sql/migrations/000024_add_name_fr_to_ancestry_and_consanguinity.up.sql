-- French labels for the two value sets the case entity now exposes. Nullable on purpose: a
-- deployment may add codes of its own without a translation, and name_en stays the fallback.
ALTER TABLE public.ancestry ADD COLUMN IF NOT EXISTS name_fr text;
ALTER TABLE public.consanguinity ADD COLUMN IF NOT EXISTS name_fr text;

-- These translate Radiant's own English wording rather than QLIN's vocabulary. The two overlap
-- through a mapping made upstream (QLIN AFR and ABOR are sent as BLK and IND), so a code can carry
-- a QLIN meaning while its label here follows the generic list it belongs to.
UPDATE public.ancestry a SET name_fr = v.name_fr
FROM (VALUES
    ('BLK',    'Noir'),
    ('EAS',    'Asiatique de l''Est'),
    ('IND',    'Peuples autochtones'),
    ('LAT-AM', 'Latino-américain'),
    ('MENA',   'Moyen-Oriental ou Nord-Africain'),
    ('SO-AS',  'Asiatique du Sud'),
    ('SE-AS',  'Asiatique du Sud-Est'),
    ('WHT',    'Blanc'),
    ('NH-PI',  'Hawaïen autochtone ou insulaire du Pacifique'),
    ('MIX',    'Origine mixte'),
    ('OTH',    'Autre')
) AS v(code, name_fr)
WHERE a.code = v.code;

UPDATE public.consanguinity c SET name_fr = v.name_fr
FROM (VALUES
    ('unknown',          'Inconnu'),
    ('consanguinity',    'Consanguinité dans la famille'),
    ('no_consanguinity', 'Pas de consanguinité dans la famille')
) AS v(code, name_fr)
WHERE c.code = v.code;
