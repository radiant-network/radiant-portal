CREATE TABLE document_has_patients
(
    "document_id" INTEGER REFERENCES "document" ("id") NOT NULL,
    "patient_id"  INTEGER REFERENCES "patient" ("id")  NOT NULL,
    PRIMARY KEY ("document_id", "patient_id")
);