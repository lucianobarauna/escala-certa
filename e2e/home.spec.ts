import { expect, test } from '@playwright/test';

test('opens the home page with the schedule input and the current month preview', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1, name: 'Escala Certa' })).toBeVisible();
  await expect(page.getByRole('radiogroup', { name: 'Tipo de escala' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Próximo mês' })).toBeVisible();
});
