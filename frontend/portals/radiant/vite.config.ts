import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  resolve: {
    alias: {
      "@assets": path.resolve(
        __dirname,
        `../../themes/${process.env.THEME}/assets`
      ),
      "@styles": path.resolve(__dirname, `../../themes/${process.env.THEME}`),
    },
  },
  plugins: [reactRouter(), tsconfigPaths()],
});
