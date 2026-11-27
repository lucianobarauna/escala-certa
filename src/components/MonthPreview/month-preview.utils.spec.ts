import { describe, expect, test } from 'vitest';

import {
  getFirstDayColumnClass,
  getPresentStates,
  getWeekdayShortName,
} from './month-preview.utils';

describe('getPresentStates', () => {
  test('lists only the states that appear in the month, in a fixed order', () => {
    expect(getPresentStates({ work: 15, off: 0, offExit: 15 })).toEqual(['work', 'off-exit']);
  });

  test('returns no state when every count is zero', () => {
    expect(getPresentStates({ work: 0, off: 0, offExit: 0 })).toEqual([]);
  });
});

describe('getWeekdayShortName', () => {
  test('starts the first day on the weekday given by the leading blanks', () => {
    expect(getWeekdayShortName(4, 0)).toBe('Qui');
  });

  test('wraps back to Sunday after Saturday', () => {
    expect(getWeekdayShortName(6, 1)).toBe('Dom');
  });
});

describe('getFirstDayColumnClass', () => {
  test('places the first day in the column after the leading blanks', () => {
    expect(getFirstDayColumnClass(3, 0)).toBe('@month-grid:col-start-4');
  });

  test('leaves the other days in the natural grid flow', () => {
    expect(getFirstDayColumnClass(3, 1)).toBeUndefined();
  });
});
