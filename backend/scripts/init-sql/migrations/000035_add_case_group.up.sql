-- A case group is a named set of cases, the unit the pipeline notifies laboratories about
-- (one per post-processing run). case_ids is comma-joined text, the same convention as
-- interpretation_germline.classification_criterias: no junction table, no FK to cases,
-- existence is validated by the API on write. Not federated to StarRocks.
CREATE TABLE public.case_group (
    tenant_code varchar(50) NOT NULL REFERENCES public.tenant(code),
    name        text        NOT NULL,
    case_ids    text        NOT NULL,
    created_on  timestamptz NOT NULL DEFAULT now(),
    created_by  text,
    PRIMARY KEY (tenant_code, name)
);
