import { describe, expect, test } from 'vitest';

import { getDocumentTitle, hasScheduleInUrl } from './home-view.utils';

describe('getDocumentTitle', () => {
  test('uses the app name when there is no schedule name', () => {
    expect(getDocumentTitle('  ')).toBe('Escala Certa');
  });

  test('puts the schedule name before the app name', () => {
    expect(getDocumentTitle('Escala da Ana')).toBe('Escala da Ana · Escala Certa');
  });
});

describe('hasScheduleInUrl', () => {
  test('is true when the link carries a schedule version', () => {
    expect(hasScheduleInUrl('?v=1&t=shift')).toBe(true);
  });

  test('is false for a plain visit', () => {
    expect(hasScheduleInUrl('')).toBe(false);
  });
});
