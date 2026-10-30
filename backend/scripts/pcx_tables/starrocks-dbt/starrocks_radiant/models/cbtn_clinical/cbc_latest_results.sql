{{ config(
    materialized='table',
    tags=['cbtn_clinical', 'base', 'phi']
) }}

-- Latest CBC PANEL per patient: WBC, hemoglobin, platelets, ANC.
--
-- ONE ROW PER PATIENT, and every value in that row comes from the SAME PANEL --
-- one draw, one timestamp, carried once as panel_observed_at.
--
-- CHANGED 2026-10-14. This model previously resolved each analyte's latest value
-- INDEPENDENTLY (`partition by patient_fhir_id, analyte`), so a row could splice
-- results from different draws. Measured before the fix: 404 of 2,421 patients
-- (16.7%) had values spanning more than one date, 211 of those more than 90 days
-- apart, and 115 more than a YEAR apart -- worst case 3,861 days (~10.6 years)
-- presented as a single blood count. The table was documented and consumed as the
-- latest panel, so the behaviour was the defect, not the contract.
--
-- COST OF THE FIX, measured and accepted. Row count is unchanged (2,421 -- no
-- patient loses their row), but ~401 patients lose a non-null anc_value, because
-- the differential is usually a SEPARATE report from the CBC. That is the defect
-- being removed rather than a regression: of those 401, none were same-day, 211
-- were more than 90 days from the rest of the panel and 115 more than a year.
-- Roughly 80 patients lose an ANC that was within a week of their panel -- the
-- genuine cost.
--
-- ANC IS STRICTLY NULL when the latest panel does not contain it. There is no
-- fill-forward from an earlier draw, by design: a row means one panel or nothing.
--
-- REJECTED ALTERNATIVE: "latest COMPLETE 4-analyte panel". It trades recency far
-- too hard -- it would walk back more than a year for 117 patients (worst 3,861
-- days) and fails outright for the 225 who have never had a 4-analyte panel.
--
-- ANALYTE IDENTIFICATION -- LOINC first, then a code_text allowlist. LOINC is
-- authoritative and distinguishes an ABSOLUTE neutrophil count from a PERCENTAGE;
-- the code_text fallback exists because ~18.5% of ANC rows (and 0.2% of WBC) carry
-- no LOINC at all. 
--
-- NOT UNIT-NORMALIZED. ANC appears as both '/uL' and 'x10E9/L', which differ by
-- 1000x. Whatever units are recorded in the original resource are shown here.
--
-- DATE PRECEDENCE: the canonical Observation order (effective_date_time ->
-- effective_period_start -> issued), with date_semantic recording whether the
-- resulting timestamp was clinical or administrative. date_semantic is now a single
-- value per row rather than the old administrative_dates 0-4 counter, because it is
-- uniform within a panel (verified: 85,098 of 85,098 reports carry one value).
--
-- panel_observed_at IS UTC -- the trailing 'Z' is stripped, not converted. A
-- late-evening UTC timestamp can fall on the prior local calendar day at a US site.
--
-- STATUS FILTER: only 'final' and 'amended' rows are admitted, and on a same-
-- timestamp tie an 'amended' row outranks a 'final' one, so a corrected result wins
-- over the value it corrected.
--
-- CONTAINS PHI: patient_fhir_id plus real calendar *_observed_at timestamps. 

with loinc as (
    -- one row per observation
    select
        occ.observation_id,
        min(occ.code_coding_code)    as loinc_code,
        min(occ.code_coding_display) as loinc_display
    from {{ source('radiant_fhir', 'observation_code_coding') }} occ
    where occ.code_coding_system = 'http://loinc.org'
      and occ.code_coding_code in (
          '6690-2', '26464-8',            -- WBC
          '718-7',                        -- hemoglobin
          '777-3', '26515-7',             -- platelets
          '751-8', '753-4', '26499-4'     -- ANC
      )
    group by occ.observation_id
),

cbc_result as (
    select
        o.subject_reference,
        substring_index(o.subject_reference, '/', -1) as patient_fhir_id,
        case
            -- LOINC first
            when l.loinc_code in ('6690-2', '26464-8') then 'wbc'
            when l.loinc_code = '718-7'                then 'hemoglobin'
            when l.loinc_code in ('777-3', '26515-7')  then 'platelets'
            when l.loinc_code in ('751-8', '753-4', '26499-4') then 'anc'
            -- fallback for the ~18.5% of ANC (and 0.2% of WBC) with no LOINC
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
        end                                          as analyte,
        o.id                                         as observation_id,
        l.loinc_code,
        l.loinc_display,
        o.code_text                                  as source_code_text,
        cast(o.value_quantity_value as double)       as value_num,
        o.value_quantity_unit                        as unit,
        -- canonical Observation date precedence
        cast(replace(replace(coalesce(
                 nullif(o.effective_date_time, ''),
                 nullif(o.effective_period_start, ''),
                 nullif(o.issued, '')
             ), 'T', ' '), 'Z', '') as datetime)     as observed_at,
        case when nullif(o.effective_date_time, '') is null
              and nullif(o.effective_period_start, '') is null
             then 'administrative' else 'clinical' end as date_semantic,
        o.status                                     as observation_status,
        dr.id                                        as diagnostic_report_id,
        dr.code_text                                 as report_code_text,
        o.org_short_code
    from {{ source('radiant_fhir', 'diagnostic_report') }} dr
    join {{ source('radiant_fhir', 'diagnostic_report_result') }} drr
        on drr.diagnostic_report_id = dr.id
    join {{ source('radiant_fhir', 'observation') }} o
        on o.id = substring_index(drr.result_reference, '/', -1)
    left join loinc l
        on l.observation_id = o.id
    where
        (lower(dr.code_text) like '%cbc%' or lower(dr.code_text) like '%blood count%')
        and (
            l.loinc_code is not null
            or lower(o.code_text) in (
                'wbc', 'wbc count', 'white blood cell count',
                'white blood cell (wbc) count', 'wbc corrected for nrbc',
                'white blood cell count (osh)',
                'hgb', 'hemoglobin',
                'platelet count', 'platelets',
                'absolute neutrophils', 'absolute neutrophil count',
                'abs neutrophils', 'abs neutrophils (cells/ul)',
                'abs neutrophils, manual', 'abs seg neutrophils',
                'neutrophils absolute', 'neutrophils (absolute)', 'preliminary anc'
            )
        )
        and o.value_quantity_value is not null
        and o.status in ('final', 'amended')
),

