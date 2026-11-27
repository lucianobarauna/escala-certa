import { afterEach, describe, expect, test } from 'vitest';
import { commands, page } from 'vitest/browser';

import { shiftDraft } from '@/domain/schedule/fixtures/draft.builders';
import { serializeSchedule } from '@/domain/schedule/schedule-url.utils';

import { openWith, renderHome, setupHomeEnvironment } from './HomeView.test-utils';

setupHomeEnvironment();

const TODAY_NAME = '26 de novembro de 2026, quinta-feira, hoje, folga, saída do plantão pela manhã';
const DESKTOP_WIDTH = 1280;
const DESKTOP_HEIGHT = 900;

function todayCell() {
  return page.getByText(TODAY_NAME).element().closest('li');
}

function dayColumns() {
  const list = todayCell()?.closest('ul');
  return list ? getComputedStyle(list).gridTemplateColumns.split(' ').length : 0;
}

afterEach(async () => {
  await commands.emulateColorScheme('light');
});

describe('given a complete schedule on a desktop screen', () => {
  test('when the text is at 100%, then the month is a 7-column grid', async () => {
    await page.viewport(DESKTOP_WIDTH, DESKTOP_HEIGHT);
    openWith(
      serializeSchedule(shiftDraft({ startDate: '2026-11-01', cycle: '12x36', turn: 'night' })),
    );
    await renderHome();
    await expect.poll(dayColumns).toBe(7);
  });

  test('when the text is at 200%, then the month becomes a list without horizontal scroll', async () => {
    await page.viewport(DESKTOP_WIDTH, DESKTOP_HEIGHT);
    openWith(
      serializeSchedule(shiftDraft({ startDate: '2026-11-01', cycle: '12x36', turn: 'night' })),
    );
    await renderHome();
    for (let step = 0; step < 4; step += 1)
      await page.getByRole('button', { name: 'Aumentar texto' }).click();
    await expect.element(page.getByText('Texto em 200%')).toBeVisible();
    await expect.poll(dayColumns).toBe(1);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );
  });
});

describe('given the system color scheme', () => {
  test('when it is dark, then the dark theme applies and day states keep their icons', async () => {
    openWith(
      serializeSchedule(shiftDraft({ startDate: '2026-11-01', cycle: '12x36', turn: 'night' })),
    );
    await renderHome();
    const lightBackground = getComputedStyle(document.body).backgroundColor;
    await commands.emulateColorScheme('dark');
    await expect
      .poll(() => getComputedStyle(document.body).backgroundColor)
      .not.toBe(lightBackground);
    expect(todayCell()?.querySelector('svg.lucide-sunrise')).not.toBeNull();
    expect(todayCell()?.textContent).toContain('Hoje');
  });
});
