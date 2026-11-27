import { expect, test } from './helpers/fixtures.ts';
import { openHome, summary } from './helpers/home-page.ts';
import { NIGHT_SHIFT_LINK, NIGHT_SHIFT_SUMMARY } from './helpers/schedule-links.ts';

test('opens the privacy text without losing the schedule and closes with Esc', async ({ page }) => {
  await openHome(page, NIGHT_SHIFT_LINK);
  const trigger = page.getByRole('button', { name: 'Privacidade' });
  await trigger.click();
  await expect(page.getByRole('dialog', { name: 'Privacidade' })).toBeVisible();
  await expect(page).toHaveURL(/c=12x36&s=night&d=2026-11-01/);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(summary(page)).toHaveText(NIGHT_SHIFT_SUMMARY);
});

test('turns metrics on and off from the privacy text', async ({ page }) => {
  await openHome(page, NIGHT_SHIFT_LINK);
  await page.getByRole('button', { name: 'Privacidade' }).click();
  const toggle = page
    .getByRole('switch', { name: 'Métricas de uso' })
    .locator('xpath=ancestor::label');
  await toggle.click();
  await expect(page.getByText('Métricas ativadas')).toBeVisible();
  await toggle.click();
  await expect(page.getByText('Métricas desativadas')).toBeVisible();
});
