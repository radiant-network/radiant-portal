CREATE TABLE task_has_documents
(
    "task_id"     INTEGER REFERENCES "task" ("id")     NOT NULL,
    "document_id" INTEGER REFERENCES "document" ("id") NOT NULL,
    PRIMARY KEY ("task_id", "document_id")
);