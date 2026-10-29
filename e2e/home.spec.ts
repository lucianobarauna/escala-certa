import { expect, test } from '@playwright/test';

test('increments the counter when the user clicks the button', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Increment' }).click();
  await expect(page.getByText('Hello Vitest x2!')).toBeVisible();
});
