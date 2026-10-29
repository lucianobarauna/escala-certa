import path from 'node:path';

import optimizeLocales from '@react-aria/optimize-locales-plugin';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const isUnitTestRun = !!process.env.VITEST;

// https://vite.dev/config/
export default defineConfig({
  base: '/escala-certa/',
  plugins: [
    react(),
    tailwindcss(),
    !isUnitTestRun && babel({ presets: [reactCompilerPreset()] }),
    {
      ...optimizeLocales.vite({
        locales: ['pt-BR'],
      }),
      enforce: 'pre',
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
});
