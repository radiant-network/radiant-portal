/*
    Invariant test: every value in a cbc_latest_results row came from ONE panel.

    THIS IS THE GUARD AGAINST THE DEFECT THIS MODEL WAS BUILT TO FIX. Before
    2026-10-14 the model ranked each analyte independently
    (`partition by patient_fhir_id, analyte`), so 404 of 2,421 patients (16.7%) had
    values spanning more than one date -- 115 of them more than a YEAR apart, worst
    case 3,861 days -- presented as a single blood count. Nothing structural stopped
    that, and nothing would stop it being reintroduced. This does.

    Passes when it returns ZERO rows. Two failure arms:

      1. VALUE_NOT_IN_PANEL   the row reports a non-null analyte that does NOT exist
                              as a qualifying observation at that row's
                              panel_observed_at -- i.e. the value came from a
                              different draw, which is exactly the old behaviour
      2. ANALYTE_COUNT_WRONG  analytes_found disagrees with the number of non-null
                              analyte values actually projected on the row

    Arm 1 re-derives the qualifying observations from source rather than trusting the
    model, so it is an independent check and not a tautology.

    NOTE this does NOT assert the panel is the patient's LATEST -- that is the
    recency rule, and asserting it here would just restate the model's own ORDER BY.
    What it asserts is COHERENCE: whatever panel was chosen, the whole row came from
    it. Coherence is the property that was broken.
*/

with qualifying as (

    -- the same analyte-bearing observation set the model selects from, re-derived
    select
        substring_index(o.subject_reference, '/', -1) as patient_fhir_id,
        case
            when l.loinc_code in ('6690-2', '26464-8') then 'wbc'
            when l.loinc_code = '718-7'                then 'hemoglobin'
            when l.loinc_code in ('777-3', '26515-7')  then 'platelets'
            when l.loinc_code in ('751-8', '753-4', '26499-4') then 'anc'
            when lower(o.code_text) in (
                'wbc', 'wbc count', 'white blood cell count',
                'white blood cell (wbc) count', 'wbc corrected for nrbc',
                'white blood cell count (osh)'
            ) then 'wbc'
            when lower(o.code_text) in ('hgb', 'hemoglobin') then 'hemoglobin'
            when lower(o.code_text) in ('platelet count', 'platelets') then 'platelets'
            when lower(o.code_text) in (
                'absolute neutrophils', 'absolute neutrophil count',
                'abs neutrophils', 'abs neutrophils (cells/ul)',
                'abs neutrophils, manual', 'abs seg neutrophils',
                'neutrophils absolute', 'neutrophils (absolute)', 'preliminary anc'
            ) then 'anc'
        end as analyte,
        cast(replace(replace(coalesce(
                 nullif(o.effective_date_time, ''),
                 nullif(o.effective_period_start, ''),
                 nullif(o.issued, '')
             ), 'T', ' '), 'Z', '') as datetime) as observed_at
    from {{ source('radiant_fhir', 'diagnostic_report') }} dr
    join {{ source('radiant_fhir', 'diagnostic_report_result') }} drr
        on drr.diagnostic_report_id = dr.id
    join {{ source('radiant_fhir', 'observation') }} o
        on o.id = substring_index(drr.result_reference, '/', -1)
    left join (
        select occ.observation_id, min(occ.code_coding_code) as loinc_code
        from {{ source('radiant_fhir', 'observation_code_coding') }} occ
        where occ.code_coding_system = 'http://loinc.org'
          and occ.code_coding_code in ('6690-2','26464-8','718-7','777-3','26515-7',
                                       '751-8','753-4','26499-4')
        group by occ.observation_id
    ) l on l.observation_id = o.id
    where (lower(dr.code_text) like '%cbc%' or lower(dr.code_text) like '%blood count%')
      and o.value_quantity_value is not null
      and o.status in ('final', 'amended')
),

-- what the model claims, one row per (patient, analyte it reported)
claimed as (
    select patient_fhir_id, panel_observed_at, 'wbc' as analyte
    from {{ ref('cbc_latest_results') }} where wbc_value is not null
    union all
    select patient_fhir_id, panel_observed_at, 'hemoglobin'
    from {{ ref('cbc_latest_results') }} where hemoglobin_value is not null
    union all
    select patient_fhir_id, panel_observed_at, 'platelets'
    from {{ ref('cbc_latest_results') }} where platelets_value is not null
    union all
    select patient_fhir_id, panel_observed_at, 'anc'
    from {{ ref('cbc_latest_results') }} where anc_value is not null
)

-- 1. a reported value that does not exist at the row's own panel timestamp
select
    'VALUE_NOT_IN_PANEL' as issue,
    c.patient_fhir_id,
    c.analyte,
    cast(c.panel_observed_at as varchar(32)) as detail
from claimed c
left join qualifying q
    on  q.patient_fhir_id = c.patient_fhir_id
   and q.analyte          = c.analyte
   and q.observed_at      = c.panel_observed_at
where q.analyte is null

union all

-- 2. analytes_found does not match what the row actually carries
select
    'ANALYTE_COUNT_WRONG' as issue,
    m.patient_fhir_id,
    cast(m.analytes_found as varchar(8)) as analyte,
    cast(
        (case when m.wbc_value        is not null then 1 else 0 end)
      + (case when m.hemoglobin_value is not null then 1 else 0 end)
      + (case when m.platelets_value  is not null then 1 else 0 end)
      + (case when m.anc_value        is not null then 1 else 0 end)
    as varchar(8)) as detail
from {{ ref('cbc_latest_results') }} m
where m.analytes_found <>
      (case when m.wbc_value        is not null then 1 else 0 end)
    + (case when m.hemoglobin_value is not null then 1 else 0 end)
    + (case when m.platelets_value  is not null then 1 else 0 end)
    + (case when m.anc_value        is not null then 1 else 0 end)
