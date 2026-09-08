-- Retire the separate resolution dimension. Resolved / Unresolved / Inconclusive are now closure
-- sub-statuses of `cases.status_code` (seeded by 000030), so `cases.resolution_status_code`, its FK
-- and `public.resolution_status` all go away.
--
-- `unsolved` is deliberately not migrated: it is GORM's client-side default (types.Case), so it
-- cannot be told apart from "nobody set a resolution" and is discarded with the column.

UPDATE public.cases SET status_code = 'resolved'
WHERE status_code = 'completed' AND resolution_status_code = 'solved';

UPDATE public.cases SET status_code = 'inconclusive'
WHERE status_code = 'completed' AND resolution_status_code = 'inconclusive';

ALTER TABLE public.cases DROP CONSTRAINT IF EXISTS cases_resolution_status_code_fkey;
ALTER TABLE public.cases DROP COLUMN IF EXISTS resolution_status_code;

DROP TABLE IF EXISTS public.resolution_status;
