/*
   pcx_30_organization_ref  (TABLE, radiant_data_dev)

   Organization code/name reference for the pcx_30 views.

   SUPERSEDED BY THE dbt SEED -- do not run this unless you are rebuilding by hand.
   The live definition is starrocks-dbt/starrocks_radiant/seeds/pcx_30_organization_ref.csv
   (+ its description block in seeds/_pcx_30__seeds.yml, which carries the full
   rationale). This file begins with a DROP, so running it against a cluster whose
   seed is ahead of it silently REVERTS the table. Kept only as the record of what
   the object is.

   WHY THIS IS A SEEDED COPY, NOT A VIEW:
   The canonical source is radiant_jdbc.public.organization, surfaced as
   radiant_tenant.organization. In the QA cluster that returns 41 rows. When this
   file was written, the underlying JDBC source in PROD held only 1 row (chusj /
   CHU Ste-Justine) and cbtn_tenant.organization returned 0 rows -- so prod had
   nothing to join to. The first 41 rows are therefore seeded from the QA cluster
   as of 2026-09-24.

   Contents are non-PHI: public institution names and short codes.

   PROD'S SOURCE IS NOW POPULATED (51 rows, observed 2026-10-23) AND YOU STILL
   MUST NOT REPLACE THIS WITH A VIEW OVER IT. Earlier text here said to do exactly
   that. Measured on prod 2026-10-23: the join key is
   stg_cbtn_enrollment_final.organization_name, which carries the QA spellings, so
   a view over the canonical table gains NYU Langone Health (9 enrollment rows) and
   LOSES 894 -- CNMC 693, CBTN Non-Consortium Member 142, UAB 36, CHOA 23, because
   the canonical names drop a " (CNMC)" / " (CHOA)" suffix, spell UAB out, and omit
   CNM / PNOC / NA entirely. Those rows would fall to a NULL organization_code,
   which fails CLOSED -- permanently de-identifying those patients even for a
   granted caller, silently. Use the canonical table for CODES, the enrollment
   table for NAMES.

   APOSTROPHE TRAP: the canonical source spells CHLA and Nicklaus with U+2019
   (hex E28099); stg_cbtn_enrollment_final and every row below use the ASCII
   apostrophe (hex 27). The join is exact equality, so a verbatim copy-paste of a
   canonical name matches ZERO rows while looking right on screen.

   2026-10-23: CHLA, NYULH and Nicklaus added (41 -> 44 rows). Codes from the
   canonical prod table -- all three already hold auth.pii_grant rows. Names from
   stg_cbtn_enrollment_final. "Zurich Children's Hospital" (4 enrollment rows, 0 in
   the release cohort) remains unmatched: it has no canonical row and no grant, so
   no code exists for it anywhere.

   name and code are both unique across all 44 rows (verified on prod 2026-10-23),
   so the LEFT JOIN in the pcx_30 views cannot fan out rows.
 */

drop table if exists radiant_data_dev.pcx_30_organization_ref;

create table radiant_data_dev.pcx_30_organization_ref (
  `code`          VARCHAR(64)  COMMENT 'organization short code',
  `name`          VARCHAR(256) COMMENT 'organization display name; join key to pcx_30 organization_name',
  `category_code` VARCHAR(64)  COMMENT 'healthcare_provider | sequencing_center',
  `tenant_code`   VARCHAR(64)  COMMENT 'source tenant filter'
)
ENGINE=OLAP
COMMENT 'Organization code reference; 41 rows seeded from QA radiant_tenant.organization 2026-09-24, + CHLA/NYULH/Nicklaus 2026-10-23'
DISTRIBUTED BY RANDOM;

