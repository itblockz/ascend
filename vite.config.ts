import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  // GitHub Pages serves the site from /ascend/ (so does `vite preview`); the dev server stays at the root
  base: command === 'build' || isPreview ? '/ascend/' : '/',
  plugins: [react(), tailwindcss()],
}))
