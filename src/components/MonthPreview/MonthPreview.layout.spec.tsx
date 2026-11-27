import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { shiftDraft } from '@/domain/schedule/fixtures/draft.builders';

import { getDayCell, renderPreview, TODAY_NAME } from './MonthPreview.test-utils';

const NIGHT_SHIFT = shiftDraft({ startDate: '2026-11-01', cycle: '12x36', turn: 'night' });
const GRID_COLUMNS = 7;

function getColumnCount() {
  const list = getDayCell(TODAY_NAME).closest('ul');
  if (!list) throw new Error('Lista de dias não encontrada');
  return getComputedStyle(list).gridTemplateColumns.split(' ').length;
}

function describeDays() {
  return [...document.querySelectorAll('ul > li')].map((cell) => [
    cell.querySelector('.sr-only')?.textContent,
    cell.querySelector('svg')?.getAttribute('class'),
  ]);
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 10, 26, 12));
});

afterEach(() => {
  vi.useRealTimers();
  document.documentElement.style.removeProperty('font-size');
});

describe('given the month preview', () => {
  test('when the container is wide, then it shows a 7-column grid', async () => {
    await renderPreview(NIGHT_SHIFT, '768px');
    expect(getColumnCount()).toBe(GRID_COLUMNS);
  });

  test('when the container is narrow, then it shows a single-column list', async () => {
    await renderPreview(NIGHT_SHIFT, '320px');
    expect(getColumnCount()).toBe(1);
  });

  test('when the text is enlarged to 200%, then the same width falls back to a list', async () => {
    document.documentElement.style.fontSize = '200%';
    await renderPreview(NIGHT_SHIFT, '768px');
    expect(getColumnCount()).toBe(1);
  });

  test('when the container is 320px wide, then nothing overflows horizontally', async () => {
    await renderPreview(NIGHT_SHIFT, '320px');
    const section = getDayCell(TODAY_NAME).closest('section');
    expect(section?.scrollWidth).toBeLessThanOrEqual(section?.clientWidth ?? 0);
  });

  test('when switching between list and grid, then names, icons and legend stay the same', async () => {
    const narrow = await renderPreview(NIGHT_SHIFT, '320px');
    const listDays = describeDays();
    const listLegend = narrow.getByRole('heading', { name: 'Legenda' }).element()
      .parentElement?.textContent;
    await narrow.unmount();
    const wide = await renderPreview(NIGHT_SHIFT, '768px');
    expect(describeDays()).toEqual(listDays);
    expect(
      wide.getByRole('heading', { name: 'Legenda' }).element().parentElement?.textContent,
    ).toBe(listLegend);
  });
});
