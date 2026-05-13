CREATE TABLE public.variant_flag (
    case_id       integer      NOT NULL REFERENCES public.cases(id),
    occurrence_id text         NOT NULL,
    flag_type     varchar(16)  NOT NULL CHECK (flag_type IN ('flag', 'pin', 'star')),
    user_id       uuid         NOT NULL,
    user_name     varchar(255) NOT NULL,
    created_at    timestamp with time zone DEFAULT now() NOT NULL,
    updated_at    timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (case_id, occurrence_id)
);
