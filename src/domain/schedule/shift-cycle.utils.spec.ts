import { CalendarDate } from '@internationalized/date';
import { describe, expect, test } from 'vitest';

import type { DayState, ShiftVariant } from '@/types/schedule';

import { SHIFT_CYCLE_PATTERNS } from './schedule.constants';
import { getShiftDayState, getShiftVariant } from './shift-cycle.utils';

const START = new CalendarDate(2026, 11, 15);

function stateAt(variant: ShiftVariant, offset: number, startDate = START): DayState {
  return getShiftDayState({ variant, startDate }, startDate.add({ days: offset }));
}

const RF08_TABLE: [ShiftVariant, DayState[]][] = [
  ['12x36-day', ['work', 'off']],
  ['12x36-night', ['work', 'off-exit']],
  ['24x48', ['work', 'off-exit', 'off']],
  ['24x72', ['work', 'off-exit', 'off', 'off']],
];

describe('given each shift variant from the RF08 table', () => {
  test.each(RF08_TABLE)(
    'when %s is projected, then it matches the table in both directions',
    (variant, cycle) => {
      const offsets = Array.from(
        { length: cycle.length * 2 + 1 },
        (_, index) => index - cycle.length,
      );
      offsets.forEach((offset) => {
        expect(stateAt(variant, offset)).toBe(
          cycle[((offset % cycle.length) + cycle.length) % cycle.length],
        );
      });
    },
  );

  test('the table in the constants is the RF08 table', () => {
    expect(Object.entries(SHIFT_CYCLE_PATTERNS)).toEqual(RF08_TABLE);
  });
});

describe('given a 12x36 shift', () => {
  test('day: alternates work and off', () => {
    expect([0, 1, 2].map((offset) => stateAt('12x36-day', offset))).toEqual([
      'work',
      'off',
      'work',
    ]);
  });

  test('night: never produces a full off day', () => {
    const states = Array.from({ length: 30 }, (_, offset) => stateAt('12x36-night', offset));
    expect(states).not.toContain('off');
  });
});

describe('given dates before the start date', () => {
  test.each(RF08_TABLE)(
    '%s: day -1 is the last state and day -length repeats day 0',
    (variant, cycle) => {
      expect(stateAt(variant, -1)).toBe(cycle.at(-1));
      expect(stateAt(variant, -cycle.length)).toBe('work');
    },
  );

  test('a reference in the middle of the month fills the earlier days', () => {
    const start = new CalendarDate(2026, 11, 20);
    const states = [1, 2, 3].map((day) =>
      getShiftDayState({ variant: '24x48', startDate: start }, new CalendarDate(2026, 11, day)),
    );
    expect(states).toEqual(['off', 'work', 'off-exit']);
  });
});

describe('given far dates and calendar edge cases', () => {
  test.each([3650, -3650])('keeps the cycle correct %i days away', (offset) => {
    const expected = SHIFT_CYCLE_PATTERNS['24x72'][((offset % 4) + 4) % 4];
    expect(stateAt('24x72', offset)).toBe(expected);
  });

  test('is not shifted when crossing new year, February 29th and DST dates', () => {
    const start = new CalendarDate(2028, 2, 27);
    const states = [0, 1, 2, 3].map((offset) => stateAt('24x72', offset, start));
    expect(states).toEqual(['work', 'off-exit', 'off', 'off']);
    expect(stateAt('24x48', 3, new CalendarDate(2026, 12, 30))).toBe('work');
  });
});

describe('getShiftVariant', () => {
  test.each([
    [{ startDate: null, cycle: '24x48', turn: null }, '24x48'],
    [{ startDate: null, cycle: '12x36', turn: 'night' }, '12x36-night'],
    [{ startDate: null, cycle: '12x36', turn: null }, null],
    [{ startDate: null, cycle: null, turn: 'day' }, null],
  ] as const)('maps %j to %s', (shift, expected) => {
    expect(getShiftVariant(shift)).toBe(expected);
  });
});
