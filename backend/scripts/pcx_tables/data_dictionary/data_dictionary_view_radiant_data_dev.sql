/*
   v_pcx_30_data_dictionary  (VIEW, radiant_data_dev)

   Read surface over radiant_data_dev.pcx_30_data_dictionary.
   Consumers should ORDER BY display_order to reproduce the authored CSV order --
   a view cannot guarantee row order to an outer query.
 */

drop view if exists radiant_data_dev.v_pcx_30_data_dictionary;

create view radiant_data_dev.v_pcx_30_data_dictionary as (
    select
        display_order,
        table_name,
        source_file,
        field_name,
        description
    from radiant_data_dev.pcx_30_data_dictionary
);
