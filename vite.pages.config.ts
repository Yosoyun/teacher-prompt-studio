import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.join(projectRoot, "github-pages"),
  base: "./",
  publicDir: path.join(projectRoot, "public"),
  plugins: [react()],
  build: {
    outDir: path.join(projectRoot, "dist-pages"),
    emptyOutDir: true,
  },
});
