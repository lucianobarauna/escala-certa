import type { Page } from '@playwright/test';

import { findSmallTargets, scanViolations, tabUntil } from './helpers/a11y.ts';
import { expect, test } from './helpers/fixtures.ts';
import { openHome } from './helpers/home-page.ts';
import { NIGHT_SHIFT_LINK, WEEKLY_ROTATION_LINK } from './helpers/schedule-links.ts';

type ScanState = {
  name: string;
  search: string;
  prepare?: (page: Page) => Promise<void>;
};

const STATES: ScanState[] = [
  { name: 'empty with consent banner', search: '' },
  { name: 'shift', search: NIGHT_SHIFT_LINK },
  { name: 'weekly', search: WEEKLY_ROTATION_LINK },
  {
    name: 'list at 200%',
    search: NIGHT_SHIFT_LINK,
    prepare: async (page) => {
      for (let step = 0; step < 4; step += 1)
        await page.getByRole('button', { name: 'Aumentar texto' }).click();
    },
  },
  {
    name: 'privacy dialog',
    search: NIGHT_SHIFT_LINK,
    prepare: (page) => page.getByRole('button', { name: 'Privacidade' }).click(),
  },
];

for (const colorScheme of ['light', 'dark'] as const) {
  for (const state of STATES) {
    test(`has no WCAG 2.2 AA violations: ${state.name}, ${colorScheme} theme`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await openHome(page, state.search);
      await state.prepare?.(page);
      expect(await scanViolations(page)).toEqual([]);
    });
  }
}

test('keyboard reaches the footer without getting trapped', async ({ page }) => {
  await openHome(page, NIGHT_SHIFT_LINK);
  expect(await tabUntil(page, 'Privacidade', 80)).toBeGreaterThan(0);
});

test('Esc closes the date popup and returns focus to the field', async ({ page }) => {
  await openHome(page, NIGHT_SHIFT_LINK);
  const opener = page.getByRole('button', { name: 'Abrir calendário' });
  await opener.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test('respects reduced motion when opening a dialog', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openHome(page, NIGHT_SHIFT_LINK);
  await page.getByRole('button', { name: 'Privacidade' }).click();
  const duration = await page
    .locator('[data-slot="dialog-content"]')
    .evaluate((element) => Number.parseFloat(getComputedStyle(element).animationDuration));
  expect(duration).toBeLessThanOrEqual(0.01);
});

test('every touch target is at least 24 by 24 px', async ({ page }) => {
  await openHome(page, WEEKLY_ROTATION_LINK);
  expect(await findSmallTargets(page)).toEqual([]);
});
