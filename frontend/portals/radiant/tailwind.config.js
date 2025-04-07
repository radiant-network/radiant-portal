const baseTailwindConfig = require('../../themes/tailwind.base.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseTailwindConfig,
  content: [
    './app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}',
    '../../apps/variant/src/**/*.{html,js,ts,tsx,jsx}',
    '../../components/**/*.{html,js,ts,tsx,jsx}',
  ],
  fontFamily: {
    sans: [
      '"Inter"',
      'ui-sans-serif',
      'system-ui',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"',
    ],
  },
};
