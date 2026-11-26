import type { ScheduleDraft } from '@/types/schedule';

import { serializePattern } from './schedule-url.pattern';
import { URL_VERSION } from './schedule.constants';

type Entry = [string, string | null];

function shiftEntries({ shift }: ScheduleDraft): Entry[] {
  const turn = shift.cycle === '12x36' ? shift.turn : null;
  return [
    ['c', shift.cycle],
    ['s', turn],
    ['d', shift.startDate],
  ];
}

function weeklyEntries({ weekly }: ScheduleDraft): Entry[] {
  return [
    ['m', weekly.modality],
    ['w', String(weekly.weeks)],
    ['p', serializePattern(weekly.offDays)],
    ['d', weekly.anchorDate],
  ];
}

function typeEntries(draft: ScheduleDraft): Entry[] {
  if (draft.type === 'shift') return shiftEntries(draft);
  if (draft.type === 'weekly') return weeklyEntries(draft);
  return [];
}

export function serializeV1(draft: ScheduleDraft) {
  const entries: Entry[] = [
    ['v', URL_VERSION],
    ['t', draft.type],
    ...typeEntries(draft),
    ['n', draft.name || null],
  ];
  const present = entries.flatMap(([key, value]) => (value === null ? [] : [[key, value]]));
  return new URLSearchParams(present);
}
