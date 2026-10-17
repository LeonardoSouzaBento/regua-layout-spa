import { defineConfig } from "wxt";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

const chromePath =
  "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  manifest: {
    action: {},
  },
  webExt: {
    binaries: {
      chrome: chromePath,
    },
  },
  imports: {
    eslintrc: {
      enabled: 9,
    },
  },
  vite: () => ({
    plugins: [react(), tailwindcss()],
  }),
});
