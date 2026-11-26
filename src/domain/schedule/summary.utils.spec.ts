import { CalendarDate } from '@internationalized/date';
import { describe, expect, test } from 'vitest';

import type { ScheduleDraft } from '@/types/schedule';

import { createEmptyDraft } from './config.utils';
import { buildMonth } from './month.utils';
import { summarizeMonth } from './summary.utils';

const TODAY = new CalendarDate(2026, 11, 26);

function shiftDraft(startDate: string, cycle: '12x36' | '24x48', turn: 'day' | 'night' | null) {
  return {
    ...createEmptyDraft(),
    type: 'shift',
    shift: { startDate, cycle, turn },
  } as ScheduleDraft;
}

function summarize(year: number, month: number, draft: ScheduleDraft) {
  return summarizeMonth({ month: buildMonth({ year, month, draft, today: TODAY }), draft });
}

const WEEKENDS_OFF: ScheduleDraft = {
  ...createEmptyDraft(),
  type: 'weekly',
  weekly: { modality: '5x2', weeks: 1, offDays: [[0, 6]], anchorDate: '2026-11-22' },
};

describe('summarizeMonth', () => {
  test('weekly schedule', () => {
    expect(summarize(2026, 11, WEEKENDS_OFF)).toBe(
      'Novembro de 2026: 21 dias trabalhando, 9 dias de folga',
    );
  });

  test('24x48 shows how many offs are shift exits', () => {
    const draft = shiftDraft('2026-12-01', '24x48', null);
    expect(summarize(2026, 12, draft)).toBe(
      'Dezembro de 2026: 11 dias de plantão, 20 dias de folga (10 com saída do plantão pela manhã)',
    );
  });

  test('12x36 night says all offs are shift exits', () => {
    const draft = shiftDraft('2026-11-01', '12x36', 'night');
    expect(summarize(2026, 11, draft)).toBe(
      'Novembro de 2026: 15 dias de plantão, 15 dias de folga (todos com saída do plantão pela manhã)',
    );
  });

  test('12x36 day has no parentheses', () => {
    const draft = shiftDraft('2026-11-01', '12x36', 'day');
    expect(summarize(2026, 11, draft)).toBe(
      'Novembro de 2026: 15 dias de plantão, 15 dias de folga',
    );
  });

  test('uses singular for one day and plural for zero', () => {
    const month = {
      year: 2026,
      month: 11,
      leadingBlanks: 0,
      days: [],
      counts: { work: 1, off: 1, offExit: 0 },
    };
    expect(summarizeMonth({ month, draft: WEEKENDS_OFF })).toBe(
      'Novembro de 2026: 1 dia trabalhando, 1 dia de folga',
    );
    const empty = { ...month, counts: { work: 0, off: 0, offExit: 0 } };
    expect(summarizeMonth({ month: empty, draft: WEEKENDS_OFF })).toContain(
      '0 dias trabalhando, 0 dias de folga',
    );
  });

  test('summary counts match the days of the grid', () => {
    const month = buildMonth({ year: 2026, month: 11, draft: WEEKENDS_OFF, today: TODAY });
    const offDays = month.days.filter((day) => day.state === 'off').length;
    expect(summarizeMonth({ month, draft: WEEKENDS_OFF })).toContain(`${offDays} dias de folga`);
  });

  test('returns the guidance when the schedule is incomplete', () => {
    const draft = createEmptyDraft();
    expect(summarize(2026, 11, draft)).toBe(
      'Escolha o tipo de escala para ver os dias no calendário.',
    );
  });
});
