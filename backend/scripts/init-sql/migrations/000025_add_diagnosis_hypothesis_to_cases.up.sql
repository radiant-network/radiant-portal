-- The diagnostic hypothesis is analysis-level free text. It used to be stored as an observation on
-- the proband because that is how the source system attaches it, which made a case-level datum hang
-- off a member. It becomes a column on the case it belongs to.
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS diagnosis_hypothesis text;

-- Move what is already ingested. A case may carry more than one such observation — the model allows
-- it even though the ingester writes at most one — so merge them in insertion order rather than
-- picking one and dropping the rest.
UPDATE public.cases c
SET diagnosis_hypothesis = o.value
FROM (
    SELECT case_id, string_agg(value, E'\n' ORDER BY id) AS value
    FROM public.obs_string
    WHERE observation_code = 'condition'
    GROUP BY case_id
) o
WHERE c.id = o.case_id;

-- Only drop what was migrated: a row whose case did not take a value stays put rather than
-- disappearing silently.
DELETE FROM public.obs_string s
USING public.cases c
WHERE s.observation_code = 'condition'
  AND s.case_id = c.id
  AND c.diagnosis_hypothesis IS NOT NULL;
