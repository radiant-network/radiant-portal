INSERT INTO "task_has_sequencing_experiment" (task_id,
                                              sequencing_experiment_id)
VALUES (1, 1),
       (1, 2),
       (1, 3),
       (2, 4),
       (2, 5),
       (2, 6),
       (3, 7),
       (3, 8),
       (3, 9),
       (4, 10),
       (4, 11),
       (4, 12),
       (5, 13),
       (5, 14),
       (5, 15),
       (6, 16),
       (6, 17),
       (6, 18),
       (7, 19),
       (7, 20),
       (7, 21),
       (8, 22),
       (9, 23),
       (9, 24),
       (9, 25),
       (10, 26),
       (10, 27),
       (10, 28),
       (11, 29),
       (11, 30),
       (11, 31),
       (12, 32),
       (12, 33),
       (12, 34),
       (13, 35),
       (13, 36),
       (13, 37),
       (14, 38),
       (14, 39),
       (14, 40),
       (15, 41),
       (15, 42),
       (15, 43),
       (16, 44),
       (16, 45),
       (16, 46),
       (17, 47),
       (17, 48),
       (17, 49),
       (18, 50),
       (18, 51),
       (18, 52),
       (19, 53),
       (19, 54),
       (19, 55),
       (20, 56),
       (20, 57),
       (20, 58),
       (21, 59),
       (21, 60),
       (21, 61),
       (62, 2),
       (63, 2)
ON CONFLICT(task_id, sequencing_experiment_id) DO NOTHING;