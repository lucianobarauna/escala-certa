import { expect, test } from './helpers/fixtures.ts';
import { monthHeading, openHome, summary } from './helpers/home-page.ts';
import { NIGHT_SHIFT_LINK, NIGHT_SHIFT_SUMMARY } from './helpers/schedule-links.ts';

test('navigates to distant months and returns to the current one', async ({ page }) => {
  await openHome(page, NIGHT_SHIFT_LINK);
  const next = page.getByRole('button', { name: 'Próximo mês' });
  for (let step = 0; step < 24; step += 1) await next.click();
  await expect(monthHeading(page)).toHaveText('Novembro de 2028');
  await expect(summary(page)).toHaveText(/^Novembro de 2028: \d+ dias de plantão/);
  await expect(
    page.getByText(/^1 de novembro de 2028, quarta-feira, (trabalha|folga)/),
  ).toBeAttached();
  await page.getByRole('button', { name: 'Voltar ao mês atual' }).click();
  await expect(monthHeading(page)).toHaveText('Novembro de 2026');
  await expect(summary(page)).toHaveText(NIGHT_SHIFT_SUMMARY);
});

test('goes back to previous years without limit', async ({ page }) => {
  await openHome(page, NIGHT_SHIFT_LINK);
  const previous = page.getByRole('button', { name: 'Mês anterior' });
  for (let step = 0; step < 36; step += 1) await previous.click();
  await expect(monthHeading(page)).toHaveText('Novembro de 2023');
});
