import { CalendarDate } from '@internationalized/date';
import { describe, expect, test } from 'vitest';

import type { ScheduleDraft } from '@/types/schedule';

import { createEmptyDraft } from './config.utils';
import { getDayState, getMissingFieldsMessage, isScheduleComplete } from './day-state.utils';

const DATE = new CalendarDate(2026, 11, 26);

function shiftDraft(shift: Partial<ScheduleDraft['shift']>): ScheduleDraft {
  const draft = createEmptyDraft();
  return { ...draft, type: 'shift', shift: { ...draft.shift, ...shift } };
}

function weeklyDraft(weekly: Partial<ScheduleDraft['weekly']>): ScheduleDraft {
  const draft = createEmptyDraft();
  return { ...draft, type: 'weekly', weekly: { ...draft.weekly, ...weekly } };
}

const COMPLETE_SHIFT = shiftDraft({ startDate: '2026-11-26', cycle: '12x36', turn: 'night' });
const COMPLETE_WEEKLY = weeklyDraft({ modality: '6x1', anchorDate: '2026-11-22', offDays: [[4]] });

describe('isScheduleComplete', () => {
  test.each([
    ['a complete shift', COMPLETE_SHIFT, true],
    ['12x36 without turn', shiftDraft({ startDate: '2026-11-26', cycle: '12x36' }), false],
    ['24x48 without turn', shiftDraft({ startDate: '2026-11-26', cycle: '24x48' }), true],
    ['a shift without date', shiftDraft({ cycle: '24x48' }), false],
    [
      'a shift with an invalid date',
      shiftDraft({ startDate: '2026-02-30', cycle: '24x48' }),
      false,
    ],
    ['a shift without cycle', shiftDraft({ startDate: '2026-11-26' }), false],
    ['a complete weekly', COMPLETE_WEEKLY, true],
    ['a weekly without anchor', weeklyDraft({ modality: '6x1' }), false],
    ['a weekly without modality', weeklyDraft({ anchorDate: '2026-11-22' }), false],
    ['a draft without type', createEmptyDraft(), false],
  ])('%s is %s', (_label, draft, expected) => {
    expect(isScheduleComplete(draft)).toBe(expected);
  });

  test('a weekly with an incomplete week is still complete for display', () => {
    const draft = weeklyDraft({ modality: '5x2', anchorDate: '2026-11-22', offDays: [[0]] });
    expect(isScheduleComplete(draft)).toBe(true);
  });
});

describe('getDayState', () => {
  test.each([
    ['without type', createEmptyDraft()],
    ['a shift without start date', shiftDraft({ cycle: '24x48' })],
    ['a 12x36 shift without turn', shiftDraft({ startDate: '2026-11-26', cycle: '12x36' })],
    ['a shift without cycle', shiftDraft({ startDate: '2026-11-26' })],
    ['a weekly without modality', weeklyDraft({ anchorDate: '2026-11-22' })],
    ['a weekly without anchor', weeklyDraft({ modality: '6x1' })],
  ])('returns null for %s', (_label, draft) => {
    expect(getDayState(draft, DATE)).toBeNull();
  });

  test('returns the shift state for a complete shift', () => {
    expect(getDayState(COMPLETE_SHIFT, DATE)).toBe('work');
    expect(getDayState(COMPLETE_SHIFT, DATE.add({ days: 1 }))).toBe('off-exit');
  });

  test('returns the weekly state for a complete weekly', () => {
    expect(getDayState(COMPLETE_WEEKLY, DATE)).toBe('off');
    expect(getDayState(COMPLETE_WEEKLY, DATE.add({ days: 1 }))).toBe('work');
  });
});

describe('getMissingFieldsMessage', () => {
  test.each([
    [createEmptyDraft(), 'Escolha o tipo de escala para ver os dias no calendário.'],
    [shiftDraft({}), 'Preencha a data de início e a escala para ver os dias no calendário.'],
    [
      shiftDraft({ startDate: '2026-11-26', cycle: '12x36' }),
      'Preencha o turno para ver os dias no calendário.',
    ],
    [
      weeklyDraft({}),
      'Preencha a modalidade e a data de início da semana 1 para ver os dias no calendário.',
    ],
    [
      weeklyDraft({ modality: '5x2' }),
      'Preencha a data de início da semana 1 para ver os dias no calendário.',
    ],
    [COMPLETE_SHIFT, ''],
    [COMPLETE_WEEKLY, ''],
  ])('describes what is missing for %j', (draft, expected) => {
    expect(getMissingFieldsMessage(draft)).toBe(expected);
  });
});
