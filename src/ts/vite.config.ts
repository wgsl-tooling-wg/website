import { defineConfig } from "vite";
import { linkBuildExtension } from "wesl-plugin";
import viteWesl from "wesl-plugin/vite";

export default defineConfig({
  plugins: [viteWesl({ extensions: [linkBuildExtension] })],
  build: {
    lib: {
      entry: "main.ts",
      formats: ["es"],
      fileName: "main",
    },
    outDir: "../assets",
    emptyOutDir: false,
    rollupOptions: {
      external: [/^\/wesl_web/],
    },
  },
});
