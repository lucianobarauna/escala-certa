import type { Page } from '@playwright/test';

export const METRICS_CONSENT_KEY = 'escala-certa:metrics-consent';

export function openHome(page: Page, search = '') {
  return page.goto(`./${search}`);
}

export function summary(page: Page) {
  return page.getByRole('status').filter({ hasText: /de 20\d\d:|Preencha|Escolha/ });
}

export function monthHeading(page: Page) {
  return page.getByRole('heading', { level: 2, name: /de 20\d\d$/ });
}

export async function chooseOption(page: Page, name: RegExp) {
  await page.getByRole('radio', { name }).locator('xpath=ancestor::label').click();
}

export async function typeDate(page: Page, digits: string) {
  await page.getByRole('spinbutton', { name: /dia/i }).click();
  await page.keyboard.type(digits);
}

export async function storeConsent(page: Page, choice: 'granted' | 'denied') {
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    [METRICS_CONSENT_KEY, choice],
  );
}

export async function hasHorizontalScroll(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
}
