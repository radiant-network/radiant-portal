import type {SidebarsConfig} from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
    apisidebar: [
        {
            type: "doc",
            id: "technical-guide/api/overview",
        },
        {
            type: "doc",
            id: "technical-guide/api/auth",
        },
        {
            type: "doc",
            id: "technical-guide/api/clients",
        },
        {
            type: "doc",
            id: "technical-guide/api/case_creation",
        },
    ]
}

export default sidebar.apisidebar;