import { expect, test } from './helpers/fixtures.ts';
import { openHome } from './helpers/home-page.ts';
import { NIGHT_SHIFT_LINK } from './helpers/schedule-links.ts';

const PREVIEW_BUDGET_MS = 100;
const USABLE_BUDGET_MS = 3000;
const SLOW_4G = {
  offline: false,
  latency: 150,
  downloadThroughput: 204_800,
  uploadThroughput: 96_000,
};
const CPU_SLOWDOWN = 4;

test('the preview reflects a change in under 100 ms', async ({ page }) => {
  await openHome(page, NIGHT_SHIFT_LINK);
  const elapsed = await page.evaluate(
    () =>
      new Promise<number>((resolve, reject) => {
        const status = [...document.querySelectorAll('output')].find((output) =>
          /de 20\d\d:/.test(output.textContent ?? ''),
        );
        const label = [...document.querySelectorAll('label')].find((element) =>
          element.textContent?.startsWith('24x48'),
        );
        if (!status || !label) return reject(new Error('Resumo ou opção 24x48 não encontrados'));
        const before = status.textContent;
        const start = performance.now();
        const observer = new MutationObserver(() => {
          if (status.textContent === before) return;
          observer.disconnect();
          resolve(performance.now() - start);
        });
        observer.observe(status, { childList: true, characterData: true, subtree: true });
        label.click();
      }),
  );
  expect(elapsed).toBeLessThan(PREVIEW_BUDGET_MS);
});

test('the page is usable in under 3 s on a mid-range 4G connection', async ({ page }) => {
  const session = await page.context().newCDPSession(page);
  await session.send('Network.enable');
  await session.send('Network.emulateNetworkConditions', SLOW_4G);
  await session.send('Emulation.setCPUThrottlingRate', { rate: CPU_SLOWDOWN });
  const startedAt = Date.now();
  await openHome(page);
  await expect(page.getByRole('radio', { name: /^Plantão/ })).toBeEnabled();
  expect(Date.now() - startedAt).toBeLessThan(USABLE_BUDGET_MS);
});
