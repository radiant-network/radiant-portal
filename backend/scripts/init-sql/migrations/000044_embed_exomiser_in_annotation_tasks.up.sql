-- RAD-116: the Exomiser files become outputs of the annotation tasks. The `exomiser` and `exomiser_cnv`
-- task types go away, and the CNV Exomiser report gets its own data type, `exomiser_cnv`.
--
-- Each legacy task is matched to its annotation task: the one whose output is the legacy task's input
-- (the slivar VCF, as the post-processing DAGs register it), of the matching type (`exomiser` →
-- `radiant_germline_annotation`, `exomiser_cnv` → `radiant_germline_cnv_annotation`). Fallback: the only
-- annotation task of that type on the legacy task's case that holds its sequencing, which a data check
-- requires to be the proband's.
-- Its output documents move to the annotation task; its inputs, contexts and the task itself are deleted.
--
-- The data checks raise on the first legacy task that breaks one of them. The file runs as a single
-- multi-statement Exec, which PostgreSQL runs in one implicit transaction, so an error changes nothing.
-- Run the pre-check query below first: it lists every task that breaks a check.

/*
Pre-check, read-only. Run it with psql against every environment during the data freeze, BEFORE deploying.
It applies the matching rule and the data checks of this migration and lists every legacy `exomiser` / `exomiser_cnv`
task that breaks a check, one row per broken check. Fix each listed task by hand and run it again, until it
returns no row: this migration then applies. Once applied, it always returns no row.

WITH legacy AS (
    SELECT id AS legacy_task_id,
           task_type_code AS legacy_task_type,
           tenant_code,
           CASE task_type_code
               WHEN 'exomiser' THEN 'radiant_germline_annotation'
               ELSE 'radiant_germline_cnv_annotation'
           END AS annotation_task_type
    FROM public.task
    WHERE task_type_code IN ('exomiser', 'exomiser_cnv')
),
legacy_context AS (
    SELECT l.legacy_task_id,
           count(tc.task_id) AS context_count,
           min(tc.case_id) AS case_id,
           min(tc.sequencing_experiment_id) AS sequencing_experiment_id
    FROM legacy l
    LEFT JOIN public.task_context tc ON tc.task_id = l.legacy_task_id
    GROUP BY l.legacy_task_id
),
matched_by_input AS (
    SELECT DISTINCT l.legacy_task_id, a.id AS annotation_task_id
    FROM legacy l
    JOIN public.task_has_document li ON li.task_id = l.legacy_task_id AND li.type = 'input'
    JOIN public.task_has_document ao ON ao.document_id = li.document_id AND ao.type = 'output'
    JOIN public.task a ON a.id = ao.task_id
                      AND a.task_type_code = l.annotation_task_type
                      AND a.tenant_code = l.tenant_code
),
matched_by_case AS (
    SELECT DISTINCT l.legacy_task_id, a.id AS annotation_task_id
    FROM legacy l
    JOIN legacy_context lc ON lc.legacy_task_id = l.legacy_task_id AND lc.context_count = 1
    JOIN public.task_context atc ON atc.case_id = lc.case_id
                                AND atc.sequencing_experiment_id = lc.sequencing_experiment_id
    JOIN public.task a ON a.id = atc.task_id
                      AND a.task_type_code = l.annotation_task_type
                      AND a.tenant_code = l.tenant_code
    WHERE NOT EXISTS (SELECT 1 FROM matched_by_input mi WHERE mi.legacy_task_id = l.legacy_task_id)
),
matched AS (
    SELECT * FROM matched_by_input
    UNION ALL
    SELECT * FROM matched_by_case
),
match_summary AS (
    SELECT l.legacy_task_id,
           count(m.annotation_task_id) AS match_count,
           min(m.annotation_task_id) AS annotation_task_id
    FROM legacy l
    LEFT JOIN matched m ON m.legacy_task_id = l.legacy_task_id
    GROUP BY l.legacy_task_id
),
legacy_task AS (
    SELECT l.legacy_task_id,
           l.legacy_task_type,
           lc.context_count,
           lc.case_id,
           lc.sequencing_experiment_id,
           -- Same rule as the portal's proband join: the sample's patient is the case proband. A fetus sample
           -- carries its mother's patient_id, so it counts too, as in the ETL staging view.
           EXISTS (SELECT 1
                   FROM public.sequencing_experiment se
                   JOIN public.sample s ON s.id = se.sample_id
                   JOIN public.cases c ON c.id = lc.case_id
                   WHERE se.id = lc.sequencing_experiment_id
                     AND s.patient_id = c.proband_id) AS sequencing_is_proband,
           -- occurrence_note and occurrence_flag reference task(id): a row on a legacy task blocks its delete.
           (SELECT count(*) FROM public.occurrence_note n WHERE n.task_id = l.legacy_task_id) AS note_count,
           (SELECT count(*) FROM public.occurrence_flag f WHERE f.task_id = l.legacy_task_id) AS flag_count,
           ms.match_count,
           CASE WHEN ms.match_count = 1 THEN ms.annotation_task_id END AS annotation_task_id,
           EXISTS (SELECT 1
                   FROM public.task_context atc
                   WHERE atc.task_id = ms.annotation_task_id
                     AND atc.case_id = lc.case_id
                     AND atc.sequencing_experiment_id = lc.sequencing_experiment_id) AS annotation_holds_sequencing,
           (SELECT count(DISTINCT m2.legacy_task_id)
            FROM matched m2
            WHERE m2.annotation_task_id = ms.annotation_task_id) > 1 AS annotation_matched_twice
    FROM legacy l
    JOIN legacy_context lc ON lc.legacy_task_id = l.legacy_task_id
    JOIN match_summary ms ON ms.legacy_task_id = l.legacy_task_id
)
SELECT legacy_task_id, legacy_task_type, failed_check, detail
FROM (
    SELECT legacy_task_id, legacy_task_type, 'task_context_count' AS failed_check,
           format('%s task_context rows, expected exactly 1', context_count) AS detail
    FROM legacy_task
    WHERE context_count <> 1

    UNION ALL

    SELECT legacy_task_id, legacy_task_type, 'sequencing_not_proband',
           format('sequencing %s is not the proband''s of case %s', sequencing_experiment_id, case_id)
    FROM legacy_task
    WHERE context_count = 1 AND NOT sequencing_is_proband

    UNION ALL

    SELECT legacy_task_id, legacy_task_type, 'annotation_task_match_count',
           format('%s matched annotation tasks, expected exactly 1', match_count)
    FROM legacy_task
    WHERE match_count <> 1

    UNION ALL

    SELECT legacy_task_id, legacy_task_type, 'annotation_task_without_sequencing',
           format('annotation task %s has no task_context row with the same case and sequencing', annotation_task_id)
    FROM legacy_task
    WHERE context_count = 1 AND match_count = 1 AND NOT annotation_holds_sequencing

    UNION ALL

    SELECT legacy_task_id, legacy_task_type, 'occurrence_notes_or_flags',
           format('%s occurrence notes and %s occurrence flags, expected none', note_count, flag_count)
    FROM legacy_task
    WHERE note_count + flag_count > 0

    UNION ALL

    SELECT legacy_task_id, legacy_task_type, 'annotation_task_matched_twice',
           format('annotation task %s is matched by another legacy task', annotation_task_id)
    FROM legacy_task
    WHERE match_count = 1 AND annotation_matched_twice
) failures
ORDER BY legacy_task_id, failed_check;
*/

