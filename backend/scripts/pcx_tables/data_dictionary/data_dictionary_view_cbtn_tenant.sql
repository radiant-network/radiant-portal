/*
   v_pcx_30_data_dictionary  (VIEW, cbtn_tenant)

   cbtn_tenant copy. cbtn_tenant holds no base tables, so this reads the table
   cross-database from radiant_data_dev, mirroring how the other cbtn_tenant
   pcx_30 views source their data.

   Contains no patient data -- descriptions and field names only.

   Consumers should ORDER BY display_order to reproduce the authored CSV order.
 */

drop view if exists cbtn_tenant.v_pcx_30_data_dictionary;

create view cbtn_tenant.v_pcx_30_data_dictionary as (
    select
        display_order,
        table_name,
        source_file,
        field_name,
        description
    from radiant_data_dev.pcx_30_data_dictionary
);
