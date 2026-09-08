-- Retire the separate resolution dimension. Resolved / Unresolved / Inconclusive are now closure
-- sub-statuses of `cases.status_code` (seeded by 000030), so `cases.resolution_status_code`, its FK
-- and `public.resolution_status` all go away.

DO $$
DECLARE
    r        record;
    n_solved bigint;
    n_incon  bigint;
BEGIN
    RAISE NOTICE 'resolution_status_code retirement - BEFORE (status_code x resolution_status_code):';
    FOR r IN
        SELECT status_code,
               coalesce(resolution_status_code, '<null>') AS resolution_status_code,
               count(*) AS n
        FROM public.cases
        GROUP BY 1, 2
        ORDER BY 1, 2
    LOOP
        RAISE NOTICE '  % / % : %', r.status_code, r.resolution_status_code, r.n;
    END LOOP;

    UPDATE public.cases SET status_code = 'resolved'
    WHERE status_code = 'completed' AND resolution_status_code = 'solved';
    GET DIAGNOSTICS n_solved = ROW_COUNT;

    UPDATE public.cases SET status_code = 'inconclusive'
    WHERE status_code = 'completed' AND resolution_status_code = 'inconclusive';
    GET DIAGNOSTICS n_incon = ROW_COUNT;

    RAISE NOTICE 'remapped: completed+solved -> resolved = %, completed+inconclusive -> inconclusive = %',
        n_solved, n_incon;
    RAISE NOTICE 'discarded: every remaining resolution_status_code, including the % unsolved default(s)',
        (SELECT count(*) FROM public.cases WHERE resolution_status_code = 'unsolved');

    RAISE NOTICE 'resolution_status_code retirement - AFTER (status_code):';
    FOR r IN
        SELECT status_code, count(*) AS n FROM public.cases GROUP BY 1 ORDER BY 1
    LOOP
        RAISE NOTICE '  % : %', r.status_code, r.n;
    END LOOP;
END $$;

ALTER TABLE public.cases DROP CONSTRAINT IF EXISTS cases_resolution_status_code_fkey;
ALTER TABLE public.cases DROP COLUMN IF EXISTS resolution_status_code;

DROP TABLE IF EXISTS public.resolution_status;
