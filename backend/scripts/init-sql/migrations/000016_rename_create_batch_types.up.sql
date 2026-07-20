-- The create batch types are renamed with a 'create_' prefix so they read like their
-- update_* / patch_case siblings ('patient' -> 'create_patient', etc.). Relabel existing
-- rows: the worker dispatches on batch_type (supportedProcessors), so a leftover PENDING
-- row with an old label would be claimed and errored as unsupported after the rename.
UPDATE public.batch SET batch_type = 'create_case' WHERE batch_type = 'case';
UPDATE public.batch SET batch_type = 'create_patient' WHERE batch_type = 'patient';
UPDATE public.batch SET batch_type = 'create_sample' WHERE batch_type = 'sample';
UPDATE public.batch SET batch_type = 'create_sequencing_experiment' WHERE batch_type = 'sequencing_experiment';
