import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';
import apiSidebar from "./api/sidebar";
import radiantApiSidebar from "./radiant-api/sidebar";
// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
    technicalDoc: [
        {
            type: "doc",
            id: "technical-guide/intro",
        },
        {
            type: 'category',
            label: 'Architecture',
            items: [
                'technical-guide/architecture/overview',
            ],
        },
        {
            type: "doc",
            id: "technical-guide/data-model/model",
        },
        {
            type: 'category',
            label: 'API',
            link: {
                type: "generated-index",
                title: "API",
                description:
                    "This is documentation for Radiant's public API. Here you'll find all the information you need to integrate with our platform, including endpoint details, request/response formats, authentication methods, and usage examples.",
            },
            items: [
                apiSidebar,
                {
                    type: 'category',
                    label: 'Complete Radiant API',
                    link: {
                        type: "generated-index",
                        title: "Complete Radiant API",
                        description:
                            "This is documentation for Radiant's public API. Here you'll find all the information you need to integrate with our platform, including endpoint details, request/response formats, authentication methods, and usage examples.",
                    },
                    items: radiantApiSidebar,
                },
            ],
        },
        {
            type: 'category',
            label: 'Administration',
            items: [
                'technical-guide/administration/configuration',
            ],
        },
        {
            type: 'category',
            label: 'Deployment',
            items: [
                'technical-guide/deployment/intro',
            ],
        },
        {
            type: 'category',
            label: 'Developers',
            items: [
                'technical-guide/developers/contribute',
            ],
        },
        {
            type: 'category',
            label: 'Frontend',
            items: [
                'technical-guide/frontend/intro',
                {
                    type: 'category',
                    label: 'Query Builder',
                    link: {
                        type: 'doc',
                        id: 'technical-guide/frontend/query-builder/index',
                    },
                    items: [
                        'technical-guide/frontend/query-builder/architecture',
                        'technical-guide/frontend/query-builder/query-bar',
                        'technical-guide/frontend/query-builder/queries-bar-card',
                        'technical-guide/frontend/query-builder/query-builder-data-table',
                        {
                            type: 'category',
                            label: 'Facets',
                            items: [
                                'technical-guide/frontend/query-builder/facets/facet-list',
                                'technical-guide/frontend/query-builder/facets/facet-container',
                                'technical-guide/frontend/query-builder/facets/sidebar-group',
                                'technical-guide/frontend/query-builder/facets/boolean-facet',
                                'technical-guide/frontend/query-builder/facets/multiselect-facet',
                                'technical-guide/frontend/query-builder/facets/numerical-facet',
                                'technical-guide/frontend/query-builder/facets/search-facet',
                                'technical-guide/frontend/query-builder/facets/upload-id-facet',
                                'technical-guide/frontend/query-builder/facets/hooks/use-facet-config',
                                'technical-guide/frontend/query-builder/facets/libs/facet-storage',
                            ],
                        },
                        {
                            type: 'category',
                            label: 'Pills',
                            items: [
                                'technical-guide/frontend/query-builder/pills/query-pill-container',
                                'technical-guide/frontend/query-builder/pills/label-operator',
                                'technical-guide/frontend/query-builder/pills/operator',
                                'technical-guide/frontend/query-builder/pills/combiner-operator',
                                'technical-guide/frontend/query-builder/pills/boolean-query-pill',
                                'technical-guide/frontend/query-builder/pills/multiselect-query-pill',
                                'technical-guide/frontend/query-builder/pills/numerial-query-pill',
                                'technical-guide/frontend/query-builder/pills/search-query-pill',
                                'technical-guide/frontend/query-builder/pills/combined-query-pill',
                            ],
                        },
                        {
                            type: 'category',
                            label: 'Saved Filter',
                            items: [
                                'technical-guide/frontend/query-builder/saved-filter/query-builder-saved-filters',
                                'technical-guide/frontend/query-builder/saved-filter/use-saved-filters',
                                'technical-guide/frontend/query-builder/saved-filter/filter-update-modal',
                                'technical-guide/frontend/query-builder/saved-filter/filter-delete-modal',
                                'technical-guide/frontend/query-builder/saved-filter/filter-unsaved-modal',
                                'technical-guide/frontend/query-builder/saved-filter/manage-filters-modal',
                            ],
                        },
                        {
                            type: 'category',
                            label: 'Hooks',
                            items: [
                                'technical-guide/frontend/query-builder/hooks/use-query-builder',
                                'technical-guide/frontend/query-builder/hooks/use-query-builder-preference',
                                'technical-guide/frontend/query-builder/hooks/use-aggregation-builder',
                            ],
                        },
                        {
                            type: 'category',
                            label: 'Libs',
                            items: [
                                'technical-guide/frontend/query-builder/libs/aggregations',
                                'technical-guide/frontend/query-builder/libs/sqon',
                            ],
                        },
                        {
                            type: 'category',
                            label: 'Types',
                            items: [
                                'technical-guide/frontend/query-builder/type/ISyntheticSqon',
                                'technical-guide/frontend/query-builder/type/ISqonGroupFacet',
                                'technical-guide/frontend/query-builder/type/IValueFacet',
                                'technical-guide/frontend/query-builder/type/IValueContent',
                                'technical-guide/frontend/query-builder/type/IValueQuery',
                                'technical-guide/frontend/query-builder/type/IValueFacetQuery',
                                'technical-guide/frontend/query-builder/type/IRemoteComponent',
                                'technical-guide/frontend/query-builder/type/TFacetValue',
                                'technical-guide/frontend/query-builder/type/TValueOp',
                                'technical-guide/frontend/query-builder/type/TSqonContent',
                                'technical-guide/frontend/query-builder/type/TSqonContentValue',
                                'technical-guide/frontend/query-builder/type/TSqonGroupOp',
                                'technical-guide/frontend/query-builder/type/TSyntheticSqonContent',
                                'technical-guide/frontend/query-builder/type/TSyntheticSqonContentValue',
                                'technical-guide/frontend/query-builder/type/Sqon.api',
                                'technical-guide/frontend/query-builder/type/SqonContent.api',
                                'technical-guide/frontend/query-builder/type/SqonOpEnum.api',
                                'technical-guide/frontend/query-builder/type/LeafContent.api',
                            ],
                        },
                    ],
                },
            ],
        },

    ],
};

export default sidebars.technicalDoc;
