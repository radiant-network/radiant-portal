INSERT INTO occurrence_note (id, case_id, seq_id, task_id, occurrence_id, user_id, user_name, content)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 1, 1, '1000', '11111111-1111-1111-1111-111111111111', 'John Doe', 'First test note on occurrence 1000'),
       ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, 1, 1, '1000', '22222222-2222-2222-2222-222222222222', 'Jane Smith', 'Second test note on occurrence 1000'),
       ('cccccccc-cccc-cccc-cccc-cccccccccccc', 71, 74, 74, '1000', '11111111-1111-1111-1111-111111111111', 'John Doe', 'First test note on somatic occurrence 1000'),
       ('dddddddd-dddd-dddd-dddd-dddddddddddd', 71, 74, 74, '1000', '22222222-2222-2222-2222-222222222222', 'Jane Smith', 'Second test note on somatic occurrence 1000'),
       ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 1, 1, 1, '1', '11111111-1111-1111-1111-111111111111', 'John Doe', 'First test note on CNV occurrence 1'),
       ('ffffffff-ffff-ffff-ffff-ffffffffffff', 1, 1, 1, '1', '22222222-2222-2222-2222-222222222222', 'Jane Smith', 'Second test note on CNV occurrence 1')
ON CONFLICT (id) DO NOTHING;