-- Field-provenance overlay for the pcx_30 relations: the row key, and the pivot.
--
-- Authored ONCE here because the same two blocks are needed by TEN relations --
-- the five `pcx_30_<grain>_level_deid` tables and the five
-- `v_pcx_30_<grain>_level_combined` views -- and the uid expression in
-- particular has to stay byte-identical across all of them AND agree with
-- `promote_to_pcx30._uid` in Python. Ten hand-written copies is the divergence
-- the access_controlled_view macro was created to close; this follows that
-- precedent rather than re-opening it.
--
-- WHY A CONTENT HASH IS THE KEY. These relations are `select distinct` with no
-- row identity of their own, so there is nothing else to join provenance on.
-- Being content-addressed is the right failure mode: if an upstream value
-- moves, the uid moves, the join misses, and a stamp measured against the old
-- value stops applying rather than being silently applied to a value nobody
-- reviewed.


{% macro pcx_row_uid(cols) -%}
{#- md5 over every base column in DDL ORDER, '|#|'-joined, each NULL replaced by
    a NUL-wrapped sentinel so a real NULL and the literal string 'NULL' hash
    differently. Reproduces promote_to_pcx30._uid EXACTLY -- verified 2026-11-05
    against all five live release tables, 38,488 of 38,488 rows.

    `cols` MUST be the grain's base columns in the release table's column order.
    A different order is a different hash, so passing the view's own column list
    (which carries extra identified columns) would silently join nothing. -#}
{%- set parts = [] -%}
{%- for c in cols -%}
{%- do parts.append("coalesce(cast(" ~ c ~ " as string), concat(char(0), 'NULL', char(0)))") -%}
{%- endfor -%}
md5(concat({{ parts | join(", '|#|', ") }}))
{%- endmacro %}


{% macro pcx_30_field_provenance_pivot(grain, override_fields) -%}
{#- One row per release row: an `ov_<field>` column per overridable field
    carrying the reviewer-accepted value (NULL when none), plus the compact
    `field_provenance` string. `!` marks an override -- a value a clinical
    reviewer accepted IN PLACE OF the curator's; no marker means corroborated,
    i.e. an independent automated source produced the same value and only the
    recorded source changes.

    `override_fields` is kept alphabetical so the generated column order is
    stable across a re-render. -#}
select
    pcx_row_uid,
{%- for f in override_fields %}
    max(case when field = '{{ f }}' then accepted_value end)
        as ov_{{ f }},
{%- endfor %}
    group_concat(
        concat(field, '=', source, if(kind = 'override', '!', ''))
        order by field separator ';'
    ) as field_provenance
from {{ source('radiant_prov', 'pcx_30_field_provenance') }}
where grain = '{{ grain }}'
group by pcx_row_uid
{%- endmacro %}
