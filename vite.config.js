import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** Vite runs inside Express (middleware mode) — one port for dev and production */
export default defineConfig({
  plugins: [react()],
  appType: "custom",
  publicDir: "public",
});
