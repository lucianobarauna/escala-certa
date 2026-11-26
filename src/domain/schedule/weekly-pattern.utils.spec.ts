import { CalendarDate } from '@internationalized/date';
import { describe, expect, test } from 'vitest';

import type { DayState } from '@/types/schedule';

import { getWeeklyDayState } from './weekly-pattern.utils';

const SUNDAY = new CalendarDate(2026, 11, 22);

type PatternInput = { offDays: number[][]; anchor?: CalendarDate };

function stateOn(date: CalendarDate, { offDays, anchor = SUNDAY }: PatternInput): DayState {
  return getWeeklyDayState({ weeks: offDays.length, offDays, anchorDate: anchor }, date);
}

function statesFrom(start: CalendarDate, length: number, input: PatternInput) {
  return Array.from({ length }, (_, offset) => stateOn(start.add({ days: offset }), input));
}

describe('given a fixed weekly pattern', () => {
  test('5x2 with Saturday and Sunday off marks them in any month', () => {
    const input = { offDays: [[0, 6]] };
    const months = [new CalendarDate(2026, 11, 1), new CalendarDate(2027, 2, 1)];
    months.forEach((first) => {
      const offDates = statesFrom(first, 28, input).flatMap((state, offset) =>
        state === 'off' ? [first.add({ days: offset }).toDate('UTC').getUTCDay()] : [],
      );
      expect(new Set(offDates)).toEqual(new Set([0, 6]));
      expect(offDates).toHaveLength(8);
    });
  });

  test('6x1 with Sunday off marks only Sundays', () => {
    const states = statesFrom(SUNDAY, 14, { offDays: [[0]] });
    expect(states.filter((state) => state === 'off')).toHaveLength(2);
    expect(states[0]).toBe('off');
    expect(states[7]).toBe('off');
  });

  test('a week without marked days is all work', () => {
    expect(new Set(statesFrom(SUNDAY, 21, { offDays: [[]] }))).toEqual(new Set(['work']));
  });

  test('never produces off-exit', () => {
    expect(statesFrom(SUNDAY, 60, { offDays: [[0], [3, 4]] })).not.toContain('off-exit');
  });
});

describe('given a rotating pattern', () => {
  test('2 weeks alternate on each Sunday', () => {
    const input = { offDays: [[0], [1]] };
    expect(stateOn(SUNDAY, input)).toBe('off');
    expect(stateOn(SUNDAY.add({ days: 7 }), input)).toBe('work');
    expect(stateOn(SUNDAY.add({ days: 8 }), input)).toBe('off');
    expect(stateOn(SUNDAY.add({ days: 14 }), input)).toBe('off');
  });

  test('7 weeks where the day off advances one day per week repeats over 14 weeks', () => {
    const offDays = Array.from({ length: 7 }, (_, week) => [week]);
    const offDates = statesFrom(SUNDAY, 98, { offDays }).flatMap((state, offset) =>
      state === 'off' ? [offset] : [],
    );
    const expected = Array.from({ length: 14 }, (_, week) => week * 7 + (week % 7));
    expect(offDates).toEqual(expected);
  });
});

describe('given the anchor date', () => {
  test.each([
    ['in the middle of the week', new CalendarDate(2026, 11, 25)],
    ['on Sunday', new CalendarDate(2026, 11, 22)],
    ['on Saturday', new CalendarDate(2026, 11, 28)],
  ])('%s, week 1 is the Sunday to Saturday week containing it', (_label, anchor) => {
    const input = { offDays: [[0], []], anchor };
    expect(stateOn(new CalendarDate(2026, 11, 22), input)).toBe('off');
    expect(stateOn(new CalendarDate(2026, 11, 29), input)).toBe('work');
  });

  test('weeks before the anchor keep the pattern', () => {
    const input = { offDays: [[0], [], []] };
    expect(stateOn(SUNDAY.subtract({ days: 7 }), input)).toBe('work');
    expect(stateOn(SUNDAY.subtract({ days: 14 }), input)).toBe('work');
    expect(stateOn(SUNDAY.subtract({ days: 21 }), input)).toBe('off');
  });

  test('crosses new year and February 29th without shifting', () => {
    const newYear = { offDays: [[4]], anchor: new CalendarDate(2026, 12, 27) };
    expect(stateOn(new CalendarDate(2027, 12, 30), newYear)).toBe('off');
    expect(stateOn(new CalendarDate(2028, 3, 2), { offDays: [[4]] })).toBe('off');
  });
});
