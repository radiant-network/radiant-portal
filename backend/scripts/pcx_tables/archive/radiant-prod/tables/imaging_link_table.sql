/*
   radiant_data_dev.pcx_30_imaging_link  (TABLE)  -- DEMO-ONLY, Nov 2026

   Curated per-session links for v_pcx_30_mri_images_combined. flywheel_url OVERRIDES
   the link that view otherwise derives; clinical_report_url is new. Sibling of
   pcx_30_pnoc035_brim_url and pcx_30_surgery_brim_url -- read the pnoc035 header for
   the shared reasoning.

   THE DDL IS VERSIONED HERE; THE ROWS ARE NOT -- a URL in this PUBLIC repo is not
   retractable. IF NOT EXISTS, and never a dbt model. Populate out of band:
     insert into radiant_data_dev.pcx_30_imaging_link
       (session_id, flywheel_url, clinical_report_url, note, loaded_at)
       values (?, ?, ?, ?, now());

   Both columns project `plain`, like flywheel_url: a link is a pointer and Flywheel
   needs its own auth. A URL embedding a patient identifier does NOT belong here --
   gate it `phi`, as brim_url is on the surgery and PNOC035 views.

   A curated URL may name a DIFFERENT Flywheel project than the session's own
   flywheel_project_id. Expected, not a defect (confirmed 2026-11-06: a demo project
   holding a new image format for a Medullo_v2 session), so do not validate one by
   matching project ids.

   PRIMARY KEY, unlike the two siblings: session_id is genuinely unique (47,167 view
   rows / 47,167 ids, 2026-11-06), and it is the only mode where UPDATE/DELETE work --
   these are hand-typed URLs. Same reasoning as pcx_30_patient_key.

   Teardown: revert the view changes, drop this table.
*/

CREATE TABLE IF NOT EXISTS radiant_data_dev.pcx_30_imaging_link (
  `session_id`          varchar(256)  NOT NULL COMMENT "Flywheel session id; unique join key to v_pcx_30_mri_images_combined.session_id",
  `flywheel_url`        varchar(1024) NULL COMMENT "Overrides the view's derived Flywheel deep link for this session; NULL leaves the derived value in place",
  `clinical_report_url` varchar(1024) NULL COMMENT "Link to this session's clinical report, surfaced as its own view column",
  `note`                varchar(512)  NULL COMMENT "why this session has curated links",
  `loaded_at`           datetime      NULL COMMENT "when the row was curated"
) ENGINE=OLAP
PRIMARY KEY(`session_id`)
COMMENT "Curated per-session imaging links. DDL is versioned; rows are operator-populated and must never be committed. Demo-only, Nov 2026."
DISTRIBUTED BY HASH(`session_id`) BUCKETS 1
PROPERTIES ("replication_num" = "1");
