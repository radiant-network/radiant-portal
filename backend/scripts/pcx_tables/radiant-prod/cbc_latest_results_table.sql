/*
   radiant_data_dev.cbc_latest_results  (TABLE)

   Latest CBC result values per patient -- WBC, hemoglobin, platelets, ANC

   Source: radiant_iceberg_catalog.fhir_cbtn_tenant_db
     diagnostic_report           the CBC order/report
     diagnostic_report_result    join table; result_reference = 'Observation/<id>'
     observation                 the individual analyte values
     observation_code_coding     the CODED identity (LOINC) of each observation

   SEMANTICS: returns the latest value for EACH analyte independently, so a
   patient's four values may come from different draws. Each analyte carries its
   own *_observed_at so divergence is visible. Measured on prod: of the 2,196
   patients with all four, 1,782 have them from one draw and 414 do not (~19%).
   If you need all four from one draw, see the variant at the bottom.

   ------------------------------------------------------------------------------
   ANALYTE IDENTIFICATION -- LOINC primary, code_text fallback (both required)
   ------------------------------------------------------------------------------
   LOINC lives in observation_code_coding (system 'http://loinc.org'), NOT on the
   observation row. It is the authoritative matcher because it makes the
   absolute-vs-percentage distinction explicit, which local names do not:
     [#/volume]        absolute count   <- what we want
     /100 leukocytes   percentage       <- must NOT be reported as a count

   Target LOINC codes (profiled from CBC-linked observations on prod 2026-09-28):
     WBC         6690-2  Leukocytes [#/volume] in Blood by Automated count
                26464-8  Leukocytes [#/volume] in Blood
     hemoglobin   718-7  Hemoglobin [Mass/volume] in Blood
     platelets    777-3  Platelets [#/volume] in Blood by Automated count
                26515-7  Platelets [#/volume] in Blood
     ANC          751-8  Neutrophils [#/volume] in Blood by Automated count
                  753-4  Neutrophils [#/volume] in Blood by Manual count
                26499-4  Neutrophils [#/volume] in Blood
   Deliberately EXCLUDED: 770-8 (Neutrophils/100 leukocytes), 769-0 (Segmented
   neutrophils/Leukocytes) -- these are differential percentages.

   WHY code_text IS ALSO MATCHED, not just LOINC: LOINC coverage is incomplete.
   Measured coverage of the target codes over code_text-identified rows:
     hemoglobin 100.0%   platelets 100.0%   WBC 99.8%   ANC 81.5%
   A LOINC-only query would silently drop ~11,600 ANC results. So the predicate is
   a UNION of the two, and loinc_code is returned as NULL when absent.

   The code_text allowlist is an explicit list, not LIKE patterns, because the
   near-misses are actively wrong:
     'Neutrophils'         is the differential PERCENT (unit '%', 49,936 rows)
     'Platelet Estimate'   smear estimate, mostly NULL-valued; likewise
                           'Giant Platelets', 'Mean Platelet Volume', '*Morphology'
     'WBC Morphology' /
     'WBC Abnormality'     qualitative, always NULL-valued
   LIKE '%neutrophil%' would report a percentage as an absolute count.

   The two matchers were cross-validated against each other on prod:
     - LOINC finds only 11 rows the code_text allowlist misses
       ('Abs Neutrophils, Manual' 7, 'White Blood Cell Count (OSH)' 4) -- both are
       now in the allowlist below
     - ZERO code_text-matched rows carry a percentage LOINC, so the allowlist is
       confirmed free of percentage contamination

   ------------------------------------------------------------------------------
   *** UNITS ARE NOT NORMALIZED -- READ BEFORE COMPARING VALUES ***
   ------------------------------------------------------------------------------
   The same analyte is reported in mutually incompatible units by different
   contributing systems, e.g.
     WBC        K/uL, THOU/uL, x10E3/uL, x10E9/L, Thousand/uL, K/mm3
     platelets  10*3/uL, K/uL, THOU/uL, K/mm3, x10E9/L, x10E3/uL, TH/mm3
     ANC        /uL, uL, /mm3, x10E3/uL, THOU/uL, cells/uL, x10E9/L, TH/mm3
   ANC in '/uL' and ANC in 'x10E9/L' differ by 1000x, and BOTH occur. Every value
   is returned WITH its unit, its LOINC code and its source code_text, and no
   conversion is applied -- converting is a clinical decision, not a reporting one.

   ------------------------------------------------------------------------------
   DATE HANDLING
   ------------------------------------------------------------------------------
   Follows the canonical precedence in lib/fhir_date_precedence.py for Observation:
     effective_date_time -> effective_period_start -> issued
   each wrapped in nullif(col,'') as that module does. On prod today all 314,406
   CBC analyte rows have a populated effective_date_time (no nulls, no empty
   strings, no row needs a fallback), so the chain is defensive rather than load-
   bearing -- but note `issued` is an ADMINISTRATIVE date in that module's taxonomy,
   so a value dated from it is a release-time proxy, not a clinical event time.

   FILTERS
     status in ('final','amended')     no entered-in-error rows are linked to CBC
                                       reports today; retained as a guard.
                                       'preliminary' excluded (15 rows).
     value_quantity_value is not null  a latest row with no value is useless, so
                                       these are skipped when picking the latest.

   VERIFIED on prod 2026-09-28
     - no observation links to more than one CBC report, so diagnostic_report_result
       cannot fan out
     - exactly one target LOINC coding per observation (386,188 of 386,188), so the
       observation_code_coding join cannot fan out either
     - zero value_quantity_value fails the numeric cast
     - 2 patient+timestamp pairs carry two distinct WBC values; the tiebreaker
       (amended first, then observation id) makes the result deterministic
     - returns 2,421 patients: 2,421 hemoglobin / 2,371 WBC / 2,371 platelets /
       2,196 ANC, with 2,196 having all four

   ------------------------------------------------------------------------------
   MATERIALIZATION
   ------------------------------------------------------------------------------
   This is a TABLE, i.e. a POINT-IN-TIME SNAPSHOT. The source data is live (latest
   CBC on prod was 2026-09-27), so this table goes stale the moment a new CBC is
   resulted. Re-run this file to refresh. If you want it always-current, make it a
   view instead -- the select body is identical and needs no change.

   CONTAINS PHI: patient_fhir_id plus real calendar *_observed_at timestamps.
   radiant_data_dev is the correct home (the internal PHI schema); do NOT copy this
   into cbtn_tenant unguarded -- see access_controlled_views/ for the grant-aware
   pattern if it ever needs to be exposed.
 */