insert into radiant_data_dev.pcx_30_organization_ref (code, name, category_code, tenant_code)
values
  ('ACH', 'Akron Children''s Hospital', 'healthcare_provider', 'radiant'),
  ('APH', 'Orlando Health Arnold Palmer Hospital', 'healthcare_provider', 'radiant'),
  ('BCH', 'UCSF Benioff Children''s Hospital', 'healthcare_provider', 'radiant'),
  ('CHLA', 'Children''s Hospital Los Angeles', 'healthcare_provider', 'radiant'),
  ('CHOA', 'Children''s Hospital of Atlanta (CHOA)', 'healthcare_provider', 'radiant'),
  ('CHOP', 'The Children''s Hospital of Philadelphia', 'healthcare_provider', 'radiant'),
  ('CNM', 'CBTN Non-Consortium Member', 'healthcare_provider', 'radiant'),
  ('CNMC', 'Children''s National Medical Center (CNMC)', 'healthcare_provider', 'radiant'),
  ('DCH', 'Dayton Children''s Hospital', 'healthcare_provider', 'radiant'),
  ('DGD', 'DGD', 'healthcare_provider', 'radiant'),
  ('HI', 'Hudson Institute', 'healthcare_provider', 'radiant'),
  ('HMH', 'Hackensack', 'healthcare_provider', 'radiant'),
  ('IPCH', 'Intermountain Primary Children''s Hospital', 'healthcare_provider', 'radiant'),
  ('JHACH', 'Johns Hopkins All Children''s Hospital', 'healthcare_provider', 'radiant'),
  ('JHM', 'Johns Hopkins Medicine', 'healthcare_provider', 'radiant'),
  ('LCCC', 'UNC Lineberger Comprehensive Cancer Center', 'healthcare_provider', 'radiant'),
  ('LCH', 'Lurie Children''s Hospital', 'healthcare_provider', 'radiant'),
  ('LPCH', 'Stanford Lucile Packard Children''s Hospital', 'healthcare_provider', 'radiant'),
  ('MCH', 'Meyer Children''s Hospital', 'healthcare_provider', 'radiant'),
  ('MFCH', 'Maria Fareri Children''s Hospital at Westchester Medical Center', 'healthcare_provider', 'radiant'),
  ('MOTT', 'University of Michigan C.S. Mott Children''s Hospital', 'healthcare_provider', 'radiant'),
  ('NA', 'Not Applicable', 'healthcare_provider', 'radiant'),
  ('NYULH', 'NYU Langone Health', 'healthcare_provider', 'radiant'),
  ('Nicklaus', 'Nicklaus Children''s Hospital', 'healthcare_provider', 'radiant'),
  ('O', 'Oligo', 'healthcare_provider', 'radiant'),
  ('OHSU', 'OHSU Doernbecher Children''s Hospital', 'healthcare_provider', 'radiant'),
  ('PNOC', 'PNOC', 'healthcare_provider', 'radiant'),
  ('Pitt', 'University of Pittsburgh', 'healthcare_provider', 'radiant'),
  ('SCH', 'Seattle Children''s Hospital', 'healthcare_provider', 'radiant'),
  ('UAB', 'UAB', 'healthcare_provider', 'radiant'),
  ('UOI', 'University of Iowa', 'healthcare_provider', 'radiant'),
  ('UPenn', 'Penn', 'healthcare_provider', 'radiant'),
  ('WCMC', 'Weill Cornell Medical College', 'healthcare_provider', 'radiant'),
  ('WFBMC', 'Wake Forest Baptist Medical Center', 'healthcare_provider', 'radiant'),
  ('WUISL', 'Washington University in St. Louis', 'healthcare_provider', 'radiant'),
  ('Azenta', 'Azenta', 'sequencing_center', 'radiant'),
  ('Baylor', 'Baylor Genetics', 'sequencing_center', 'radiant'),
  ('Broad', 'Broad Institute', 'sequencing_center', 'radiant'),
  ('CGL', 'Genomic Clinical Core at Sidra Medical and Research Center', 'sequencing_center', 'radiant'),
  ('CSIR', 'CSIR - Institute of Genomics and Integrative Biology, Delhi, India', 'sequencing_center', 'radiant'),
  ('GeneDx', 'GeneDx', 'sequencing_center', 'radiant'),
  ('NantOmics', 'NantOmics', 'sequencing_center', 'radiant'),
  ('Novogene', 'Novogene', 'sequencing_center', 'radiant'),
  ('Variantyx', 'Variantyx', 'sequencing_center', 'radiant');
