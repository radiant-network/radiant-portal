CREATE TABLE public.occurrence_flag (
    case_id       integer      NOT NULL REFERENCES public.cases(id),
    occurrence_id varchar(255) NOT NULL,
    seq_id        integer      NOT NULL REFERENCES public.sequencing_experiment(id),
    task_id       integer      NOT NULL REFERENCES public.task(id),
    flag_type     varchar(16)  NOT NULL CHECK (flag_type IN ('flag', 'pin', 'star')),
    PRIMARY KEY (case_id, occurrence_id, seq_id, task_id)
);
