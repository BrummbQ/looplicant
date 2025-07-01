import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "LctCard",
      fileName: "lct-card",
      formats: ["es"],
    },
    outDir: "dist",
  },
  plugins: [svelte({ compilerOptions: { customElement: true } })],
});
