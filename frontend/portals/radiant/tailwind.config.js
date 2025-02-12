const baseTailwindConfig = require("../../tailwind.base.config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseTailwindConfig,
  content: [
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "../../apps/variant/src**/*.{html,js,ts,tsx,jsx}",
    "../../components/components/**/*.{html,js,ts,tsx,jsx}",
    "../../components/base/**/*.{html,js,ts,tsx,jsx}",
    "../../components/feature/**/*.{html,js,ts,tsx,jsx}",
    "../../components/composite/**/*.{html,js,ts,tsx,jsx}",
    "../../components/base/ui/**/*.{js,jsx,ts,tsx}",
  ],
  fontFamily: {
    sans: [
      '"Inter"',
      "ui-sans-serif",
      "system-ui",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"',
    ],
  },
};
