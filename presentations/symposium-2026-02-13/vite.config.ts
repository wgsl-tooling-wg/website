import { linkBuildExtension } from "wesl-plugin";
import viteWesl from "wesl-plugin/vite";

export default {
  plugins: [
    viteWesl({ extensions: [linkBuildExtension] }),
  ],
  slidev: {
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: (tag: string) =>
            tag === "wgsl-edit" || tag === "wgsl-play",
        },
      },
    },
  },
};