INSERT INTO public.data_type (code, name_en) VALUES ('exomiser_cnv', 'Exomiser CNV Report') ON CONFLICT (code) DO NOTHING;

-- Materialized before any write: the matching reads task_has_document, which the move below changes.
CREATE TEMP TABLE exomiser_legacy_task ON COMMIT DROP AS
WITH legacy AS (
    SELECT id AS legacy_task_id,
           task_type_code AS legacy_task_type,
           tenant_code,
           CASE task_type_code
               WHEN 'exomiser' THEN 'radiant_germline_annotation'
               ELSE 'radiant_germline_cnv_annotation'
           END AS annotation_task_type
    FROM public.task
    WHERE task_type_code IN ('exomiser', 'exomiser_cnv')
),
legacy_context AS (
    SELECT l.legacy_task_id,
           count(tc.task_id) AS context_count,
           min(tc.case_id) AS case_id,
           min(tc.sequencing_experiment_id) AS sequencing_experiment_id
    FROM legacy l
    LEFT JOIN public.task_context tc ON tc.task_id = l.legacy_task_id
    GROUP BY l.legacy_task_id
),
matched_by_input AS (
    SELECT DISTINCT l.legacy_task_id, a.id AS annotation_task_id
    FROM legacy l
    JOIN public.task_has_document li ON li.task_id = l.legacy_task_id AND li.type = 'input'
    JOIN public.task_has_document ao ON ao.document_id = li.document_id AND ao.type = 'output'
    JOIN public.task a ON a.id = ao.task_id
                      AND a.task_type_code = l.annotation_task_type
                      AND a.tenant_code = l.tenant_code
),
matched_by_case AS (
    SELECT DISTINCT l.legacy_task_id, a.id AS annotation_task_id
    FROM legacy l
    JOIN legacy_context lc ON lc.legacy_task_id = l.legacy_task_id AND lc.context_count = 1
    JOIN public.task_context atc ON atc.case_id = lc.case_id
                                AND atc.sequencing_experiment_id = lc.sequencing_experiment_id
    JOIN public.task a ON a.id = atc.task_id
                      AND a.task_type_code = l.annotation_task_type
                      AND a.tenant_code = l.tenant_code
    WHERE NOT EXISTS (SELECT 1 FROM matched_by_input mi WHERE mi.legacy_task_id = l.legacy_task_id)
),
matched AS (
    SELECT * FROM matched_by_input
    UNION ALL
    SELECT * FROM matched_by_case
),
match_summary AS (
    SELECT l.legacy_task_id,
           count(m.annotation_task_id) AS match_count,
           min(m.annotation_task_id) AS annotation_task_id
    FROM legacy l
    LEFT JOIN matched m ON m.legacy_task_id = l.legacy_task_id
    GROUP BY l.legacy_task_id
)
SELECT l.legacy_task_id,
       l.legacy_task_type,
       lc.context_count,
       lc.case_id,
       lc.sequencing_experiment_id,
       -- Same rule as the portal's proband join: the sample's patient is the case proband. A fetus sample
       -- carries its mother's patient_id, so it counts too, as in the ETL staging view.
       EXISTS (SELECT 1
               FROM public.sequencing_experiment se
               JOIN public.sample s ON s.id = se.sample_id
               JOIN public.cases c ON c.id = lc.case_id
               WHERE se.id = lc.sequencing_experiment_id
                 AND s.patient_id = c.proband_id) AS sequencing_is_proband,
       -- occurrence_note and occurrence_flag reference task(id): a row on a legacy task blocks its delete.
       (SELECT count(*) FROM public.occurrence_note n WHERE n.task_id = l.legacy_task_id) AS note_count,
       (SELECT count(*) FROM public.occurrence_flag f WHERE f.task_id = l.legacy_task_id) AS flag_count,
       ms.match_count,
       CASE WHEN ms.match_count = 1 THEN ms.annotation_task_id END AS annotation_task_id,
       EXISTS (SELECT 1
               FROM public.task_context atc
               WHERE atc.task_id = ms.annotation_task_id
                 AND atc.case_id = lc.case_id
                 AND atc.sequencing_experiment_id = lc.sequencing_experiment_id) AS annotation_holds_sequencing,
       (SELECT count(DISTINCT m2.legacy_task_id)
        FROM matched m2
        WHERE m2.annotation_task_id = ms.annotation_task_id) > 1 AS annotation_matched_twice
