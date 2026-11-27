import { expect, test } from 'vitest';

import { findOption } from './options';

const OPTIONS = ['a', 'b'] as const;

test('returns the option that matches the value', () => {
  expect(findOption(OPTIONS, 'b')).toBe('b');
});

test('returns undefined when the value is not one of the options', () => {
  expect(findOption(OPTIONS, 'c')).toBeUndefined();
});
