import { describe, expect, test } from 'vitest';

import { cn } from './utils';

describe('cn', () => {
  test('ignores falsy conditional classes', () => {
    const isHidden = false;
    const className = cn('px-2', isHidden && 'hidden', undefined, 'text-sm');
    expect(className).toBe('px-2 text-sm');
  });

  test('keeps the last class when Tailwind utilities conflict', () => {
    const className = cn('px-2 py-1', 'px-4');
    expect(className).toBe('py-1 px-4');
  });
});
