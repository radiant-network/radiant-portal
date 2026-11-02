{{ config(
    materialized='view',
    tags=['pcx_30', 'data_dictionary']
) }}

-- Read surface over pcx_30_data_dictionary.
--
-- Consumers should ORDER BY display_order to reproduce the authored CSV order -- a
-- view cannot guarantee row order to an outer query.
--
-- Contains no patient data: field names and descriptions only.

select
    display_order,
    table_name,
    source_file,
    field_name,
    description
from {{ ref('pcx_30_data_dictionary') }}
