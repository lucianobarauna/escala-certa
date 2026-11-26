import type { CalendarDate } from '@internationalized/date';

import type { DayState, ShiftDraft, ShiftVariant } from '@/types/schedule';

import { daysBetween, positiveModulo } from './date.utils';
import { SHIFT_CYCLE_PATTERNS } from './schedule.constants';

type ShiftDayParams = {
  variant: ShiftVariant;
  startDate: CalendarDate;
};

export function getShiftVariant({ cycle, turn }: ShiftDraft): ShiftVariant | null {
  if (!cycle) return null;
  if (cycle === '12x36') return turn ? `12x36-${turn}` : null;
  return cycle;
}

export function getShiftDayState({ variant, startDate }: ShiftDayParams, date: CalendarDate) {
  const pattern = SHIFT_CYCLE_PATTERNS[variant];
  const index = positiveModulo(daysBetween(startDate, date), pattern.length);
  const state: DayState = pattern[index];
  return state;
}
