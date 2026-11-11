-- Reverts the `draft` half of 000030: the Case Status Switcher analysis retired it along with
-- `unknown` and `incomplete`, but the case creation form needs a status for a case a user has
-- started and not yet submitted. `unknown` and `incomplete` stay retired.

INSERT INTO public.status (code, name_en) VALUES
    ('draft', 'Draft')
ON CONFLICT (code) DO NOTHING;
