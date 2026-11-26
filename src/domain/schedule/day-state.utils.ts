import type { CalendarDate } from '@internationalized/date';

import type { DayState, ScheduleDraft } from '@/types/schedule';

import { isValidIsoDate, parseIsoDate } from './date.utils';
import { getShiftDayState, getShiftVariant } from './shift-cycle.utils';
import { getWeeklyDayState } from './weekly-pattern.utils';

const CHOOSE_TYPE_MESSAGE = 'Escolha o tipo de escala para ver os dias no calendário.';

function getMissingShiftFields({ shift }: ScheduleDraft) {
  const missing: string[] = [];
  if (!shift.startDate || !isValidIsoDate(shift.startDate)) missing.push('a data de início');
  if (!shift.cycle) missing.push('a escala');
  if (shift.cycle && !getShiftVariant(shift)) missing.push('o turno');
  return missing;
}

function getMissingWeeklyFields({ weekly }: ScheduleDraft) {
  const missing: string[] = [];
  if (!weekly.modality) missing.push('a modalidade');
  if (!weekly.anchorDate || !isValidIsoDate(weekly.anchorDate)) {
    missing.push('a data de início da semana 1');
  }
  return missing;
}

function getMissingFields(draft: ScheduleDraft) {
  if (draft.type === 'shift') return getMissingShiftFields(draft);
  if (draft.type === 'weekly') return getMissingWeeklyFields(draft);
  return [];
}

function joinWithAnd(items: string[]) {
  return new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' }).format(items);
}

export function isScheduleComplete(draft: ScheduleDraft) {
  return draft.type !== null && getMissingFields(draft).length === 0;
}

export function getMissingFieldsMessage(draft: ScheduleDraft) {
  if (!draft.type) return CHOOSE_TYPE_MESSAGE;
  const missing = getMissingFields(draft);
  if (missing.length === 0) return '';
  return `Preencha ${joinWithAnd(missing)} para ver os dias no calendário.`;
}

function getShiftState({ shift }: ScheduleDraft, date: CalendarDate) {
  const variant = getShiftVariant(shift);
  const startDate = shift.startDate ? parseIsoDate(shift.startDate) : null;
  if (!variant || !startDate) return null;
  return getShiftDayState({ variant, startDate }, date);
}

function getWeeklyState({ weekly }: ScheduleDraft, date: CalendarDate) {
  const anchorDate = weekly.anchorDate ? parseIsoDate(weekly.anchorDate) : null;
  if (!weekly.modality || !anchorDate) return null;
  return getWeeklyDayState({ weeks: weekly.weeks, offDays: weekly.offDays, anchorDate }, date);
}

export function getDayState(draft: ScheduleDraft, date: CalendarDate): DayState | null {
  if (draft.type === 'shift') return getShiftState(draft, date);
  if (draft.type === 'weekly') return getWeeklyState(draft, date);
  return null;
}
