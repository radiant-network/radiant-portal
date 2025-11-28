import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type * as Plugin from "@docusaurus/types/src/plugin";
import type * as OpenApiPlugin from "docusaurus-plugin-openapi-docs";
// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
    title: 'Radiant',
    tagline: 'Real-time Analysis and Discovery in Integrated And Networked Technologies',
    favicon: 'img/favicon.ico',

    // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
    future: {
        v4: true, // Improve compatibility with the upcoming Docusaurus v4
    },

    // Set the production url of your site here
    url: 'https://radiant-network.github.io',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/radiant-portal/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'radiant-network', // Usually your GitHub org/user name.
    projectName: 'radiant-portal', // Usually your repo name.

    onBrokenLinks: 'throw',

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                    docItemComponent: "@theme/ApiItem",
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        'https://github.com/radiant-network/radiant-portal/tree/main/docs/',
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        // Replace with your project's social card
        image: 'img/docusaurus-social-card.jpg',
        colorMode: {
            respectPrefersColorScheme: true,
        },
        navbar: {
            title: 'Radiant',
            logo: {
                alt: 'Radiant Logo',
                src: 'img/logo.svg',
            },
            items: [
                {
                    label: 'User Guide',
                    type: 'docSidebar',
                    sidebarId: 'userGuideDoc',
                    position: 'left',
                },
                {
                    type: 'docSidebar',
                    sidebarId: 'technicalGuideDoc',
                    position: 'left',
                    label: 'Technical Guide',
                },
                {
                    href: 'https://github.com/radiant-network',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'User Guide',
                            to: '/docs/user-guide/intro',
                        },
                        {
                            label: 'Technical Guide',
                            to: '/docs/technical-guide/intro',
                        },
                    ],
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'GitHub',
                            href: 'https://github.com/radiant-network',
                        },
                        {
                            label: 'Storybook',
                            href: 'https://radiant-network.github.io/radiant-portal/storybook/',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} CHU Sainte-Justine, Children's Hospital of Philadelphia. Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
    plugins: [
        [
            'docusaurus-plugin-openapi-docs',
            {
                id: "api", // plugin id
                docsPluginId: "classic", // configured for preset-classic
                config: {
                    petstore: {
                        specPath: "../backend/docs/swagger.yaml",
                        outputDir: "docs/technical-guide/radiant-api",
                        sidebarOptions: {
                            groupPathsBy: "tag",
                            categoryLinkSource: "tag",
                        },
                    } satisfies OpenApiPlugin.Options,
                }
            },
        ]
    ],
    themes: [
        'docusaurus-theme-openapi-docs',
    ],
};

export default config;