drop table if exists radiant_data_dev.cbc_latest_results;

create table radiant_data_dev.cbc_latest_results as (
with loinc as (
    -- one row per observation; verified single target coding per observation
    select
        occ.observation_id,
        min(occ.code_coding_code)    as loinc_code,
        min(occ.code_coding_display) as loinc_display
    from radiant_iceberg_catalog.fhir_cbtn_tenant_db.observation_code_coding occ
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
            -- LOINC first: authoritative, distinguishes absolute from percentage
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
        -- canonical Observation date precedence (lib/fhir_date_precedence.py)
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
    from radiant_iceberg_catalog.fhir_cbtn_tenant_db.diagnostic_report dr
    join radiant_iceberg_catalog.fhir_cbtn_tenant_db.diagnostic_report_result drr
        on drr.diagnostic_report_id = dr.id
    join radiant_iceberg_catalog.fhir_cbtn_tenant_db.observation o
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

ranked as (
    select
        cbc_result.*,
        row_number() over (
            partition by patient_fhir_id, analyte
            order by
                observed_at desc,
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

    max(case when analyte = 'wbc' then value_num end)               as wbc_value,
    max(case when analyte = 'wbc' then unit end)                    as wbc_unit,
    max(case when analyte = 'wbc' then observed_at end)             as wbc_observed_at,
    max(case when analyte = 'wbc' then loinc_code end)              as wbc_loinc,
    max(case when analyte = 'wbc' then source_code_text end)        as wbc_source_code_text,

    max(case when analyte = 'hemoglobin' then value_num end)        as hemoglobin_value,
    max(case when analyte = 'hemoglobin' then unit end)             as hemoglobin_unit,
    max(case when analyte = 'hemoglobin' then observed_at end)      as hemoglobin_observed_at,
    max(case when analyte = 'hemoglobin' then loinc_code end)       as hemoglobin_loinc,
    max(case when analyte = 'hemoglobin' then source_code_text end) as hemoglobin_source_code_text,

    max(case when analyte = 'platelets' then value_num end)         as platelets_value,
    max(case when analyte = 'platelets' then unit end)              as platelets_unit,
    max(case when analyte = 'platelets' then observed_at end)       as platelets_observed_at,
    max(case when analyte = 'platelets' then loinc_code end)        as platelets_loinc,
    max(case when analyte = 'platelets' then source_code_text end)  as platelets_source_code_text,

    max(case when analyte = 'anc' then value_num end)               as anc_value,
    max(case when analyte = 'anc' then unit end)                    as anc_unit,
    max(case when analyte = 'anc' then observed_at end)             as anc_observed_at,
    max(case when analyte = 'anc' then loinc_code end)              as anc_loinc,
    max(case when analyte = 'anc' then source_code_text end)        as anc_source_code_text,

    count(*)                                                        as analytes_found,
    sum(case when date_semantic = 'administrative' then 1 else 0 end) as administrative_dates
from ranked
where rn = 1
group by patient_fhir_id
order by patient_fhir_id
);
