import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';
import apiSidebar from "./api/sidebar";
import radiantApiSidebar from "./api/sidebar";
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
        }

    ],
};

export default sidebars.technicalDoc;
