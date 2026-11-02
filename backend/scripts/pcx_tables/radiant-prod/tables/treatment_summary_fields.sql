/*
   pcx_30_treatment_summary_deid

   Per-patient summary of INITIAL (frontline) treatment: the diagnosis and first-event
   anchors, when radiation / chemotherapy / methotrexate first occurred, whether each
   was part of initial treatment, and the order radiation and chemotherapy were given.

   2026-10-01 rewrite:
     * initial_treatment_order is now RADIATION vs CHEMOTHERAPY (any agent). Methotrexate
       is reduced to a flag (had_initial_methotrexate) plus its first-ever age.
     * The three had_initial_* flags are DERIVED FROM the per-row is_initial_treatment
       column on the treatment tables rather than re-deriving the window here. One
       canonical definition of "initial treatment" now lives in
       pcx_30_{medical_therapy,radiation}_level_deid and this table consumes it, so the
       two cannot drift apart. This also inherits that definition's `>= 0` anchor guard.
     * Fixes a min()-suppression defect: the flags previously tested whether the EARLIEST
       course fell in the window, so a single pre-diagnosis course hid a later course that
       genuinely was frontline. C1254600 is the live case -- diagnosis 1735, first event
       3356, earliest radiation 1713 (22 days BEFORE diagnosis), later in-window course
       present; the old logic reported had_initial_radiation='no' while the per-row flag
       said yes. Filtering on is_initial_treatment='yes' is an "ANY course in the window"
       test and resolves it. Affected 1 radiation + 1 chemo patient at rewrite time.
     * Absence-asserting labels renamed to say INITIAL, because they were read as "never
       treated" when they mean "not treated in the frontline window":
         no_radiation_or_chemo   -> no_initial_radiation_or_chemo
         chemo_only_no_radiation -> chemo_only_no_initial_radiation
         radiation_only_no_chemo -> radiation_only_no_initial_chemo
       The three ordering labels are unchanged -- they assert no absence.

   DEPENDS ON pcx_30_medical_therapy_level_deid and pcx_30_radiation_level_deid having
   been built WITH is_initial_treatment, which in turn depend on pcx_30_event_level_deid.
   Build order: event_level -> {medical_therapy, radiation} -> this.

   TWO AGE SCALES, deliberately both published:
     age_at_first_*_ever_days = first course EVER (unchanged semantics; what the data
                                dictionary has always described -- renamed 2026-10-01
                                from age_at_first_*_days to make "ever" explicit, since
                                "first" was being read as "first of the initial
                                treatment". All three treatment ages carry the _ever_
                                infix; age_at_first_event_days does NOT -- it is a
                                disease event, not a treatment, and is unchanged)
     age_at_initial_*_days    = first course that IS initial treatment (NEW; what the
                                flags and initial_treatment_order are computed from)
   They differ for 1 patient each today, but repurposing the first-ever columns would
   have NULLed 70 radiation and 46 chemo patients whose only treatment falls outside the
   frontline window -- real loss in a published column. Keeping both means
   initial_treatment_order is reproducible from the visible columns, which it was not
   when the order was computed from first-ever ages.

   'no' / absence still CONFLATES "not frontline" with "cannot tell", consistent with
   is_initial_treatment (decided 2026-10-01: document rather than add a third value). Of
   the 243 patients in the old no_radiation_or_chemo bucket: 189 genuinely had no
   radiation or chemotherapy rows, 23 have NO initial-diagnosis anchor so the flag cannot
   be computed at all, and 31 were treated outside the frontline window. The rename
   addresses the 31; the 23 remain an unavailable source reported as an absence.

   NOTE the events CTE deliberately has NO `>= 0` guard: age_at_initial_dx_days and
   age_at_first_event_days are PUBLISHED columns the dictionary documents as using -1 for
   an unknown date, so -1 must pass through. The guard is not needed for correctness here
   because the flags no longer compute a window from these values -- they read
   is_initial_treatment, which is already guarded at source.
 */

drop table if exists radiant_data_dev.pcx_30_treatment_summary_deid;

