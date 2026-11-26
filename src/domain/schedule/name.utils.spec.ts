import { describe, expect, test } from 'vitest';

import { sanitizeName } from './name.utils';

describe('sanitizeName', () => {
  test('cuts at 40 characters', () => {
    expect(sanitizeName('a'.repeat(50))).toHaveLength(40);
  });

  test('removes control characters and trims', () => {
    expect(sanitizeName('  Ana\u0000\n Silva\t ')).toBe('Ana Silva');
  });

  test('preserves accents and emojis', () => {
    expect(sanitizeName('Escala da Mãe 👩‍⚕️')).toBe('Escala da Mãe 👩‍⚕️');
    expect(sanitizeName(`${'😀'.repeat(41)}`)).toBe('😀'.repeat(40));
  });
});
