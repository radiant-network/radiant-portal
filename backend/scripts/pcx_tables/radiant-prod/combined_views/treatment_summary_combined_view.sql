/*
   v_pcx_30_treatment_summary_combined

   Combined identified + de-identified initial-treatment summary in ONE relation.

   CONTAINS PHI (mrn + calendar dates alongside research_id). Internal use only.

   Unlike the other six, pcx_30_treatment_summary_deid has NO identified
   counterpart -- it is built entirely from the deid tables and holds only ages.
   This view therefore adds the identified side: mrn beside research_id, and a
   calendar-date counterpart for each age-in-days measure.

   It sources the three *_combined views rather than the *_deid tables, because
   those already carry both the calendar date and the age in days for every row.
   That means no dob arithmetic is repeated here and the paired columns cannot
   drift from the upstream views.

   DEPENDENCY ORDER: create v_pcx_30_event_level_combined,
   v_pcx_30_radiation_level_combined and v_pcx_30_medical_therapy_level_combined
   BEFORE this view. Those two treatment views must carry is_initial_treatment.

   2026-10-01 rewrite, mirroring pcx_30_treatment_summary_deid:
     * initial_treatment_order is RADIATION vs CHEMOTHERAPY (any agent); methotrexate
       is reduced to a flag plus its first-ever age/date.
     * The had_initial_* flags are DERIVED FROM the upstream is_initial_treatment
       column, not from a window re-derived here. One canonical definition of
       "initial treatment" lives in the treatment views and this view consumes it.
       This also fixes the min()-suppression defect where a single pre-diagnosis
       course hid a later genuinely-frontline one (live case C1254600).
     * Absence-asserting labels renamed to say INITIAL:
         no_radiation_or_chemo   -> no_initial_radiation_or_chemo
         chemo_only_no_radiation -> chemo_only_no_initial_radiation
         radiation_only_no_chemo -> radiation_only_no_initial_chemo
     * The three treatment age/date measures gained an _ever_ infix to make it
       explicit they are first-EVER, not first-of-initial-treatment. The disease-event
       measures (initial_dx / first_event) did NOT -- they are not treatments.

   Field pairing rule: identical columns appear once; differing columns appear
   twice, adjacent, identified value first.
   mrn                          / research_id
   initial_dx_date              / age_at_initial_dx_days
   first_event_date             / age_at_first_event_days
   first_radiation_ever_date    / age_at_first_radiation_ever_days
   initial_radiation_date       / age_at_initial_radiation_days
   first_chemo_ever_date        / age_at_first_chemo_ever_days
   initial_chemo_date           / age_at_initial_chemo_days
   first_methotrexate_ever_date / age_at_first_methotrexate_ever_days

   TWO AGE SCALES, both published: *_ever_* is the first course ever (never NULLed by
   the frontline window -- 70 radiation and 46 chemo patients are treated ONLY outside
   it), while age_at_initial_* is the first course that IS initial treatment and is what
   the flags and initial_treatment_order are computed from. Keeping both means
   initial_treatment_order is reproducible from the visible columns.

   'no' / absence CONFLATES "not frontline" with "cannot tell", consistent with
   is_initial_treatment: it absorbs patients treated outside the window (addressed by
   the rename) and patients with no initial-diagnosis anchor at all, for whom the flag
   cannot be computed (23 patients).

   The events CTE deliberately has NO `>= 0` anchor guard: age_at_initial_dx_days and
   age_at_first_event_days are published columns documented as using -1 for an unknown
   date, so -1 must pass through. The guard is unnecessary here because the flags no
   longer derive a window from these values -- they read is_initial_treatment, which is
   already guarded at source.
 */

drop view if exists radiant_data_dev.v_pcx_30_treatment_summary_combined;

