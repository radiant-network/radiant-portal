-- Bring `public.status` in line with the agreed case status dictionary: add the three new codes,
-- rename `revoke` → `revoked`, and retire `unknown`/`draft`/`incomplete`.
--
-- Retired codes are remapped to `submitted` rather than dropped from under their rows: `submitted`
-- ("variant data is pending") is the one target that asserts nothing false about a row whose real
-- state was "unknown", "draft" or "incomplete".

INSERT INTO public.status (code, name_en) VALUES
    ('processing',   'Processing'),
    ('in_review',    'In Review'),
    ('reopened',     'Reopened'),
    ('revoked',      'Cancelled'),
    ('resolved',     'Resolved'),
    ('unresolved',   'Unresolved'),
    ('inconclusive', 'Inconclusive')
ON CONFLICT (code) DO NOTHING;

UPDATE public.cases SET status_code = 'submitted'
WHERE status_code IN ('unknown', 'draft', 'incomplete');
UPDATE public.sequencing_experiment SET status_code = 'submitted'
WHERE status_code IN ('unknown', 'draft', 'incomplete');

UPDATE public.cases SET status_code = 'revoked' WHERE status_code = 'revoke';
UPDATE public.sequencing_experiment SET status_code = 'revoked' WHERE status_code = 'revoke';

DO $$
DECLARE
    retired  text[] := ARRAY['unknown', 'draft', 'incomplete', 'revoke'];
    n_cases  bigint;
    n_seqexp bigint;
BEGIN
    SELECT count(*) INTO n_cases  FROM public.cases                 WHERE status_code = ANY(retired);
    SELECT count(*) INTO n_seqexp FROM public.sequencing_experiment WHERE status_code = ANY(retired);
    IF n_cases > 0 OR n_seqexp > 0 THEN
        RAISE EXCEPTION
            'cannot retire status codes %: still referenced by % cases row(s) and % sequencing_experiment row(s)',
            retired, n_cases, n_seqexp;
    END IF;
END $$;

DELETE FROM public.status WHERE code IN ('unknown', 'draft', 'incomplete', 'revoke');

UPDATE public.status AS s SET name_en = v.name_en
FROM (VALUES
    ('submitted',    'Pending'),
    ('processing',   'Processing'),
    ('in_progress',  'In Progress'),
    ('in_review',    'In Review'),
    ('completed',    'Closed'),
    ('resolved',     'Resolved'),
    ('unresolved',   'Unresolved'),
    ('inconclusive', 'Inconclusive'),
    ('reopened',     'Reopened'),
    ('revoked',      'Cancelled')
) AS v(code, name_en)
WHERE s.code = v.code;
