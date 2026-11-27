import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';

import {
  MetricsFooterHarness,
  turnOnGlobalPrivacyControl,
} from '@/components/ConsentBanner/ConsentBanner.test-utils';
import { clickLabelOf } from '@/lib/click.test-utils';
import { METRICS_CONSENT_STORAGE_KEY } from '@/lib/storage-keys';
import { setupConsentEnvironment } from '@/services/consent.test-utils';

setupConsentEnvironment();

async function openPrivacy() {
  const screen = await render(<MetricsFooterHarness />);
  await screen.getByRole('button', { name: 'Privacidade' }).click();
  return screen;
}

describe('given the privacy text is opened', () => {
  test('when it opens, then the schedule in the link is kept', async () => {
    const scheduleUrl = `${window.location.pathname}?v=1&t=shift&c=24x48`;
    window.history.replaceState(null, '', scheduleUrl);
    const { getByRole } = await openPrivacy();
    await expect.element(getByRole('dialog', { name: 'Privacidade' })).toBeVisible();
    expect(`${window.location.pathname}${window.location.search}`).toBe(scheduleUrl);
    window.history.replaceState(null, '', window.location.pathname);
  });

  test('when it opens, then it explains Google, cookies, what is never collected and the link', async () => {
    const { getByRole } = await openPrivacy();
    const dialog = getByRole('dialog', { name: 'Privacidade' });
    await expect.element(dialog).toHaveTextContent(/Google Analytics 4/);
    await expect.element(dialog).toHaveTextContent(/cookies _ga/);
    await expect.element(dialog).toHaveTextContent(/Nunca enviamos o nome da escala/);
    await expect.element(dialog).toHaveTextContent(/ficam apenas no endereço da página/);
  });

  test('when Esc is pressed, then it closes and focus returns to the Privacidade link', async () => {
    const { getByRole } = await openPrivacy();
    await userEvent.keyboard('{Escape}');
    await expect.element(getByRole('dialog')).not.toBeInTheDocument();
    await expect.element(getByRole('button', { name: 'Privacidade' })).toHaveFocus();
  });
});

describe('given the metrics switch', () => {
  test('when it is turned on, then the state is visible, announced and stored', async () => {
    const { getByRole } = await openPrivacy();
    await clickLabelOf(getByRole('switch', { name: 'Métricas de uso' }));
    await expect.element(getByRole('switch', { name: 'Métricas de uso' })).toBeChecked();
    await expect
      .element(getByRole('dialog').getByRole('status'))
      .toHaveTextContent('Métricas ativadas');
    expect(window.localStorage.getItem(METRICS_CONSENT_STORAGE_KEY)).toBe('granted');
  });

  test('when it is turned off, then the consent is revoked', async () => {
    window.localStorage.setItem(METRICS_CONSENT_STORAGE_KEY, 'granted');
    const { getByRole } = await openPrivacy();
    await clickLabelOf(getByRole('switch', { name: 'Métricas de uso' }));
    await expect
      .element(getByRole('dialog').getByRole('status'))
      .toHaveTextContent('Métricas desativadas');
    expect(window.localStorage.getItem(METRICS_CONSENT_STORAGE_KEY)).toBe('denied');
  });

  test('when Global Privacy Control is on, then the switch is disabled and explains why', async () => {
    turnOnGlobalPrivacyControl();
    const { getByRole } = await openPrivacy();
    await expect.element(getByRole('switch', { name: 'Métricas de uso' })).toBeDisabled();
    await expect.element(getByRole('dialog')).toHaveTextContent(/Global Privacy Control/);
  });
});
