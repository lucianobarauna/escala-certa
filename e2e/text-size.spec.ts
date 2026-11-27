import { expect, test } from './helpers/fixtures.ts';
import { hasHorizontalScroll, openHome } from './helpers/home-page.ts';
import { NIGHT_SHIFT_LINK, TODAY_NAME } from './helpers/schedule-links.ts';

const SMALL_PHONE = { width: 320, height: 640 };
const ZOOM_400_EQUIVALENT = { width: 320, height: 256 };

async function listColumns(page: import('@playwright/test').Page) {
  return page.getByText(TODAY_NAME).evaluate((label) => {
    const list = label.closest('ul');
    return list ? getComputedStyle(list).gridTemplateColumns.split(' ').length : 0;
  });
}

async function increaseToMax(page: import('@playwright/test').Page) {
  const increase = page.getByRole('button', { name: 'Aumentar texto' });
  for (let step = 0; step < 4; step += 1) await increase.click();
  await expect(page.getByText('Texto em 200%')).toBeVisible();
}

test('text at 200% is remembered after reloading and shows the month as a list', async ({
  page,
}) => {
  await openHome(page, NIGHT_SHIFT_LINK);
  await increaseToMax(page);
  await page.reload();
  await expect(page.getByText('Texto em 200%')).toBeVisible();
  expect(await listColumns(page)).toBe(1);
});

test('at 320 px with text at 200% there is no horizontal scroll', async ({ page }) => {
  await page.setViewportSize(SMALL_PHONE);
  await openHome(page, NIGHT_SHIFT_LINK);
  await increaseToMax(page);
  expect(await hasHorizontalScroll(page)).toBe(false);
});

test('at a viewport equivalent to 400% zoom there is no horizontal scroll', async ({ page }) => {
  await page.setViewportSize(ZOOM_400_EQUIVALENT);
  await openHome(page, NIGHT_SHIFT_LINK);
  await expect(page.getByText(TODAY_NAME)).toBeAttached();
  expect(await hasHorizontalScroll(page)).toBe(false);
  expect(await listColumns(page)).toBe(1);
});
