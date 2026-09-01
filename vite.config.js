import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// BASE_PATH is injected by the GitHub Actions workflow as "/<repo-name>/".
// Locally (npm run dev / npm run build without the env var) it defaults to "/".
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || "/",
});
