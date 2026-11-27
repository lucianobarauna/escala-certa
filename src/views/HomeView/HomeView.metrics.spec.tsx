import { describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';

import { METRICS_CONSENT_STORAGE_KEY } from '@/lib/storage-keys';
import { sentEvents, setupAnalyticsEnvironment } from '@/services/analytics.test-utils';

import {
  chooseOption,
  fillNightShift,
  renderHome,
  setupHomeEnvironment,
  typeDate,
} from './HomeView.test-utils';

setupHomeEnvironment();
setupAnalyticsEnvironment();

function completedEvents() {
  return sentEvents().filter(([, name]) => name === 'schedule_completed');
}

function grantConsent() {
  window.localStorage.setItem(METRICS_CONSENT_STORAGE_KEY, 'granted');
}

describe('given the person accepted metrics', () => {
  test('when the schedule is completed and marks change, then schedule_completed is sent once', async () => {
    grantConsent();
    await renderHome();
    await chooseOption(/^Semanal/);
    await chooseOption(/^5x2/);
    await typeDate('01112026');
    await chooseOption(/^6x1/);
    expect(completedEvents()).toHaveLength(2);
    expect(completedEvents()[1][2]).toMatchObject({
      schedule_type: 'weekly',
      variant: '6x1',
      weeks: 1,
    });
  });

  test('when events are sent, then no payload carries the name, dates or the query', async () => {
    grantConsent();
    await renderHome();
    await page.getByRole('textbox', { name: /Nome da escala/ }).fill('Escala da Ana');
    await fillNightShift();
    const payloads = JSON.stringify(sentEvents());
    expect(sentEvents().length).toBeGreaterThan(0);
    expect(payloads).not.toMatch(/Ana|2026-11-01|\?v=1/);
  });
});

describe('given the person has not chosen yet', () => {
  test('when accepting after completing, then the pending schedule_completed is sent', async () => {
    await renderHome();
    await fillNightShift();
    expect(completedEvents()).toHaveLength(0);
    await page.getByRole('button', { name: 'Aceitar métricas' }).click();
    expect(completedEvents()).toHaveLength(1);
  });

  test('when refusing, then nothing is sent', async () => {
    await renderHome();
    await fillNightShift();
    await page.getByRole('button', { name: 'Recusar métricas' }).click();
    expect(sentEvents()).toHaveLength(0);
  });
});
