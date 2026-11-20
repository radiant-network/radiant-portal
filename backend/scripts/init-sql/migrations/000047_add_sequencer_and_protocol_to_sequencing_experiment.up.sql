ALTER TABLE public.sequencing_experiment ADD COLUMN IF NOT EXISTS sequencer_id text, ADD COLUMN IF NOT EXISTS protocol text;