create table radiant_data_dev.pcx_30_treatment_summary_deid as (
with events as (
    select
        research_id,
        organization_name,
        min(cast(age_at_event_days as int))
            FILTER (WHERE event_type like 'Initial%') as age_at_initial_dx_days,
        min(cast(age_at_event_days as int))
            FILTER (WHERE event_type not in ('Initial CNS Tumor','Unavailable','Not Reported'))
            as age_at_first_event_days
    from radiant_data_dev.pcx_30_event_level_deid
    group by research_id, organization_name
),

rads as (
    select
        research_id,
        min(cast(age_at_radiation_start_days as int)) as first_radiation,
        min(cast(age_at_radiation_start_days as int))
            FILTER (WHERE is_initial_treatment = 'yes') as first_initial_radiation
    from radiant_data_dev.pcx_30_radiation_level_deid
    group by research_id
),

chemo as (
    select
        research_id,
        min(cast(age_at_regimen_start_days as int)) as first_chemo_regimen,
        min(cast(age_at_regimen_start_days as int))
            FILTER (WHERE is_initial_treatment = 'yes') as first_initial_chemo
    from radiant_data_dev.pcx_30_medical_therapy_level_deid
    group by research_id
),

metho as (
    select
        research_id,
        min(cast(age_at_regimen_start_days as int)) as first_methotrexate_regimen,
        min(cast(age_at_regimen_start_days as int))
            FILTER (WHERE is_initial_treatment = 'yes') as first_initial_methotrexate
    from radiant_data_dev.pcx_30_medical_therapy_level_deid med
    where lower(med.chemotherapy_agents) like '%methotrexate%'
    group by research_id
),

initials as (
    select
        events.*,

        -- radiation: first ever, then first that is initial treatment
        rads.first_radiation as age_at_first_radiation_ever_days,
        rads.first_initial_radiation as age_at_initial_radiation_days,

        -- chemotherapy (any agent): first ever, then first that is initial treatment
        chemo.first_chemo_regimen as age_at_first_chemo_ever_days,
        chemo.first_initial_chemo as age_at_initial_chemo_days,

        -- methotrexate: first ever only; initial status is carried by the flag below
        metho.first_methotrexate_regimen as age_at_first_methotrexate_ever_days,

        -- flags read the per-row is_initial_treatment definition ("ANY course in the
        -- frontline window"), never a window re-derived here
        case when rads.first_initial_radiation is not null
            then 'yes' else 'no' end as had_initial_radiation,
        case when chemo.first_initial_chemo is not null
            then 'yes' else 'no' end as had_initial_chemo,
        case when metho.first_initial_methotrexate is not null
            then 'yes' else 'no' end as had_initial_methotrexate

    from events
    left join rads on events.research_id = rads.research_id
    left join chemo on events.research_id = chemo.research_id
    left join metho on events.research_id = metho.research_id
)

select
    initials.*,
    case
        -- both frontline: order them (all three arms are mutually exclusive, so this no
        -- longer relies on fall-through to reach the same-day case)
        when had_initial_radiation = 'yes' and had_initial_chemo = 'yes'
            and age_at_initial_radiation_days < age_at_initial_chemo_days
            then 'radiation_before_chemotherapy'
        when had_initial_radiation = 'yes' and had_initial_chemo = 'yes'
            and age_at_initial_chemo_days < age_at_initial_radiation_days
            then 'chemo_before_radiation'
        when had_initial_radiation = 'yes' and had_initial_chemo = 'yes'
            and age_at_initial_radiation_days = age_at_initial_chemo_days
            then 'radiation_and_chemo_same_day'
        -- exactly one frontline
        when had_initial_radiation = 'no' and had_initial_chemo = 'yes'
            then 'chemo_only_no_initial_radiation'
        when had_initial_radiation = 'yes' and had_initial_chemo = 'no'
            then 'radiation_only_no_initial_chemo'
        -- neither frontline: genuinely untreated, treated only outside the window, or
        -- no diagnosis anchor to judge against (see header)
        else 'no_initial_radiation_or_chemo'
    end as initial_treatment_order
from initials
);
