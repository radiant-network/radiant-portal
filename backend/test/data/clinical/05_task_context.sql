INSERT INTO "task_context" (task_id, sequencing_experiment_id, case_id)
VALUES (1, 1, NULL),
       (2, 2, NULL),
       (3, 3, NULL),
       (4, 1, 1),
       (4, 2, 1),
       (4, 3, 1),
       (5, 1, 1),
       (5, 2, 1),
       (5, 3, 1),
       (6, 1, 1),
       (7, 2, 1),
       (8, 3, 1),

       (11, 4, NULL),
       (12, 5, NULL),
       (13, 6, NULL),

       (14, 7, NULL),
       (15, 8, NULL),
       (16, 9, NULL),
       (77, 7, 3),
       (77, 8, 3),
       (77, 9, 3),

       (17, 10, NULL),
       (18, 11, NULL),
       (19, 12, NULL),
       (78, 10, 4),
       (78, 11, 4),
       (78, 12, 4),

       (20, 13, NULL),
       (21, 14, NULL),
       (22, 15, NULL),
       (79, 13, 5),
       (79, 14, 5),
       (79, 15, 5),

       (23, 16, NULL),
       (24, 17, NULL),
       (25, 18, NULL),

       (26, 19, NULL),
       (27, 20, NULL),
       (28, 21, NULL),
       (80, 19, 7),
       (80, 20, 7),
       (80, 21, 7),

       (29, 22, NULL),
       (30, 22, NULL),
       (31, 22, 8),

       (32, 23, NULL),
       (33, 24, NULL),
       (34, 25, NULL),

       (35, 26, NULL),
       (36, 27, NULL),
       (37, 28, NULL),

       (38, 29, NULL),
       (39, 30, NULL),
       (40, 31, NULL),

       (41, 32, NULL),
       (42, 33, NULL),
       (43, 34, NULL),

       (44, 35, NULL),
       (45, 36, NULL),
       (46, 37, NULL),

       (47, 38, NULL),
       (48, 39, NULL),
       (49, 40, NULL),

       (50, 41, NULL),
       (51, 42, NULL),
       (52, 43, NULL),

       (53, 44, NULL),
       (54, 45, NULL),
       (55, 46, NULL),
       (81, 44, 16),
       (81, 45, 16),
       (81, 46, 16),

       (56, 47, NULL),
       (57, 48, NULL),
       (58, 49, NULL),

       (59, 50, NULL),
       (60, 51, NULL),
       (61, 52, NULL),

       (62, 53, NULL),
       (63, 54, NULL),
       (64, 55, NULL),

       (65, 56, NULL),
       (66, 57, NULL),
       (67, 58, NULL),

       (68, 59, NULL),
       (69, 60, NULL),
       (70, 61, NULL),

       (71, 70, NULL),
       (72, 71, NULL),
       (73, 72, NULL),

       (74, 73, 71),
       (74, 74, 71),
       (75, 73, NULL),
       (76, 74, NULL)
ON CONFLICT(task_id, sequencing_experiment_id, case_id) DO NOTHING;
