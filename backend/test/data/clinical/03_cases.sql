INSERT INTO "cases" (id, proband_id, project_id, case_analysis_id, status_code, request_id, performer_lab_id,
                    primary_condition, note, created_on, updated_on)
VALUES (1, 3, 1, 1, 'active', 1, 6, 'MONDO:0700092', 'Administrative comment',
        '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00'),
       (2, 4, 1, 1, 'active', 2, 6, 'MONDO:0700092', 'Administrative comment',
        '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00'),
       (3, 8, 1, 1, 'incomplete', 3, 6, 'MONDO:0700092', 'Administrative comment',
        '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00'),
       (4, 10, 1, 1, 'incomplete', 4, 6, 'MONDO:0700092', 'Administrative comment',
        '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00'),
       (5, 15, 1, 1, 'active', 5, 6, 'MONDO:0700092', 'Administrative comment',
        '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00'),
       (6, 16, 1, 1, 'draft', 6, 6, 'MONDO:0700092', 'Administrative comment',
        '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00'),
       (7, 20, 1, 1, 'revoke', 7, 6, 'MONDO:0700092', 'Administrative comment',
        '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00'),
       (8, 22, 1, 1, 'on-hold', 8, 6, 'MONDO:0700092', 'Administrative comment',
        '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00'),
       (9, 23, 1, 1, 'active', 9, 6, 'MONDO:0700092', 'Administrative comment',
        '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00'),
       (10, 27, 2, 1, 'active', 10, 6, 'MONDO:0700092', 'Administrative comment',
        '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00'),
       (11, 30, 2, 1, 'active', 11, 6, 'MONDO:0700092', 'Administrative comment',
        '2020-09-12T13:08:00-04:00', '2020-09-12T13:08:00-04:00'),
       (12, 34, 2, 1, 'active', 12, 6, 'MONDO:0700092', 'Administrative comment',
        '2020-09-12T13:08:00-04:00', '2020-09-12T13:08:00-04:00'),
       (13, 37, 2, 1, 'active', 13, 6, 'MONDO:0700092', 'Administrative comment',
        '2020-09-12T13:08:00-04:00', '2020-09-12T13:08:00-04:00'),
       (14, 39, 2, 1, 'active', 14, 6, 'MONDO:0700092', 'Administrative comment',
        '2020-09-12T13:08:00-04:00', '2020-09-12T13:08:00-04:00'),
       (15, 42, 2, 1, 'active', 15, 6, 'MONDO:0700092', 'Administrative comment',
        '2020-09-12T13:08:00-04:00', '2020-09-12T13:08:00-04:00'),
       (16, 44, 2, 1, 'active', 16, 6, 'MONDO:0700092', 'Administrative comment',
        '2020-09-12T13:08:00-04:00', '2020-09-12T13:08:00-04:00'),
       (17, 47, 2, 2, 'active', 17, 6, 'MONDO:0700092', 'Administrative comment',
        '2020-09-12T13:08:00-04:00', '2020-09-12T13:08:00-04:00'),
       (18, 50, 2, 2, 'completed', 18, 6, 'MONDO:0700092', 'Administrative comment',
        '2020-09-12T13:08:00-04:00', '2020-09-12T13:08:00-04:00'),
       (19, 55, 2, 2, 'completed', 19, 6, 'MONDO:0700092', 'Administrative comment',
        '2020-09-12T13:08:00-04:00', '2020-09-12T13:08:00-04:00'),
       (20, 58, 2, 2, 'completed', 20, 6, 'MONDO:0700092', 'Administrative comment',
        '2020-09-12T13:08:00-04:00', '2020-09-12T13:08:00-04:00'),
       (21, 60, 2, 2, 'active', 21, 6, 'MONDO:0700092', 'Administrative comment',
        '2020-09-12T13:08:00-04:00', '2020-09-12T13:08:00-04:00')
ON CONFLICT (id) DO NOTHING;