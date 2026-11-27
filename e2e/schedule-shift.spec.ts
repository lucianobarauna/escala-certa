import { expect, test } from './helpers/fixtures.ts';
import { chooseOption, openHome, summary, typeDate } from './helpers/home-page.ts';
import { NIGHT_SHIFT_LINK, NIGHT_SHIFT_SUMMARY, TODAY_NAME } from './helpers/schedule-links.ts';

const ONE_MINUTE_MS = 60_000;

test('a shift worker sets up a 12x36 night shift and reopens it after reloading', async ({
  page,
}) => {
  const startedAt = Date.now();
  await openHome(page);
  await chooseOption(page, /^Plantão/);
  await typeDate(page, '01112026');
  await chooseOption(page, /^12x36/);
  await chooseOption(page, /^Noturno/);
  await expect(summary(page)).toHaveText(NIGHT_SHIFT_SUMMARY);
  expect(Date.now() - startedAt).toBeLessThan(ONE_MINUTE_MS);
  await expect(page.getByText(TODAY_NAME)).toBeAttached();
  await expect(page.getByText('Hoje', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Legenda' })).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`${NIGHT_SHIFT_LINK.replace('?', '\\?')}$`));
  await page.reload();
  await expect(page.getByRole('radio', { name: /^Noturno/ })).toBeChecked();
  await expect(summary(page)).toHaveText(NIGHT_SHIFT_SUMMARY);
});
