/*
    Coverage test: the data dictionary and the relations it documents must agree.

    THIS IS THE TEST THAT CLOSES THE DRIFT GAP. Seeding the dictionary removed the
    hand-transcription step, but the dictionary is still authored by hand and has no
    DAG edge to the models whose columns it describes -- so adding a column to
    pcx_30_event_level_deid would NOT surface here. Nothing structural prevents that;
    this test does.

    Passes when it returns ZERO rows. Three failure arms:

      1. UNDOCUMENTED_COLUMN      a column exists on a documented table but has no
                                  dictionary row -- the drift case above
      2. DOCUMENTED_COLUMN_MISSING a dictionary row names a field that no longer
                                  exists -- a renamed or dropped column
      3. DOCUMENTED_TABLE_MISSING  a documented table does not exist as a relation at
                                  all. Arm 2 would also fire for every one of its
                                  fields, so this arm exists to say WHY in one row
                                  rather than N.

    Scope is self-adjusting: the set of tables checked is whatever the dictionary
    documents (7 pcx_30_*_deid tables today), so documenting a new table
    automatically brings it under test.

    The table-level rows (field_name IS NULL, one per documented table) are excluded
    from the column comparison -- they describe the table, not a field.

    Green at the time it was added: 0 issues across 7 tables / 67 documented fields.
*/

with documented_fields as (
    select table_name, field_name
    from {{ ref('pcx_30_data_dictionary') }}
    where field_name is not null
),

documented_tables as (
    select distinct table_name
    from {{ ref('pcx_30_data_dictionary') }}
),

actual_columns as (
    select c.table_name, c.column_name as field_name
    from information_schema.columns c
    inner join documented_tables d on d.table_name = c.table_name
    where c.table_schema = '{{ target.schema }}'
),

existing_tables as (
    select t.table_name
    from information_schema.tables t
    inner join documented_tables d on d.table_name = t.table_name
    where t.table_schema = '{{ target.schema }}'
)

-- 1. column exists but is not documented
select
    'UNDOCUMENTED_COLUMN' as issue,
    a.table_name,
    a.field_name
from actual_columns a
left join documented_fields f
    on f.table_name = a.table_name
   and f.field_name = a.field_name
where f.field_name is null

union all

-- 2. documented field no longer exists as a column
select
    'DOCUMENTED_COLUMN_MISSING' as issue,
    f.table_name,
    f.field_name
from documented_fields f
left join actual_columns a
    on a.table_name = f.table_name
   and a.field_name = f.field_name
where a.field_name is null

union all

-- 3. documented table does not exist at all
select
    'DOCUMENTED_TABLE_MISSING' as issue,
    d.table_name,
    cast(null as varchar(128)) as field_name
from documented_tables d
left join existing_tables e on e.table_name = d.table_name
where e.table_name is null
