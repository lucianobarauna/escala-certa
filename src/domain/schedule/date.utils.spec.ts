import { CalendarDate } from '@internationalized/date';
import { describe, expect, test } from 'vitest';

import {
  daysBetween,
  isValidIsoDate,
  parseIsoDate,
  positiveModulo,
  startOfWeekSunday,
  toIsoDate,
} from './date.utils';

function date(year: number, month: number, day: number) {
  return new CalendarDate(year, month, day);
}

describe('daysBetween', () => {
  test('returns 0 for the same date', () => {
    expect(daysBetween(date(2026, 11, 26), date(2026, 11, 26))).toBe(0);
  });

  test('is positive for future dates and negative for past dates', () => {
    expect(daysBetween(date(2026, 11, 26), date(2026, 11, 30))).toBe(4);
    expect(daysBetween(date(2026, 11, 26), date(2026, 11, 20))).toBe(-6);
  });

  test.each([
    [2028, 366],
    [2027, 365],
  ])('counts the whole year %i through February 29th rules', (year, expected) => {
    expect(daysBetween(date(year, 1, 1), date(year + 1, 1, 1))).toBe(expected);
  });

  test('crosses the new year', () => {
    expect(daysBetween(date(2026, 12, 31), date(2027, 1, 1))).toBe(1);
  });

  test.each([
    ['America/Sao_Paulo DST end', date(2019, 2, 16), date(2019, 2, 18)],
    ['Pacific/Auckland DST start', date(2026, 9, 26), date(2026, 9, 28)],
    ['Pacific/Auckland DST end', date(2027, 4, 3), date(2027, 4, 5)],
    ['US DST start', date(2026, 3, 7), date(2026, 3, 9)],
  ])('counts 2 days around %s', (_label, from, to) => {
    expect(daysBetween(from, to)).toBe(2);
  });
});

describe('positiveModulo', () => {
  test.each([
    [-1, 3, 2],
    [-6, 3, 0],
    [0, 3, 0],
    [7, 3, 1],
  ])('positiveModulo(%i, %i) is %i', (value, divisor, expected) => {
    expect(positiveModulo(value, divisor)).toBe(expected);
  });
});

describe('startOfWeekSunday', () => {
  test('returns the same date on a Sunday', () => {
    expect(toIsoDate(startOfWeekSunday(date(2026, 11, 22)))).toBe('2026-11-22');
  });

  test.each([
    [date(2026, 11, 26), '2026-11-22'],
    [date(2026, 11, 28), '2026-11-22'],
    [date(2026, 12, 2), '2026-11-29'],
    [date(2027, 1, 1), '2026-12-27'],
  ])('moves %s back to the previous Sunday', (input, expected) => {
    expect(toIsoDate(startOfWeekSunday(input))).toBe(expected);
  });
});

describe('isValidIsoDate', () => {
  test.each(['2028-02-29', '2026-11-26', '1900-01-01', '2199-12-31'])('accepts %s', (value) => {
    expect(isValidIsoDate(value)).toBe(true);
  });

  test.each(['2027-02-29', '2026-02-30', '2026-13-01', 'abc', '', '2026-1-1'])(
    'rejects %j',
    (value) => {
      expect(isValidIsoDate(value)).toBe(false);
    },
  );

  test.each(['1899-12-31', '2200-01-01'])('rejects %s as out of range', (value) => {
    expect(isValidIsoDate(value)).toBe(false);
  });

  test('parses a valid date into the same calendar day', () => {
    expect(parseIsoDate('2026-11-26')?.day).toBe(26);
  });
});
