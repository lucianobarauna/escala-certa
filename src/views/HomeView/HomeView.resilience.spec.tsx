import { expect, test, vi } from 'vitest';

import { METRICS_CONSENT_STORAGE_KEY } from '@/lib/storage-keys';
import { scripts, setupAnalyticsEnvironment } from '@/services/analytics.test-utils';

import {
  NIGHT_SHIFT_SUMMARY,
  fillNightShift,
  renderHome,
  setupHomeEnvironment,
  summary,
} from './HomeView.test-utils';

setupHomeEnvironment();
setupAnalyticsEnvironment();

test('keeps working without console errors when the GA4 script is blocked', async () => {
  const consoleError = vi.spyOn(console, 'error');
  window.localStorage.setItem(METRICS_CONSENT_STORAGE_KEY, 'granted');
  await renderHome();
  scripts.forEach((script) => script.dispatchEvent(new Event('error')));
  await fillNightShift();
  await expect.element(summary()).toHaveTextContent(NIGHT_SHIFT_SUMMARY);
  expect(scripts.length).toBeGreaterThan(0);
  expect(consoleError).not.toHaveBeenCalled();
});
