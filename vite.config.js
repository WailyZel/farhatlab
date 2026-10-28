import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Для GitHub Pages сайт обычно живёт по адресу https://<user>.github.io/<repo>/
// Базовый путь берётся из переменной VITE_BASE (её задаёт GitHub Actions),
// локально используется "/".
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 900,
  },
});