create view radiant_data_dev.v_pcx_30_treatment_summary_combined as (
    with events as (
        select
            research_id,
            mrn,
            organization_name,
            organization_code,
            min(cast(age_at_event_days as int)) FILTER (WHERE event_type like 'Initial%') as age_at_initial_dx_days,
            min(cast(age_at_event_days as int)) FILTER (WHERE event_type not in ('Initial CNS Tumor','Unavailable','Not Reported')) as age_at_first_event_days,
            min(event_date) FILTER (WHERE event_type like 'Initial%') as initial_dx_date,
            min(event_date) FILTER (WHERE event_type not in ('Initial CNS Tumor','Unavailable','Not Reported')) as first_event_date
        from radiant_data_dev.v_pcx_30_event_level_combined
        group by research_id, mrn, organization_name, organization_code
    ),

    rads as (
        select
            research_id,
            min(cast(age_at_radiation_start_days as int)) as first_radiation_ever,
            min(radiation_start_date) as first_radiation_ever_dt,
            min(cast(age_at_radiation_start_days as int))
                FILTER (WHERE is_initial_treatment = 'yes') as first_initial_radiation,
            min(radiation_start_date)
                FILTER (WHERE is_initial_treatment = 'yes') as first_initial_radiation_dt
        from radiant_data_dev.v_pcx_30_radiation_level_combined
        group by research_id
    ),

    chemo as (
        select
            research_id,
            min(cast(age_at_regimen_start_days as int)) as first_chemo_ever,
            min(regimen_start_date) as first_chemo_ever_dt,
            min(cast(age_at_regimen_start_days as int))
                FILTER (WHERE is_initial_treatment = 'yes') as first_initial_chemo,
            min(regimen_start_date)
                FILTER (WHERE is_initial_treatment = 'yes') as first_initial_chemo_dt
        from radiant_data_dev.v_pcx_30_medical_therapy_level_combined
        group by research_id
    ),

    metho as (
        select
            research_id,
            min(cast(age_at_regimen_start_days as int)) as first_methotrexate_ever,
            min(regimen_start_date) as first_methotrexate_ever_dt,
            min(cast(age_at_regimen_start_days as int))
                FILTER (WHERE is_initial_treatment = 'yes') as first_initial_methotrexate
        from radiant_data_dev.v_pcx_30_medical_therapy_level_combined med
        where lower(med.chemotherapy_agents) like '%methotrexate%'
        group by research_id
    ),

    initials as (
        select
            events.research_id,
            events.mrn,
            events.organization_name,
            events.organization_code,
            events.initial_dx_date,
            events.age_at_initial_dx_days,
            events.first_event_date,
            events.age_at_first_event_days,

            rads.first_radiation_ever_dt as first_radiation_ever_date,
            rads.first_radiation_ever as age_at_first_radiation_ever_days,
            rads.first_initial_radiation_dt as initial_radiation_date,
            rads.first_initial_radiation as age_at_initial_radiation_days,

            chemo.first_chemo_ever_dt as first_chemo_ever_date,
            chemo.first_chemo_ever as age_at_first_chemo_ever_days,
            chemo.first_initial_chemo_dt as initial_chemo_date,
            chemo.first_initial_chemo as age_at_initial_chemo_days,

            metho.first_methotrexate_ever_dt as first_methotrexate_ever_date,
            metho.first_methotrexate_ever as age_at_first_methotrexate_ever_days,

            -- flags read the upstream per-row is_initial_treatment definition
            -- ("ANY course in the frontline window"), never a window re-derived here
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
        -- identifier pair
        mrn,
        research_id,

        organization_name,
        organization_code,

        -- disease-event timing pairs
        initial_dx_date,
        age_at_initial_dx_days,
        first_event_date,
        age_at_first_event_days,

        -- treatment timing pairs: first EVER, then first that is initial treatment
        first_radiation_ever_date,
        age_at_first_radiation_ever_days,
        initial_radiation_date,
        age_at_initial_radiation_days,
        first_chemo_ever_date,
        age_at_first_chemo_ever_days,
        initial_chemo_date,
        age_at_initial_chemo_days,
        first_methotrexate_ever_date,
        age_at_first_methotrexate_ever_days,

        had_initial_radiation,
        had_initial_chemo,
        had_initial_methotrexate,
        case
            -- both frontline: order them (mutually exclusive arms, so the same-day
            -- case no longer depends on fall-through to be reached)
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
            -- neither frontline: genuinely untreated, treated only outside the
            -- window, or no diagnosis anchor to judge against (see header)
            else 'no_initial_radiation_or_chemo'
        end as initial_treatment_order
    from initials
);
