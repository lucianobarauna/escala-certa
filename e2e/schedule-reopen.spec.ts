import { expect, test } from './helpers/fixtures.ts';
import { chooseOption, monthHeading, openHome } from './helpers/home-page.ts';
import { HAND_EDITED_LINK, OLD_SHIFT_LINK } from './helpers/schedule-links.ts';

test('an old saved link opens in the current month with today highlighted', async ({ page }) => {
  await openHome(page, OLD_SHIFT_LINK);
  await expect(monthHeading(page)).toHaveText('Novembro de 2026');
  await expect(page.getByText(/^26 de novembro de 2026, quinta-feira, hoje, /)).toBeAttached();
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('a hand-edited link shows a warning and keeps the form usable', async ({ page }) => {
  await openHome(page, HAND_EDITED_LINK);
  await expect(page.getByRole('alert')).toContainText('data de referência do link é inválida');
  await expect(page.getByRole('radio', { name: /^24x48/ })).toBeChecked();
  await chooseOption(page, /^24x72/);
  await expect(page.getByRole('radio', { name: /^24x72/ })).toBeChecked();
});
