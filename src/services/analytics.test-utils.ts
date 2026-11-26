import { afterEach, beforeEach, vi } from 'vitest';

import { applyEnabled, createAnalyticsState } from './analytics.service';

export const MEASUREMENT_ID = 'G-TEST123';

const ORIGINAL_URL = window.location.href;

export const scripts: HTMLScriptElement[] = [];

export function dataLayerCalls(): unknown[][] {
  const layer: unknown = Reflect.get(window, 'dataLayer');
  return Array.isArray(layer) ? layer.map((entry) => Array.from(entry)) : [];
}

export function sentEvents() {
  return dataLayerCalls().filter(([command]) => command === 'event');
}

export function enabledState() {
  const state = createAnalyticsState();
  applyEnabled(state, true);
  return state;
}

export function setupAnalyticsEnvironment() {
  beforeEach(() => {
    scripts.length = 0;
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', MEASUREMENT_ID);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(document.head, 'append').mockImplementation((...nodes) => {
      scripts.push(...nodes.filter((node) => node instanceof HTMLScriptElement));
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    window.history.replaceState(null, '', ORIGINAL_URL);
    ['dataLayer', 'gtag', `ga-disable-${MEASUREMENT_ID}`].forEach((key) =>
      Reflect.deleteProperty(window, key),
    );
  });
}
