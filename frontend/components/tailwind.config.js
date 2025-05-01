const baseTailwindConfig = require('../themes/tailwind.base.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseTailwindConfig,
  content: [
    './shared/**/*.{html,js,jsx,ts,tsx}',
    './base/**/*.{html,js,jsx,ts,tsx}',
    './feature/**/*.{html,js,jsx,ts,tsx}',
    './.storybook/**/*.{html,js,ts,tsx,mdx}',
    './stories/**/*.{html,js,ts,tsx,mdx}',
  ],
};
