{{ config(
    materialized='view',
    schema=var('tenant_code', 'cbtn') ~ '_tenant',
    alias='v_pcx_30_data_dictionary',
    tags=['pcx_30', 'data_dictionary']
) }}

-- cbtn_tenant copy of v_pcx_30_data_dictionary.
--
-- cbtn_tenant holds no base tables, so this reads the table cross-database from
-- radiant_data_dev, mirroring how the other cbtn_tenant pcx_30 views source data.
--
-- DELIBERATELY NOT GRANT-GUARDED, unlike every other cbtn_tenant view in this
-- project: it carries no patient data at all -- field names and prose descriptions
-- only -- so there is nothing to mask and no can_read_phi column. That is why it does
-- NOT use the access_controlled_view macro, and why it is named tenant_* rather than
-- ac_*. If a patient-identifying column is ever added to the dictionary, this becomes
-- the wrong shape.
--
-- The model is named tenant_* so it does not collide with the radiant_data_dev view's
-- model name; `alias` restores the real relation name.
--
-- Consumers should ORDER BY display_order to reproduce the authored CSV order.

select
    display_order,
    table_name,
    source_file,
    field_name,
    description
from {{ ref('pcx_30_data_dictionary') }}
