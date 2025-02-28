// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`, // Используем alias "@"
      },
    },
  },
  server: {
    host: true, // Разрешаем доступ по IP-адресу
    port: 3003,
    open: false, // Открывает приложение в браузере при старте
  },
});
