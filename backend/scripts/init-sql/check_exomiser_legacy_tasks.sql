-- Pre-migration check for 000044_embed_exomiser_in_annotation_tasks (RAD-116).
--
-- Run against every environment during the data freeze, BEFORE deploying. Read-only. It applies the
-- matching rule and the data checks of 000044, and lists every legacy `exomiser` / `exomiser_cnv`
-- task that breaks a check, one row per broken check. Fix each listed task by hand and run it again,
-- until it returns no row: 000044 then applies. Keep the matching rule in sync with 000044.
--
--   psql "$DATABASE_URL" -f backend/scripts/init-sql/check_exomiser_legacy_tasks.sql

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
