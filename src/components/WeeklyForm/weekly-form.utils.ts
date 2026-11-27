import {
  getMaxOffDays,
  isOffDayLimitReached,
  isWeekIncomplete,
} from '@/domain/schedule/off-days.utils';
import { MAX_WEEKS, MIN_WEEKS } from '@/domain/schedule/schedule.constants';
import type { WeeklyDraft } from '@/types/schedule';

import { MISSING_MODALITY_TEXT } from './weekly-form.constants';

export type WeekStatus = {
  kind: 'none' | 'incomplete' | 'limit' | 'missing-modality';
  text: string;
};

const NO_STATUS: WeekStatus = { kind: 'none', text: '' };

function pluralizeOffDays(count: number) {
  return count === 1 ? `${count} folga` : `${count} folgas`;
}

export function getWeekLabel(week: number) {
  return `Semana ${week + 1}`;
}

export function getWeeksText(weeks: number) {
  return weeks === 1 ? `${weeks} semana` : `${weeks} semanas`;
}

export function getWeeksLimitText(weeks: number) {
  if (weeks <= MIN_WEEKS) return `Mínimo de ${getWeeksText(MIN_WEEKS)}.`;
  if (weeks >= MAX_WEEKS) return `Máximo de ${getWeeksText(MAX_WEEKS)}.`;
  return '';
}

export function getLimitReason(maxOffDays: number) {
  return `Limite de ${pluralizeOffDays(maxOffDays)} atingido. Desmarque uma folga para escolher outro dia.`;
}

export function getIncompleteText(missing: number) {
  return `Semana incompleta: ainda ${missing === 1 ? 'falta' : 'faltam'} marcar ${pluralizeOffDays(missing)}.`;
}

export function getWeekStatus(weekly: WeeklyDraft, week: number): WeekStatus {
  if (!weekly.modality) return { kind: 'missing-modality', text: MISSING_MODALITY_TEXT };
  const maxOffDays = getMaxOffDays(weekly.modality);
  if (isWeekIncomplete(weekly, week)) {
    const missing = maxOffDays - (weekly.offDays[week]?.length ?? 0);
    return { kind: 'incomplete', text: getIncompleteText(missing) };
  }
  if (isOffDayLimitReached(weekly, week))
    return { kind: 'limit', text: getLimitReason(maxOffDays) };
  return NO_STATUS;
}
