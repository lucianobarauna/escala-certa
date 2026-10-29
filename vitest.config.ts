import { playwright } from '@vitest/browser-playwright';
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

const MIN_COVERAGE_PERCENT = 80;

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      exclude: [...configDefaults.exclude, 'e2e/**'],
      browser: {
        enabled: true,
        provider: playwright(),
        instances: [{ browser: 'chromium' }],
      },
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/main.tsx', 'src/components/ui/**', 'src/**/*.spec.{ts,tsx}'],
        thresholds: {
          lines: MIN_COVERAGE_PERCENT,
          functions: MIN_COVERAGE_PERCENT,
          branches: MIN_COVERAGE_PERCENT,
          statements: MIN_COVERAGE_PERCENT,
        },
      },
    },
  }),
);
