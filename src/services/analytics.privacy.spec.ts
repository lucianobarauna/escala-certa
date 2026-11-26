import { describe, expect, test } from 'vitest';

import { scheduleCompleted, scheduleShared, textSizeChanged, pageView } from './analytics.events';
import { applyEnabled, createAnalyticsState, sendEvent } from './analytics.service';
import {
  dataLayerCalls,
  enabledState,
  scripts,
  sentEvents,
  setupAnalyticsEnvironment,
} from './analytics.test-utils';

setupAnalyticsEnvironment();

describe('given a page with name and configuration in the address', () => {
  test('when an event is sent, then location and title are fixed', () => {
    window.history.replaceState(null, '', '/escala-certa/?v=1&t=shift&n=Ana');
    sendEvent(enabledState(), scheduleShared('clipboard'));
    expect(sentEvents()[0][2]).toMatchObject({
      page_location: `${window.location.origin}${import.meta.env.BASE_URL}`,
      page_title: 'Escala Certa',
    });
  });

  test('when all events are sent, then no payload contains draft data', () => {
    window.history.replaceState(null, '', '/escala-certa/?v=1&n=Ana+Souza&d=2031-07-19&p=06');
    const state = enabledState();
    [
      pageView(true),
      scheduleCompleted({ scheduleType: 'weekly', variant: '5x2', weeks: 2 }),
      scheduleShared('native'),
      textSizeChanged(150),
    ].forEach((event) => sendEvent(state, event));
    const payload = JSON.stringify(dataLayerCalls().filter(([command]) => command !== 'js'));
    expect(payload).not.toMatch(/Ana|Souza|2031|\?|v=1|p=06/);
  });
});

describe('given failures in the analytics service', () => {
  test('when the script fails to load, then the error is swallowed', () => {
    const state = enabledState();
    expect(() => scripts[0].onerror?.(new Event('error'))).not.toThrow();
    expect(() => sendEvent(state, scheduleShared('native'))).not.toThrow();
  });

  test('when gtag throws, then enabling and tracking do not throw', () => {
    Reflect.set(window, 'gtag', () => {
      throw new Error('gtag broke');
    });
    const state = createAnalyticsState();
    expect(() => applyEnabled(state, true)).not.toThrow();
    expect(() => sendEvent(state, scheduleShared('native'))).not.toThrow();
  });
});
