import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
      cssFileName: "styles",
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: [/^react(\/.*)?$/, /^react-dom(\/.*)?$/, /^motion(\/.*)?$/, "lucide-react", "zod"],
    },
  },
});