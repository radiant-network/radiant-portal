{{ config(
    materialized='table',
    tags=['pcx_30', 'data_dictionary']
) }}

-- Data dictionary for the pcx_30_*_deid release tables.
--
-- Replaces the retired data_dictionary/data_dictionary_table.sql. Shape is preserved
-- EXACTLY -- same relation name, same five columns in the same order, same types --
-- so the two read views and any direct consumer see no change.
--
-- The 74 authored rows live in the seed pcx_30_data_dictionary_src; this model adds
-- the one derived column and the NULL coercion. Edit the SEED to change content, not
-- this file.
--
-- table_name IS DERIVED, deliberately. It is always source_file minus the '.csv'
-- suffix -- verified on all 74 rows before the conversion -- so deriving it here
-- means the two columns cannot drift apart the way two hand-maintained columns
-- could.
--
-- field_name: the seed carries an EMPTY STRING for the 7 table-level rows, and
-- `field_name IS NULL` is the published signal for "this row describes the table,
-- not a field". nullif() restores that unconditionally, so it holds whether the seed
-- loader produces '' or NULL for an empty CSV field -- a difference that would
-- otherwise silently collapse a semantic distinction.
--
-- Contains NO patient data: field names and prose descriptions only. That is why the
-- cbtn_tenant copy is a plain pass-through rather than a grant-guarded view.

select
    cast(display_order as int)                              as display_order,
    cast(replace(source_file, '.csv', '') as varchar(128))  as table_name,
    cast(source_file as varchar(128))                       as source_file,
    cast(nullif(field_name, '') as varchar(128))            as field_name,
    cast(description as varchar(2000))                      as description
from {{ ref('pcx_30_data_dictionary_src') }}
