INSERT INTO users (email)
VALUES ('alice@test.authz'),
       ('wendy@test.authz'),
       ('dan@test.authz'),
       ('carol@test.authz'),
       ('pat@test.authz'),
       ('tw@test.authz')
ON CONFLICT (email) DO NOTHING;
