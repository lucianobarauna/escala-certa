import { createEmptyDraft } from '@/domain/schedule/config.utils';
import type { ScheduleDraft } from '@/types/schedule';

export function shiftDraft(shift: Partial<ScheduleDraft['shift']>, name = ''): ScheduleDraft {
  const draft = createEmptyDraft();
  return { ...draft, type: 'shift', name, shift: { ...draft.shift, ...shift } };
}

export function weeklyDraft(weekly: Partial<ScheduleDraft['weekly']>): ScheduleDraft {
  const draft = createEmptyDraft();
  return { ...draft, type: 'weekly', weekly: { ...draft.weekly, ...weekly } };
}
