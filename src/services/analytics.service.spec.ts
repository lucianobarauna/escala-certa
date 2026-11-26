import { describe, expect, test, vi } from 'vitest';

import { pageView, scheduleShared } from './analytics.events';
import { applyEnabled, createAnalyticsState, sendEvent } from './analytics.service';
import {
  MEASUREMENT_ID,
  dataLayerCalls,
  enabledState,
  scripts,
  sentEvents,
  setupAnalyticsEnvironment,
} from './analytics.test-utils';

setupAnalyticsEnvironment();

describe('given analytics disabled', () => {
  test('when tracking, then no script, dataLayer or error is produced', () => {
    const state = createAnalyticsState();
    expect(() => sendEvent(state, pageView(true))).not.toThrow();
    expect(scripts).toHaveLength(0);
    expect(Reflect.has(window, 'dataLayer')).toBe(false);
  });

  test('when there is no measurement id, then enabling is a no-op', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', '');
    const state = enabledState();
    sendEvent(state, scheduleShared('native'));
    expect(scripts).toHaveLength(0);
    expect(Reflect.has(window, 'dataLayer')).toBe(false);
  });
});

describe('given analytics enabled', () => {
  test('when enabled twice, then the script is injected once with the restrictive config', () => {
    const state = enabledState();
    applyEnabled(state, true);
    expect(scripts).toHaveLength(1);
    expect(scripts[0].src).toContain(`googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`);
    const config = dataLayerCalls().find(([command]) => command === 'config');
    expect(config?.[2]).toMatchObject({
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_title: 'Escala Certa',
    });
  });

  test('when page_view is tracked twice, then it is sent once with has_schedule', () => {
    const state = enabledState();
    sendEvent(state, pageView(true));
    sendEvent(state, pageView(false));
    expect(sentEvents()).toHaveLength(1);
    expect(sentEvents()[0][2]).toMatchObject({ has_schedule: 'yes' });
  });

  test('when tracking after revocation, then nothing more is sent', () => {
    const state = enabledState();
    sendEvent(state, scheduleShared('native'));
    applyEnabled(state, false);
    sendEvent(state, scheduleShared('manual'));
    expect(sentEvents()).toHaveLength(1);
    expect(Reflect.get(window, `ga-disable-${MEASUREMENT_ID}`)).toBe(true);
  });
});
