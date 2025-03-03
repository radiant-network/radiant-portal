CREATE TABLE user_set (
                          id uuid DEFAULT uuid_generate_v4() NOT NULL,
                          user_id VARCHAR(255) NOT NULL,
                          name TEXT NOT NULL,
                          type TEXT NOT NULL,
                          active BOOLEAN NOT NULL,
                          created_at TIMESTAMPTZ DEFAULT NOW(),
                          updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE user_set ADD PRIMARY KEY (id);

CREATE TABLE user_set_participant (
    user_set_id uuid NOT NULL,
    participant_id VARCHAR(255) NOT NULL
);
ALTER TABLE user_set_participant ADD PRIMARY KEY (user_set_id, participant_id);
ALTER TABLE user_set_participant
    ADD CONSTRAINT fk_user_set_participant_user_set
        FOREIGN KEY (user_set_id)
            REFERENCES user_set (id);

CREATE TABLE user_set_file (
     user_set_id uuid NOT NULL,
     file_id VARCHAR(255) NOT NULL
);
ALTER TABLE user_set_file ADD PRIMARY KEY (user_set_id, file_id);
ALTER TABLE user_set_file
    ADD CONSTRAINT fk_user_set_file_user_set
        FOREIGN KEY (user_set_id)
            REFERENCES user_set (id);

CREATE TABLE user_set_biospecimen (
    user_set_id uuid NOT NULL,
    biospecimen_id VARCHAR(255) NOT NULL
);
ALTER TABLE user_set_biospecimen ADD PRIMARY KEY (user_set_id, biospecimen_id);
ALTER TABLE user_set_biospecimen
    ADD CONSTRAINT fk_user_set_biospecimen_user_set
        FOREIGN KEY (user_set_id)
            REFERENCES user_set (id);

CREATE TABLE user_set_variant (
     user_set_id uuid NOT NULL,
     variant_id VARCHAR(255) NOT NULL
);
ALTER TABLE user_set_variant ADD PRIMARY KEY (user_set_id, variant_id);
ALTER TABLE user_set_variant
    ADD CONSTRAINT fk_user_set_variant_user_set
        FOREIGN KEY (user_set_id)
            REFERENCES user_set (id);