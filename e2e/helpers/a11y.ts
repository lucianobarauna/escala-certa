import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const MIN_TARGET_SIZE = 24;
const LABEL_PREVIEW_LENGTH = 30;
const INTERACTIVE_SELECTOR = 'button, a[href], input, [role="switch"]';

export async function scanViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  return results.violations.map(({ id, nodes }) => ({
    id,
    targets: nodes.map((node) => node.target.join(' ')),
  }));
}

export function findSmallTargets(page: Page) {
  return page.evaluate(
    ([selector, minSize, previewLength]) =>
      [...document.querySelectorAll<HTMLElement>(selector)]
        .map((element) => element.closest('label') ?? element)
        .filter((target) => target.offsetParent !== null)
        .map((target) => ({ target, rect: target.getBoundingClientRect() }))
        .filter(({ rect }) => rect.width < minSize || rect.height < minSize)
        .map(
          ({ target, rect }) =>
            `${target.textContent?.trim().slice(0, previewLength)} ${rect.width}x${rect.height}`,
        ),
    [INTERACTIVE_SELECTOR, MIN_TARGET_SIZE, LABEL_PREVIEW_LENGTH] as const,
  );
}

export async function tabUntil(page: Page, accessibleName: string, maxSteps: number) {
  for (let step = 0; step < maxSteps; step += 1) {
    await page.keyboard.press('Tab');
    const name = await page.evaluate(() => {
      const active = document.activeElement;
      return active?.getAttribute('aria-label') ?? active?.textContent?.trim() ?? '';
    });
    if (name === accessibleName) return step + 1;
  }
  return -1;
}
