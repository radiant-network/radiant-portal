-- Which portal users are responsible for reviewing and interpreting a case (SJRA-306). A case
-- may have zero, one or several assignees, and a user may hold any number of cases.
--
-- A pure junction on purpose: no assigned_by / assigned_on and no _history twin. Who assigned
-- whom, and when, is an audit-log concern and is out of scope here.
--
-- No foreign key ties an assignment to a grant. An assignment survives its assignee losing
-- access at the case's diagnosis lab -- it stays recorded and displayed, and only the list of
-- candidates offered for a new assignment is filtered by eligibility.
--
-- tenant_code is redundant with the case it points at, and carried anyway for the same reason as
-- the other tenant-scoped clinical tables (migration 000013): it is what the per-tenant StarRocks
-- view filters on, so the read path never has to join back to cases to isolate a tenant.

CREATE TABLE public.case_assignment (
    case_id     integer      NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    user_id     varchar(255) NOT NULL REFERENCES public.users(user_id),
    tenant_code varchar(50)  NOT NULL REFERENCES public.tenant(code),
    PRIMARY KEY (case_id, user_id)
);

-- The primary key already serves lookups by case. user_id backs the reverse direction, which is
-- what filtering the cases table by assignee reads.
CREATE INDEX ix_case_assignment_tenant_code ON public.case_assignment (tenant_code);
CREATE INDEX ix_case_assignment_user_id ON public.case_assignment (user_id);
