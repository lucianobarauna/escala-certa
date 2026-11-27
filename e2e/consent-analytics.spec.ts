import { expect, test } from './helpers/fixtures.ts';
import { readAnalyticsCookies, readDataLayer } from './helpers/google.ts';
import { chooseOption, openHome, summary } from './helpers/home-page.ts';
import { NAMED_NIGHT_SHIFT_LINK, NIGHT_SHIFT_SUMMARY } from './helpers/schedule-links.ts';

const BASE_PAGE_LOCATION = 'http://localhost:4173/escala-certa/';

function gtagPayloads(layer: unknown[][]) {
  return layer.filter(([command]) => command === 'config' || command === 'event');
}

test('nothing reaches Google and no _ga cookie exists before accepting', async ({
  page,
  google,
}) => {
  await openHome(page, NAMED_NIGHT_SHIFT_LINK);
  await chooseOption(page, /^24x48/);
  expect(google.requests).toHaveLength(0);
  expect(await readAnalyticsCookies(page)).toHaveLength(0);
});

test('after accepting, events carry only the base location and a fixed title', async ({
  page,
  google,
}) => {
  await openHome(page, NAMED_NIGHT_SHIFT_LINK);
  await page.getByRole('button', { name: 'Aceitar métricas' }).click();
  await chooseOption(page, /^24x48/);
  await expect.poll(() => google.requests.length).toBeGreaterThan(0);
  const payloads = gtagPayloads(await readDataLayer(page));
  const names = payloads.map(([, name]) => name);
  expect(names).toEqual(expect.arrayContaining(['page_view', 'schedule_completed']));
  payloads.forEach(([, , params]) => {
    expect(params).toMatchObject({ page_location: BASE_PAGE_LOCATION, page_title: 'Escala Certa' });
  });
  expect(JSON.stringify(payloads)).not.toMatch(/Ana|2026-11-01|\?v=1/);
});

test('refusing keeps zero requests to Google', async ({ page, google }) => {
  await openHome(page, NAMED_NIGHT_SHIFT_LINK);
  await page.getByRole('button', { name: 'Recusar métricas' }).click();
  await chooseOption(page, /^24x48/);
  expect(google.requests).toHaveLength(0);
});

test('Global Privacy Control hides the banner and keeps zero requests', async ({
  page,
  google,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'globalPrivacyControl', { value: true, configurable: true }),
  );
  await openHome(page, NAMED_NIGHT_SHIFT_LINK);
  await expect(page.getByRole('button', { name: 'Privacidade' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Aceitar métricas' })).toHaveCount(0);
  expect(google.requests).toHaveLength(0);
});

test('revoking in the privacy text stops sending and deletes the cookies', async ({
  page,
  context,
}) => {
  await openHome(page, NAMED_NIGHT_SHIFT_LINK);
  await page.getByRole('button', { name: 'Aceitar métricas' }).click();
  await context.addCookies([{ name: '_ga', value: 'GA1.1.1', domain: 'localhost', path: '/' }]);
  await page.getByRole('button', { name: 'Privacidade' }).click();
  await page
    .getByRole('switch', { name: 'Métricas de uso' })
    .locator('xpath=ancestor::label')
    .click();
  await expect(page.getByText('Métricas desativadas')).toBeVisible();
  const eventsBefore = gtagPayloads(await readDataLayer(page)).length;
  await page.keyboard.press('Escape');
  await chooseOption(page, /^24x48/);
  expect(gtagPayloads(await readDataLayer(page))).toHaveLength(eventsBefore);
  expect(await readAnalyticsCookies(page)).toHaveLength(0);
});

test('a blocked GA script causes no visible error', async ({ page, google }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  google.failScript();
  await openHome(page, NAMED_NIGHT_SHIFT_LINK);
  await page.getByRole('button', { name: 'Aceitar métricas' }).click();
  await expect(summary(page)).toHaveText(NIGHT_SHIFT_SUMMARY);
  await expect(page.getByRole('alert')).toHaveCount(0);
  expect(errors).toHaveLength(0);
});
