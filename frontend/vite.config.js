import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        // target: "http://localhost:5000",
        target: "http://143.244.128.224:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
