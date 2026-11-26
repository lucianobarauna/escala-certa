import type { ScheduleDraft, WeeklyDraft, WeeklyModality } from '@/types/schedule';

import { updateWeekly } from './config.utils';
import { MAX_OFF_DAYS_BY_MODALITY } from './schedule.constants';

type OffDayTarget = {
  week: number;
  day: number;
};

export function getMaxOffDays(modality: WeeklyModality | null) {
  return modality ? MAX_OFF_DAYS_BY_MODALITY[modality] : 0;
}

export function isOffDayLimitReached({ modality, offDays }: WeeklyDraft, week: number) {
  return (offDays[week]?.length ?? 0) >= getMaxOffDays(modality);
}

export function toggleOffDay(draft: ScheduleDraft, { week, day }: OffDayTarget): ScheduleDraft {
  const { weekly } = draft;
  const weekOffDays = weekly.offDays[week];
  if (!weekOffDays) return draft;
  const isMarked = weekOffDays.includes(day);
  if (!isMarked && isOffDayLimitReached(weekly, week)) return draft;
  const updatedWeek = isMarked ? weekOffDays.filter((d) => d !== day) : [...weekOffDays, day];
  return updateWeekly(draft, {
    offDays: weekly.offDays.with(
      week,
      updatedWeek.toSorted((a, b) => a - b),
    ),
  });
}

export function isWeekIncomplete(weekly: WeeklyDraft, week: number) {
  const marked = weekly.offDays[week]?.length ?? 0;
  return weekly.modality !== null && marked < getMaxOffDays(weekly.modality);
}
