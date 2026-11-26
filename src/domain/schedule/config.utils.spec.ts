import { describe, expect, test } from 'vitest';

import type { ScheduleDraft } from '@/types/schedule';

import { changeModality, changeScheduleType, changeWeeks, createEmptyDraft } from './config.utils';

function weeklyDraft(weekly: Partial<ScheduleDraft['weekly']>): ScheduleDraft {
  const draft = createEmptyDraft();
  return { ...draft, type: 'weekly', weekly: { ...draft.weekly, ...weekly } };
}

describe('changeScheduleType', () => {
  test('keeps the fields of the other type', () => {
    const shift = { startDate: '2026-11-26', cycle: '24x48', turn: null } as const;
    const draft = { ...createEmptyDraft(), type: 'shift', shift } as const;
    const result = changeScheduleType(draft, 'weekly');
    expect(result.type).toBe('weekly');
    expect(result.shift).toEqual(shift);
  });
});

describe('changeModality', () => {
  test('clears the marked days and signals the notice', () => {
    const draft = weeklyDraft({ modality: '5x2', weeks: 2, offDays: [[0, 6], [1]] });
    const { draft: result, offDaysCleared } = changeModality(draft, '6x1');
    expect(result.weekly).toMatchObject({ modality: '6x1', offDays: [[], []] });
    expect(offDaysCleared).toBe(true);
  });

  test('does not signal the notice when nothing was marked', () => {
    expect(changeModality(weeklyDraft({}), '6x1').offDaysCleared).toBe(false);
  });

  test('keeps the days when the same modality is selected again', () => {
    const draft = weeklyDraft({ modality: '5x2', offDays: [[0, 6]] });
    const change = changeModality(draft, '5x2');
    expect(change.draft).toBe(draft);
    expect(change.offDaysCleared).toBe(false);
  });
});

describe('changeWeeks', () => {
  test('discards the extra weeks when reducing', () => {
    const draft = weeklyDraft({ weeks: 3, offDays: [[0], [1], [2]] });
    expect(changeWeeks(draft, 2).weekly).toMatchObject({ weeks: 2, offDays: [[0], [1]] });
  });

  test('adds empty weeks when increasing', () => {
    expect(changeWeeks(weeklyDraft({ offDays: [[0]] }), 3).weekly.offDays).toEqual([[0], [], []]);
  });

  test.each([
    [0, 1],
    [1, 1],
    [7, 7],
    [8, 7],
    [3.9, 3],
  ])('clamps %d weeks to %d', (requested, expected) => {
    expect(changeWeeks(weeklyDraft({}), requested).weekly.weeks).toBe(expected);
  });

  test('ignores a value that is not a number', () => {
    const draft = weeklyDraft({});
    expect(changeWeeks(draft, Number.NaN)).toBe(draft);
  });
});
