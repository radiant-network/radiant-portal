-- Users keyed by user_id (the Keycloak `sub`, a uuid). Email/first_name/last_name are
-- optional attributes; the email keeps each row recognizable.
INSERT INTO users (user_id, email, first_name, last_name)
VALUES ('25286548-fbef-4e93-b3c4-c659e6169396', 'alice@test.authz', 'Alice', 'Adams'),
       ('79a8855e-3782-4dc8-be2a-8afdb34d6359', 'wendy@test.authz', 'Wendy', 'Walsh'),
       ('e10fee0b-063b-4dcd-b086-90d1c9eb239d', 'dan@test.authz',   'Dan',   'Doyle'),
       ('b6e6d0dd-7aa5-4018-ae03-1f5076801360', 'carol@test.authz', 'Carol', 'Cohen'),
       ('6c330322-c746-4436-bb76-efd2cd943686', 'pat@test.authz',   'Pat',   'Patel'),
       ('4a330f72-24a1-4d37-8ad7-ff9989245fd3', 'tw@test.authz',    'Tess',  'West'),
       ('9f1d2c3b-4a5e-4f60-8c71-2d3e4f5a6b7c', 'mike@test.authz',  'Mike',  'Miller'),
       ('0a1b2c3d-4e5f-4061-8273-849506a7b8c9', 'gabe@test.authz',  'Gabe',  'Green')
ON CONFLICT (user_id) DO NOTHING;
