/* pcx_30_patient_key: the random key of each PCX patient, used in the portal's patient URLs.

   One key per (organization_code, mrn), the same for every user, so a link can be shared. The table sits in the
   source database, next to the identified tables, and is never granted to users; they read it through the secured
   view <tenant>_tenant.v_pcx_30_patient_key.

   Filling it, after each load of the source tables: add a key for every patient that has none, never change an
   existing one (links must keep working). A key must be unguessable, so generate it outside StarRocks with a
   cryptographic random source, e.g. Python's uuid.uuid4(): StarRocks' uuid() is a time and counter value (one key
   gives away its neighbours) and rand() is not cryptographic. Never derive it from an identifier: a hash of an MRN
   can be brute-forced. scripts/seed/build_seed.py shows the pattern: candidate keys in a work table, then an
   insert of the missing ones.

   Written with PRD's source database name; the seed renders it. */
CREATE TABLE IF NOT EXISTS radiant_data_dev.pcx_30_patient_key (
    organization_code VARCHAR(64)  NOT NULL,
    mrn               VARCHAR(256) NOT NULL,
    patient_key       VARCHAR(36)  NOT NULL
)
PRIMARY KEY (organization_code, mrn)
DISTRIBUTED BY HASH (organization_code, mrn) BUCKETS 1
PROPERTIES ("replication_num" = "1");
