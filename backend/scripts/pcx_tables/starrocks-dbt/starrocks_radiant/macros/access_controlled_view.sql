{#
    ===========================================================================
    access_controlled_view(source_relation, columns)

    Renders the grant-aware read surface over a radiant_data_dev pcx_30 combined
    view. ONE copy of the security-critical join logic, consumed by all eight
    cbtn_tenant views.

    This exists because the eight hand-written access_controlled_views/*.sql.tmpl
    files carried this scaffold BYTE-IDENTICALLY -- the only per-view variation was
    the projected column list and which columns were PHI-masked. Verified across
    patient_level, medical_therapy, event_level, surgery_level, treatment_summary and
    demographics before consolidating.

    ---------------------------------------------------------------------------
    ACCESS MODEL (per row)
      can_read_phi TRUE  -> patient_id = mrn,         PHI dates shown
      can_read_phi FALSE -> patient_id = research_id,  PHI dates NULL
    Collapsing each identified/de-identified pair into ONE column makes "never show
    the identified and de-identified value together" structurally impossible rather
    than policy-dependent.

    can_read_phi is the OR of TWO grant sources:
      1. ORG grant -- auth.pii_grant.org_code = src.organization_code. The enrolling
         institution.
      2. LAB grant -- auth.pii_lab_patient.patient_id = radiant_patient_id.
         auth.pii_lab_patient is itself DERIVED from auth.pii_grant: it re-reads the
         same org_code as cases.diagnosis_lab_code and returns that lab's probands
         PLUS their family members. So this arm grants PHI on a lab-relationship
         basis and is NOT bounded by src.organization_code -- a lab-granted caller
         can read PHI for that lab's patients at ANY enrolling institution. Verify
         this is the intended policy before deploying.

    patient_id deliberately mixes identifier namespaces across rows when a caller is
    granted some organizations but not others. patient_id_type discriminates per row.

    radiant_patient_id IS DELIBERATELY NOT MASKED -- reviewed and decided 2026-09-30.
    Every one of the eight views projects it as a `plain` column, so an un-granted
    caller receives it alongside research_id. It is therefore the one column that does
    NOT obey the collapse-into-one-column rule above. The decision treats it as a
    non-identifying portal surrogate key. Recorded because it diverges from the three
    analogous identifiers in view_data_dictionary_access_policy.csv (patient_fhir_id,
    subject_reference, observation_id), all of which are "Show for PHI access only"
    and are not projected into the guarded views at all. The residual exposure: the
    key resolves to radiant_jdbc.public.patient, which carries first_name, last_name,
    jhn, date_of_birth and submitter_patient_id -- so it re-links a de-identified row
    for any caller who can also reach that table. Access to the portal catalog is the
    compensating control. To reverse, change its kind from 'plain' to 'phi' in all
    eight column specs and flip the CSV row to PHI-only.

    STALE WARNING NOT CARRIED FORWARD: patient_level_access_controlled.sql:50-54 said
    "the other pcx_30 access-controlled views in this directory implement the ORG
    grant only" and warned that patient_id would disagree across views for a
    lab-granted caller. That was true when written (2026-09-30) but the LAB arm was
    rolled out to the rest on 2026-10-01/10-05. Verified in the live SQL of
    medical_therapy, event_level, surgery_level, treatment_summary and demographics
    before dropping it -- all eight implement both arms, and this macro now
    guarantees they cannot diverge again.

    COLUMN MASKING ONLY -- no row filtering. A caller with zero grants still sees
    every row from every institution, de-identified.

    FAIL-CLOSED, two levels. (1) organization_code comes from a LEFT JOIN on the
    41-row pcx_30_organization_ref seed; a NULL organization_code cannot match
    org_grant.org_code. (2) An MRN that does not resolve to a portal patient leaves
    radiant_patient_id NULL, which cannot match lab_grant.patient_id. Either miss
    degrades the row to the de-identified values rather than leaking.

    MRN JOIN NORMALIZATION. radiant_jdbc.public.patient.submitter_patient_id is
    zero-padded to a fixed width; src.mrn is unpadded (6, 7 or 4 chars for SCH). A raw
    equality join matched 0 of 960 rows -- which silently left radiant_patient_id NULL
    everywhere AND made the LAB grant arm unreachable, so the widened access model
    would have looked like a no-op in testing and then activated later on its own.
    Both sides strip leading zeros, which is width-agnostic in both directions (unlike
    lpad to a hardcoded 8) and leaves non-numeric ids such as SCH's 'R...' series
    intact. Verified against prod: no collisions introduced on either side (29 -> 29
    distinct, 960 -> 960 distinct), no LEFT JOIN fan-out. The <> '' guard keeps an
    all-zeros id from collapsing to empty and cross-matching.

    user_id NOTE: auth.pii_grant.user_id holds portal UUIDs, matched against the
    StarRocks login name via substring_index(substr(current_user(),2),char(39),1). A
    human DBA login holds no grant and always sees the de-identified projection --
    which is also why only the un-granted projection is verifiable without a test
    user that has a pii_grant row.

    TENANT CODE comes from var('tenant_code'), default 'cbtn'. This replaces
    the Go-template render step the .sql / .sql.tmpl pairs existed for:
      dbt run --select tag:access_controlled --vars '{tenant_code: xyz}'

    ---------------------------------------------------------------------------
    COLUMN SPEC -- ordered list of [name, kind] pairs. Order IS the projection order.

      plain     s.<name>
      phi       case when can_read_phi then s.<name> end as <name>
                  (NULL for an un-granted caller)
      phi_deid  case when can_read_phi then s.<name> else s.<name>_deid end as <name>
                  (falls back to the view's _deid variant instead of NULL;
                   demographics only -- given_name, family_name, address_postal_code)
      id_pair   emits BOTH patient_id and patient_id_type from the mrn/research_id
                  pair. `name` is ignored. Exactly one per view.
    ===========================================================================
#}

{% macro access_controlled_view(source_relation, columns) %}

{%- set tenant = var('tenant_code', 'cbtn') -%}
{%- set current_user_expr = "substring_index(substr(current_user(), 2), char(39), 1)" -%}

{%- set id_pair_count = columns | selectattr(1, 'equalto', 'id_pair') | list | length -%}
{%- if id_pair_count != 1 -%}
    {{ exceptions.raise_compiler_error(
        "access_controlled_view: expected exactly one 'id_pair' column, got "
        ~ id_pair_count) }}
{%- endif -%}

select
{%- for c in columns %}
{%- set name = c[0] %}
{%- set kind = c[1] %}
{%- if kind == 'id_pair' %}
    case when s.can_read_phi then s.mrn else s.research_id end as patient_id,
    case when s.can_read_phi then 'mrn' else 'research_id' end as patient_id_type
{%- elif kind == 'phi' %}
    case when s.can_read_phi then s.{{ name }} end as {{ name }}
{%- elif kind == 'phi_deid' %}
    case when s.can_read_phi then s.{{ name }} else s.{{ name }}_deid end as {{ name }}
{%- elif kind == 'plain' %}
    s.{{ name }}
{%- else %}
    {{ exceptions.raise_compiler_error(
        "access_controlled_view: unknown column kind '" ~ kind ~ "' for '" ~ name ~ "'") }}
{%- endif %}
{{- "," if not loop.last }}
{%- endfor %}
from (
    select
        src.*,
        p.id as radiant_patient_id,
        (org_grant.org_code is not null or lab_grant.patient_id is not null) as can_read_phi
    from {{ source_relation }} src
    left join {{ source('portal_jdbc', 'patient') }} p
        on p.tenant_code = '{{ tenant }}'
       and p.organization_code = src.organization_code
       and p.submitter_patient_id_type = 'mrn'
       and regexp_replace(src.mrn, '^0+', '') <> ''
       and regexp_replace(p.submitter_patient_id, '^0+', '')
           = regexp_replace(src.mrn, '^0+', '')
    left join (
        select distinct org_code
        from {{ source('portal_auth', 'pii_grant') }}
        where user_id = {{ current_user_expr }}
          and tenant_code = '{{ tenant }}'
    ) org_grant
        on org_grant.org_code = src.organization_code
    left join (
        select distinct patient_id
        from {{ source('portal_auth', 'pii_lab_patient') }}
        where user_id = {{ current_user_expr }}
          and tenant_code = '{{ tenant }}'
    ) lab_grant
        on lab_grant.patient_id = p.id
) s

{% endmacro %}
