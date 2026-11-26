import { describe, expect, test } from 'vitest';

import type { ScheduleDraft } from '@/types/schedule';

import { createEmptyDraft } from './config.utils';
import { isWeekIncomplete, toggleOffDay } from './off-days.utils';

function weeklyDraft(weekly: Partial<ScheduleDraft['weekly']>): ScheduleDraft {
  const draft = createEmptyDraft();
  return { ...draft, type: 'weekly', weekly: { ...draft.weekly, ...weekly } };
}

describe('toggleOffDay', () => {
  test('marks and unmarks a day', () => {
    const draft = weeklyDraft({ modality: '5x2' });
    const marked = toggleOffDay(draft, { week: 0, day: 3 });
    expect(marked.weekly.offDays).toEqual([[3]]);
    expect(toggleOffDay(marked, { week: 0, day: 3 }).weekly.offDays).toEqual([[]]);
  });

  test.each([
    ['5x2', [0, 6], 3],
    ['6x1', [0], 1],
  ] as const)('refuses an extra day in %s', (modality, marked, extra) => {
    const draft = weeklyDraft({ modality, offDays: [[...marked]] });
    expect(toggleOffDay(draft, { week: 0, day: extra })).toBe(draft);
  });

  test('refuses marking without modality or in an unknown week', () => {
    const draft = weeklyDraft({});
    expect(toggleOffDay(draft, { week: 0, day: 1 })).toBe(draft);
    expect(toggleOffDay(draft, { week: 5, day: 1 })).toBe(draft);
  });
});

describe('isWeekIncomplete', () => {
  test.each([
    ['5x2', [[0]], true],
    ['5x2', [[0, 6]], false],
    [null, [[]], false],
  ] as const)('%s with %j is %s', (modality, offDays, expected) => {
    const { weekly } = weeklyDraft({ modality, offDays: offDays.map((days) => [...days]) });
    expect(isWeekIncomplete(weekly, 0)).toBe(expected);
  });
});
