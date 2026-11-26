import type { ScheduleDraft, ScheduleType, WeeklyDraft, WeeklyModality } from '@/types/schedule';

import { MAX_WEEKS, MIN_WEEKS } from './schedule.constants';

type ModalityChange = {
  draft: ScheduleDraft;
  offDaysCleared: boolean;
};

function createEmptyWeeks(weeks: number) {
  return Array.from({ length: weeks }, (): number[] => []);
}

export function updateWeekly(draft: ScheduleDraft, changes: Partial<WeeklyDraft>): ScheduleDraft {
  return { ...draft, weekly: { ...draft.weekly, ...changes } };
}

export function createEmptyDraft(): ScheduleDraft {
  return {
    type: null,
    name: '',
    shift: { startDate: null, cycle: null, turn: null },
    weekly: {
      modality: null,
      weeks: MIN_WEEKS,
      offDays: createEmptyWeeks(MIN_WEEKS),
      anchorDate: null,
    },
  };
}

export function changeScheduleType(draft: ScheduleDraft, type: ScheduleType): ScheduleDraft {
  return { ...draft, type };
}

export function changeModality(draft: ScheduleDraft, modality: WeeklyModality): ModalityChange {
  if (draft.weekly.modality === modality) return { draft, offDaysCleared: false };
  const offDaysCleared = draft.weekly.offDays.some((days) => days.length > 0);
  const offDays = createEmptyWeeks(draft.weekly.weeks);
  return { draft: updateWeekly(draft, { modality, offDays }), offDaysCleared };
}

export function changeWeeks(draft: ScheduleDraft, requestedWeeks: number): ScheduleDraft {
  if (!Number.isFinite(requestedWeeks)) return draft;
  const weeks = Math.min(MAX_WEEKS, Math.max(MIN_WEEKS, Math.trunc(requestedWeeks)));
  const kept = draft.weekly.offDays.slice(0, weeks);
  const offDays = [...kept, ...createEmptyWeeks(weeks - kept.length)];
  return updateWeekly(draft, { weeks, offDays });
}
