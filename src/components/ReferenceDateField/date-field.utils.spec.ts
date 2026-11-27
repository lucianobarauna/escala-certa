import { CalendarDate } from '@internationalized/date';
import { describe, expect, test } from 'vitest';

import { isPartiallyFilled, toCalendarDate } from './date-field.utils';

function buildField(placeholders: boolean[]) {
  const field = document.createElement('div');
  field.innerHTML = placeholders
    .map(
      (isPlaceholder) => `<span data-type="day" ${isPlaceholder ? 'data-placeholder' : ''}></span>`,
    )
    .join('<span data-type="literal"></span>');
  return field;
}

describe('isPartiallyFilled', () => {
  test('is true when some segments are filled and others are empty', () => {
    expect(isPartiallyFilled(buildField([false, true, true]))).toBe(true);
  });

  test('is false when every segment is empty', () => {
    expect(isPartiallyFilled(buildField([true, true, true]))).toBe(false);
  });

  test('is false when every segment is filled', () => {
    expect(isPartiallyFilled(buildField([false, false, false]))).toBe(false);
  });

  test('ignores literal separators', () => {
    expect(isPartiallyFilled(buildField([false]))).toBe(false);
  });
});

test('converts any date value to a plain calendar date', () => {
  const converted = toCalendarDate(new CalendarDate(2026, 11, 26));
  expect(converted.toString()).toBe('2026-11-26');
});
