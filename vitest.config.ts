import { playwright } from '@vitest/browser-playwright';
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';
import type { BrowserCommand } from 'vitest/node';

import viteConfig from './vite.config';

const MIN_COVERAGE_PERCENT = 80;

type ColorScheme = 'light' | 'dark';

async function emulateColorScheme(
  context: Parameters<BrowserCommand<[scheme: ColorScheme]>>[0],
  scheme: ColorScheme,
) {
  if (context.provider.name !== 'playwright') throw new Error('Requer o provider playwright');
  await context.page.emulateMedia({ colorScheme: scheme });
}

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      exclude: [...configDefaults.exclude, 'e2e/**'],
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [{ browser: 'chromium' }],
        commands: { emulateColorScheme },
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
