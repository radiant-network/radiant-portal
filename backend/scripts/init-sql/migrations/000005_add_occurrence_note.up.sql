CREATE TABLE public.occurrence_note (
    id         uuid         DEFAULT gen_random_uuid() NOT NULL,
    type       varchar(5)   NOT NULL,
    case_id    integer      NOT NULL REFERENCES public.cases(id),
    seq_id     integer      NOT NULL REFERENCES public.sequencing_experiment(id),
    occurrence_id bigint     NOT NULL,
    user_id    uuid         NOT NULL,
    user_name  varchar(255) NOT NULL,
    content    text         NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted    boolean      DEFAULT false NOT NULL,
    PRIMARY KEY (id)
);
