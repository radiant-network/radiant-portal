/*
   pcx_30_organization_ref  (TABLE, radiant_data_dev)

   Organization code/name reference for the pcx_30 views.

   WHY THIS IS A SEEDED COPY, NOT A VIEW:
   The canonical source is radiant_jdbc.public.organization, surfaced as
   radiant_tenant.organization. In the QA cluster that returns 41 rows, but in
   PROD the underlying JDBC source holds only 1 row (chusj / CHU Ste-Justine)
   and cbtn_tenant.organization returns 0 rows -- so prod has nothing to join
   to. These 41 rows are therefore seeded from the QA cluster as of 2026-09-24.

   Contents are non-PHI: public institution names and short codes.

   WHEN PROD'S SOURCE IS POPULATED, replace this table with a view:
     create view radiant_data_dev.pcx_30_organization_ref as
       select code, name, category_code, tenant_code from radiant_tenant.organization;
   The dependent pcx_30 views need no change -- they only reference
   pcx_30_organization_ref.name and .code.

   name and code are both unique across all 41 rows (verified), so the
   LEFT JOIN in the pcx_30 views cannot fan out rows.
 */

drop table if exists radiant_data_dev.pcx_30_organization_ref;

create table radiant_data_dev.pcx_30_organization_ref (
  `code`          VARCHAR(64)  COMMENT 'organization short code',
  `name`          VARCHAR(256) COMMENT 'organization display name; join key to pcx_30 organization_name',
  `category_code` VARCHAR(64)  COMMENT 'healthcare_provider | sequencing_center',
  `tenant_code`   VARCHAR(64)  COMMENT 'source tenant filter'
)
ENGINE=OLAP
COMMENT 'Organization code reference, seeded from QA radiant_tenant.organization 2026-09-24'
DISTRIBUTED BY RANDOM;

insert into radiant_data_dev.pcx_30_organization_ref (code, name, category_code, tenant_code)
values
  ('ACH', 'Akron Children''s Hospital', 'healthcare_provider', 'radiant'),
  ('APH', 'Orlando Health Arnold Palmer Hospital', 'healthcare_provider', 'radiant'),
  ('BCH', 'UCSF Benioff Children''s Hospital', 'healthcare_provider', 'radiant'),
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
