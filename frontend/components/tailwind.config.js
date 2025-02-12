const baseTailwindConfig = require("../themes/tailwind.base.config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseTailwindConfig,
  content: ["./base/**/*.{html,js}"],
};
