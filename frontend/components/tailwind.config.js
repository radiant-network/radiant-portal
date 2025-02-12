const baseTailwindConfig = require("../tailwind.base.config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseTailwindConfig,
  content: ["./base/**/*.{html,js}"],
};
