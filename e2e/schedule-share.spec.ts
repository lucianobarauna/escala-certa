import { expect, test } from './helpers/fixtures.ts';
import { chooseOption, openHome } from './helpers/home-page.ts';
import { NAMED_NIGHT_SHIFT_LINK } from './helpers/schedule-links.ts';

test('the native share menu receives the link and a text with the name', async ({ page }) => {
  await page.addInitScript(() => {
    Reflect.set(window, '__shared', null);
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: async (data: ShareData) => Reflect.set(window, '__shared', data),
    });
  });
  await openHome(page, NAMED_NIGHT_SHIFT_LINK);
  await page.getByRole('button', { name: 'Compartilhar escala' }).click();
  const shared = await page.evaluate(() => Reflect.get(window, '__shared'));
  expect(shared).toMatchObject({
    text: 'Escala da Ana: veja a escala no Escala Certa',
    url: expect.stringContaining(NAMED_NIGHT_SHIFT_LINK),
  });
});

test('without the native menu the link is copied and announced', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.addInitScript(() => Object.defineProperty(navigator, 'share', { value: undefined }));
  await openHome(page, NAMED_NIGHT_SHIFT_LINK);
  await page.getByRole('button', { name: 'Compartilhar escala' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Link copiado' })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    NAMED_NIGHT_SHIFT_LINK,
  );
});

test('the recipient sees the name, adjusts the schedule and gets a new URL', async ({ page }) => {
  await openHome(page, NAMED_NIGHT_SHIFT_LINK);
  await expect(page.getByText('Escala da Ana', { exact: true })).toBeVisible();
  await expect(page).toHaveTitle('Escala da Ana · Escala Certa');
  await chooseOption(page, /^Diurno/);
  await expect(page).toHaveURL(/s=day/);
});
