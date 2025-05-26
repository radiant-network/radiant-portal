CREATE TABLE task_has_related_tasks
(
    "task_id"         INTEGER REFERENCES "task" ("id") NOT NULL,
    "related_task_id" INTEGER REFERENCES "task" ("id") NOT NULL,
    PRIMARY KEY ("task_id", "related_task_id")
);