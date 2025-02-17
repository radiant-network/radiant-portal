const baseTailwindConfig = require("../themes/tailwind.base.config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseTailwindConfig,
  content: [
    "./src**/*.{html,js,ts,tsx,jsx}",
    "../../components/components/**/*.{html,js,ts,tsx,jsx}",
    "../../components/base/**/*.{html,js,ts,tsx,jsx}",
    "../../components/feature/**/*.{html,js,ts,tsx,jsx}",
    "../../components/composite/**/*.{html,js,ts,tsx,jsx}",
    "../../components/base/ui/**/*.{js,jsx,ts,tsx}",
  ],
};
