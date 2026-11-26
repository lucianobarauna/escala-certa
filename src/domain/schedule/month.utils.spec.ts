import { CalendarDate } from '@internationalized/date';
import { describe, expect, test } from 'vitest';

import type { ScheduleDraft } from '@/types/schedule';

import { createEmptyDraft } from './config.utils';
import { buildMonth, getMonthLabel, shiftMonth } from './month.utils';

const TODAY = new CalendarDate(2026, 11, 26);

const SHIFT_DRAFT: ScheduleDraft = {
  ...createEmptyDraft(),
  type: 'shift',
  shift: { startDate: '2026-11-01', cycle: '24x48', turn: null },
};

function build(year: number, month: number, draft = SHIFT_DRAFT) {
  return buildMonth({ year, month, draft, today: TODAY });
}

describe('buildMonth', () => {
  test.each([
    [2027, 2, 28],
    [2028, 2, 29],
    [2026, 11, 30],
    [2026, 12, 31],
  ])('%i-%i has %i days', (year, month, expected) => {
    expect(build(year, month).days).toHaveLength(expected);
  });

  test.each([
    [2026, 3, 0],
    [2026, 6, 1],
    [2026, 9, 2],
    [2026, 7, 3],
    [2026, 10, 4],
    [2026, 5, 5],
    [2026, 8, 6],
  ])('%i-%i starts after %i blank days', (year, month, expected) => {
    expect(build(year, month).leadingBlanks).toBe(expected);
  });

  test('marks today only on the current day of the current month', () => {
    const todayDays = build(2026, 11).days.filter((day) => day.isToday);
    expect(todayDays.map((day) => day.day)).toEqual([26]);
    expect(build(2026, 12).days.some((day) => day.isToday)).toBe(false);
    expect(build(2025, 11).days.some((day) => day.isToday)).toBe(false);
  });

  test('has no state in any day when the schedule is incomplete', () => {
    const month = build(2026, 11, createEmptyDraft());
    expect(month.days.every((day) => day.state === null)).toBe(true);
    expect(month.counts).toEqual({ work: 0, off: 0, offExit: 0 });
  });

  test('counts the states of a complete schedule', () => {
    expect(build(2026, 11).counts).toEqual({ work: 10, off: 10, offExit: 10 });
  });
});

describe('shiftMonth', () => {
  test.each([
    [{ year: 2026, month: 12 }, 1, { year: 2027, month: 1 }],
    [{ year: 2026, month: 1 }, -1, { year: 2025, month: 12 }],
    [{ year: 2026, month: 11 }, 0, { year: 2026, month: 11 }],
    [{ year: 2026, month: 11 }, 120, { year: 2036, month: 11 }],
    [{ year: 2026, month: 11 }, -240, { year: 2006, month: 11 }],
  ])('moves %j by %i months to %j', (ref, delta, expected) => {
    expect(shiftMonth(ref, delta)).toEqual(expected);
  });
});

describe('getMonthLabel', () => {
  test('capitalizes the month name in pt-BR', () => {
    expect(getMonthLabel({ year: 2026, month: 11 })).toBe('Novembro de 2026');
    expect(getMonthLabel({ year: 2027, month: 3 })).toBe('Março de 2027');
  });
});
