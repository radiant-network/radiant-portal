{#
    Return a model's custom schema VERBATIM instead of concatenating it onto the
    target schema.

    dbt's built-in default (dbt/include/global_project/macros/get_custom_name/
    get_custom_schema.sql:30) renders `{{ default_schema }}_{{ custom_schema_name }}`,
    so a model configured `schema='cbtn_tenant'` would land in
    `radiant_data_dev_cbtn_tenant`. The pcx_30 access-controlled views must land in
    the real `cbtn_tenant` schema, which is where the portal reads them from.

    Blast radius: project-wide, but inert on every model that does NOT set a custom
    schema -- those still resolve to target.schema exactly as before. At the time
    this was added, the access-controlled views were the only models setting one.
#}

{% macro generate_schema_name(custom_schema_name, node) -%}

    {%- if custom_schema_name is none -%}
        {{ target.schema }}
    {%- else -%}
        {{ custom_schema_name | trim }}
    {%- endif -%}

{%- endmacro %}