FROM legacy l
JOIN legacy_context lc ON lc.legacy_task_id = l.legacy_task_id
JOIN match_summary ms ON ms.legacy_task_id = l.legacy_task_id;

DO $$
DECLARE
    failure record;
BEGIN
    SELECT legacy_task_id, legacy_task_type,
           CASE
               WHEN context_count <> 1 THEN
                   format('it has %s task_context rows, expected exactly 1', context_count)
               WHEN NOT sequencing_is_proband THEN
                   format('its sequencing %s is not the proband''s of case %s', sequencing_experiment_id, case_id)
               WHEN match_count <> 1 THEN
                   format('it matches %s annotation tasks, expected exactly 1', match_count)
               WHEN NOT annotation_holds_sequencing THEN
                   format('its annotation task %s has no task_context row with its case and sequencing', annotation_task_id)
               WHEN note_count + flag_count > 0 THEN
                   format('it has %s occurrence notes and %s occurrence flags, expected none', note_count, flag_count)
               ELSE
                   format('its annotation task %s is matched by another legacy task', annotation_task_id)
           END AS reason
    INTO failure
    FROM exomiser_legacy_task
    WHERE context_count <> 1
       OR NOT sequencing_is_proband
       OR match_count <> 1
       OR NOT annotation_holds_sequencing
       OR note_count + flag_count > 0
       OR annotation_matched_twice
    ORDER BY legacy_task_id
    LIMIT 1;

    IF FOUND THEN
        RAISE EXCEPTION 'cannot move the Exomiser outputs of % task %: %. Fix the data (see the pre-check query at the top of this migration), then re-run.',
            failure.legacy_task_type, failure.legacy_task_id, failure.reason;
    END IF;
END $$;

UPDATE public.document d
SET data_type_code = 'exomiser_cnv'
FROM public.task_has_document thd
JOIN exomiser_legacy_task l ON l.legacy_task_id = thd.task_id
WHERE thd.document_id = d.id
  AND thd.type = 'output'
  AND l.legacy_task_type = 'exomiser_cnv';

UPDATE public.task_has_document thd
SET task_id = l.annotation_task_id
FROM exomiser_legacy_task l
WHERE thd.task_id = l.legacy_task_id
  AND thd.type = 'output';

DELETE FROM public.task_has_document WHERE task_id IN (SELECT legacy_task_id FROM exomiser_legacy_task);
DELETE FROM public.task_context WHERE task_id IN (SELECT legacy_task_id FROM exomiser_legacy_task);
DELETE FROM public.task WHERE id IN (SELECT legacy_task_id FROM exomiser_legacy_task);
DELETE FROM public.task_type WHERE code IN ('exomiser', 'exomiser_cnv');
