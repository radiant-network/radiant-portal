INSERT INTO batch (batch_type, status, username, dry_run, created_on, started_on, finished_on, payload) VALUES
('patient', 'SUCCESS', 'user1', false,'2025-01-01', '2025-01-01', '2025-01-01', '{"key1": "value1", "key2": "value2"}'),
('patient', 'RUNNING', 'user2', true, '2025-01-01', '2025-01-01', NULL, '{"keyA": "valueA", "keyB": "valueB"}'),
('patient', 'ERROR', 'user2', true, '2025-01-01', '2025-01-01', '2025-01-01', '{"keyA": "valueA", "keyB": "valueB"}');
