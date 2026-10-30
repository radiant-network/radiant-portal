{{ config(
    materialized='view',
    tags=['cbtn_clinical', 'combined', 'phi']
) }}

-- Read surface over lansky_karnofsky_latest that adds mrn + research_id,
-- organization_name / organization_code (for downstream access control), and
-- age_at_score_days beside the score timestamp.
--
-- CONTAINS PHI: mrn, patient_fhir_id, and a real calendar scored_at side by side
-- with research_id. The grant-guarded surface is ac_v_lansky_karnofsky_latest.
--
-- ORGANIZATION RESOLUTION is NOT interchangeable with the base table's
-- org_short_code -- that is the FHIR vocabulary (chop/seattle/ucsf) while
-- organization_code is the pcx_30 / auth.pii_grant vocabulary (CHOP/SCH/UCSF-BCH). Only
-- 'chop' coincides, so keying access control on org_short_code would fail closed for
-- every non-CHOP patient. Resolves for 1,613 of 1,627 patients: CHOP 1,612, UAB 1.
--
-- *** 14 of 1,627 patients resolve to a NULL organization_code, which can never
-- match a pii_grant row -- so downstream they fail CLOSED, permanently
-- de-identified even for an authorized caller. Safe direction, but silent. ***
--
-- *** THIS COHORT IS EFFECTIVELY CHOP-ONLY: 1,612 of 1,613 resolved are CHOP, one is
-- UAB, ZERO are SCH. The only auth.pii_grant row for tenant 'cbtn' today grants
-- org_code 'SCH', so the tenant view returns a fully de-identified projection for
-- every current grant holder. That is correct behaviour -- do NOT read an
-- all-research_id result as evidence the grant join is broken. ***
--
-- IDENTIFIER JOIN: radiant_patient_mrn_list.patient_id IS the patient FHIR id, so it
-- joins directly to patient_fhir_id. Verified unique, so it cannot fan out. LEFT
-- joined deliberately -- 3 of 1,627 patients have no row there, and an inner join
-- would silently drop them; they surface with NULL mrn/research_id so the gap is
-- visible. Filter on `mrn is not null` for the matched subset.
--
-- *** 47 OF 1,627 PATIENTS HAVE NO USABLE research_id (36 NULL + 8 empty string
-- where an mrn row exists, plus the 3 with no mrn row). Downstream patient_id =
-- research_id for an ungranted caller, so those rows present a NULL/blank patient_id
-- -- de-identified but also unidentifiable, so they join to nothing. Pre-existing
-- upstream gap in radiant_patient_mrn_list, not specific to this domain
-- (v_cbc_latest_results has the same shape: 42 NULL + 9 empty of 2,421).
-- The two gaps COMPOUND on the 14 fail-closed patients: they can never be identified
-- AND have no research_id, so they surface as a score plus an age with no usable
-- identifier of either kind. ***
--
-- *** THE AGE IS DERIVED FROM AN ADMINISTRATIVE DATE. scored_at comes from
-- observation.issued because both clinical date columns are 0% populated for these
-- scales, so age_at_score_days is age-at-result-release, not age-at-assessment. ***
--
-- *** age_at_score_days IS NULL FOR 104 PATIENTS -- exactly those whose scored_at is
-- NULL. Unlike the pcx_30 views, where age_at_*_days is an always-present
-- de-identified counterpart to a gated date, here there is no date to derive it from,
-- so those rows reach the tenant view with NEITHER a date NOR an age. They still
-- carry scale and score. ***
--
-- DOB SOURCE: FHIR patient.birth_date, present for 1,627 of 1,627 and uniformly
-- 'YYYY-MM-DD'. patient.id is unique so the join cannot fan out; LEFT joined anyway
-- so a future missing birth_date yields a NULL age rather than dropping the patient.
-- birth_date itself is NOT projected -- the age is the point, and this keeps one more
-- raw PHI field off the surface.

select
    -- identifier block (identified first, then de-identified)
    c.patient_fhir_id,
    m.mrn,
    m.research_id,
    c.subject_reference,

    -- organization (pcx_30 / auth.pii_grant vocabulary, not org_short_code)
    r.organization_name,
    o.code as organization_code,
    c.org_short_code,

    -- the score
    c.scale,
    c.score,
    c.scored_at,
    datediff(c.scored_at, cast(p.birth_date as date)) as age_at_score_days,
    c.score_text,

    -- provenance
    c.scale_code,
    c.source_code_text,
    c.component_line,
    c.observation_id,
    c.date_semantic
from {{ ref('lansky_karnofsky_latest') }} c
left join {{ ref('radiant_patient_mrn_list') }} m
    on m.patient_id = c.patient_fhir_id
left join {{ source('radiant_fhir', 'patient') }} p
    on p.id = c.patient_fhir_id
left join {{ ref('int_cbtn_organization_by_mrn') }} r
    on r.mrn = m.mrn
left join {{ ref('pcx_30_organization_ref') }} o
    on o.name = r.organization_name
