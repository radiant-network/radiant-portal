CREATE TABLE task_has_sequencing_experiments
(
    "task_id"                  INTEGER REFERENCES "task" ("id")                  NOT NULL,
    "sequencing_experiment_id" INTEGER REFERENCES "sequencing_experiment" ("id") NOT NULL,
    PRIMARY KEY ("task_id", "sequencing_experiment_id")
);