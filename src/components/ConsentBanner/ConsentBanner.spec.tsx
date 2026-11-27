import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';

import { METRICS_CONSENT_STORAGE_KEY } from '@/lib/storage-keys';
import { setupConsentEnvironment } from '@/services/consent.test-utils';

import { MetricsFooterHarness, turnOnGlobalPrivacyControl } from './ConsentBanner.test-utils';

setupConsentEnvironment();

describe('given no metrics choice stored', () => {
  test('when the page opens, then the banner offers both choices with the same weight', async () => {
    const { getByRole } = await render(<MetricsFooterHarness />);
    const accept = getByRole('button', { name: 'Aceitar métricas' });
    const refuse = getByRole('button', { name: 'Recusar métricas' });
    await expect.element(getByRole('region', { name: 'Métricas de uso' })).toBeVisible();
    expect(accept.element().className).toBe(refuse.element().className);
    await expect.element(accept).not.toHaveFocus();
  });

  test('when accepting, then the banner closes, the choice is stored and focus goes to Privacidade', async () => {
    const { getByRole } = await render(<MetricsFooterHarness />);
    await getByRole('button', { name: 'Aceitar métricas' }).click();
    await expect.element(getByRole('region', { name: 'Métricas de uso' })).not.toBeInTheDocument();
    await expect.element(getByRole('button', { name: 'Privacidade' })).toHaveFocus();
    expect(window.localStorage.getItem(METRICS_CONSENT_STORAGE_KEY)).toBe('granted');
  });

  test('when refusing, then the banner closes and the refusal is stored', async () => {
    const { getByRole } = await render(<MetricsFooterHarness />);
    await getByRole('button', { name: 'Recusar métricas' }).click();
    await expect.element(getByRole('region', { name: 'Métricas de uso' })).not.toBeInTheDocument();
    expect(window.localStorage.getItem(METRICS_CONSENT_STORAGE_KEY)).toBe('denied');
  });

  test('when tabbing past the banner, then focus moves on without being trapped', async () => {
    const { getByRole } = await render(<MetricsFooterHarness />);
    getByRole('button', { name: 'Recusar métricas' }).element().focus();
    await userEvent.tab();
    await expect.element(getByRole('button', { name: 'Privacidade' })).toHaveFocus();
  });
});

describe('given a choice that hides the banner', () => {
  test('when a choice is already stored, then the banner does not appear', async () => {
    window.localStorage.setItem(METRICS_CONSENT_STORAGE_KEY, 'denied');
    const { getByRole } = await render(<MetricsFooterHarness />);
    await expect.element(getByRole('button', { name: 'Privacidade' })).toBeVisible();
    await expect.element(getByRole('region', { name: 'Métricas de uso' })).not.toBeInTheDocument();
  });

  test('when the browser sends Global Privacy Control, then the banner does not appear', async () => {
    turnOnGlobalPrivacyControl();
    const { getByRole } = await render(<MetricsFooterHarness />);
    await expect.element(getByRole('button', { name: 'Privacidade' })).toBeVisible();
    await expect.element(getByRole('region', { name: 'Métricas de uso' })).not.toBeInTheDocument();
  });
});
