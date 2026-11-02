import { defineConfig, type Plugin } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// Vite's library mode extracts CSS into dist/styles.css but never links it to the JS.
// This plugin prepends `import "./styles.css"` to the entry chunk, so whichever
// bundler the consumer uses pulls the styles in automatically.
function importStylesFromEntry(): Plugin {
  return {
    name: "capital-ui-kit:import-styles",
    apply: "build",
    enforce: "post",
    generateBundle(_options, bundle) {
      const hasCss = Object.keys(bundle).includes("styles.css");
      if (!hasCss) {
        this.error("Expected styles.css in the bundle, but it was not emitted.");
      }
      for (const chunk of Object.values(bundle)) {
        if (chunk.type === "chunk" && chunk.isEntry) {
          chunk.code = `import "./styles.css";\n${chunk.code}`;
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), importStylesFromEntry()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
      cssFileName: "styles",
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        /^react(\/.*)?$/,
        /^react-dom(\/.*)?$/,
        /^motion(\/.*)?$/,
        /^lucide-react(\/.*)?$/,
        /^zod(\/.*)?$/,
      ],
    },
  },
});