-- ---------------------------------------------------------------------------
-- PANEL SELECTION -- two levels, both load-bearing.
-- ---------------------------------------------------------------------------

-- LEVEL 1: pick the patient's LATEST PANEL.
--
-- Partitioned on (patient_fhir_id, observed_at), NOT on diagnostic_report_id.
-- Verified against prod: a report NEVER spans more than one observed_at
-- (85,098 of 85,098), so report and instant are the SAME grain -- except for 2
-- patients whose latest instant carries two reports (a CBC and its differential
-- from one draw). Partitioning on the timestamp unions those correctly; keying on
-- report_id would discard one report's analytes. Both of those patients have all
-- four analytes across their two reports, so this is the stricter reading of
-- "one draw", not a loosening of it.
-- Both ranks are computed in ONE pass over cbc_result. An earlier version used a
-- separate `panel` CTE joined back to cbc_result; that referenced cbc_result twice,
-- which makes StarRocks re-plan the CTE and reproducibly trip an optimizer bug
-- ("only found column statistics ... missing statistic of col: result_reference").
-- Single-pass window functions avoid the self-reference entirely and are simpler.
--
-- dense_rank, NOT row_number, for the panel: ties on observed_at must ALL survive,
-- because that is how a CBC and its differential from one draw stay together.
--
-- LEVEL 2 (rn) IS LOAD-BEARING, NOT DEFENSIVE. 153 (report, analyte) pairs hold two
-- observations and 1 of them mixes 'final' with 'amended'. Without this rank the
-- max(case when analyte = ...) pivot below would return the larger NUMBER rather
-- than the CORRECTED result. The pre-panel version of this model was accidentally
-- safe only because its per-analyte rank had already collapsed each analyte to one
-- row; re-scoping to the panel reintroduces the hazard.
within_panel as (
    select
        cbc_result.*,
        dense_rank() over (
            partition by patient_fhir_id
            order by observed_at desc
        ) as panel_rn,
        row_number() over (
            partition by patient_fhir_id, observed_at, analyte
            order by
                case when observation_status = 'amended' then 0 else 1 end,
                observation_id
        ) as rn
    from cbc_result
    where analyte is not null
)

select
    patient_fhir_id,
    min(subject_reference)                                          as subject_reference,
    max(org_short_code)                                             as org_short_code,

    -- ONE timestamp for the whole row: every value below came from this panel
    observed_at                                                     as panel_observed_at,
    -- uniform within a panel (verified: 85,098 of 85,098 reports carry a single
    -- date_semantic), which is why the old 0-4 administrative_dates counter
    -- collapses losslessly to one value here
    min(date_semantic)                                              as date_semantic,
    min(diagnostic_report_id)                                       as diagnostic_report_id,

    max(case when analyte = 'wbc' then value_num end)               as wbc_value,
    max(case when analyte = 'wbc' then unit end)                    as wbc_unit,
    max(case when analyte = 'wbc' then loinc_code end)              as wbc_loinc,
    max(case when analyte = 'wbc' then source_code_text end)        as wbc_source_code_text,

    max(case when analyte = 'hemoglobin' then value_num end)        as hemoglobin_value,
    max(case when analyte = 'hemoglobin' then unit end)             as hemoglobin_unit,
    max(case when analyte = 'hemoglobin' then loinc_code end)       as hemoglobin_loinc,
    max(case when analyte = 'hemoglobin' then source_code_text end) as hemoglobin_source_code_text,

    max(case when analyte = 'platelets' then value_num end)         as platelets_value,
    max(case when analyte = 'platelets' then unit end)              as platelets_unit,
    max(case when analyte = 'platelets' then loinc_code end)        as platelets_loinc,
    max(case when analyte = 'platelets' then source_code_text end)  as platelets_source_code_text,

    max(case when analyte = 'anc' then value_num end)               as anc_value,
    max(case when analyte = 'anc' then unit end)                    as anc_unit,
    max(case when analyte = 'anc' then loinc_code end)              as anc_loinc,
    max(case when analyte = 'anc' then source_code_text end)        as anc_source_code_text,

    -- how many of the four analytes THIS PANEL carried (1-4). Narrower than the
    -- pre-panel meaning, which was "how many analytes the patient has anywhere".
    count(*)                                                        as analytes_found
from within_panel
where panel_rn = 1
  and rn = 1
group by patient_fhir_id, observed_at
