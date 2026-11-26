import { CalendarDate } from '@internationalized/date';
import { describe, expect, test } from 'vitest';

import { getDayName } from './day-name.utils';

const NOV_26 = new CalendarDate(2026, 11, 26);

describe('getDayName', () => {
  test.each([
    [new CalendarDate(2026, 11, 15), 'work', false, '15 de novembro de 2026, domingo, trabalha'],
    [NOV_26, 'off', true, '26 de novembro de 2026, quinta-feira, hoje, folga'],
    [
      new CalendarDate(2026, 11, 2),
      'off-exit',
      false,
      '2 de novembro de 2026, segunda-feira, folga, saída do plantão pela manhã',
    ],
    [
      NOV_26,
      'off-exit',
      true,
      '26 de novembro de 2026, quinta-feira, hoje, folga, saída do plantão pela manhã',
    ],
    [NOV_26, null, false, '26 de novembro de 2026, quinta-feira'],
    [NOV_26, null, true, '26 de novembro de 2026, quinta-feira, hoje'],
  ] as const)('case %#', (...args) => {
    const [date, state, isToday, expected] = args;
    expect(getDayName({ date, state, isToday })).toBe(expected);
  });

  test('uses "1" for the first day instead of the ordinal "1º"', () => {
    const name = getDayName({ date: new CalendarDate(2026, 11, 1), state: 'work', isToday: false });
    expect(name).toBe('1 de novembro de 2026, domingo, trabalha');
  });
});
