import { isScheduleComplete } from '@/domain/schedule/day-state.utils';
import { getShiftVariant } from '@/domain/schedule/shift-cycle.utils';
import { scheduleCompleted } from '@/services/analytics.events';
import type { AnalyticsEvent } from '@/services/analytics.events';
import type { ScheduleDraft } from '@/types/schedule';

export type Completion = {
  key: string;
  event: AnalyticsEvent;
};

const SHIFT_WEEKS = 0;

export function getCompletion(draft: ScheduleDraft): Completion | null {
  if (!draft.type || !isScheduleComplete(draft)) return null;
  const isShift = draft.type === 'shift';
  const variant = isShift ? getShiftVariant(draft.shift) : draft.weekly.modality;
  if (!variant) return null;
  const weeks = isShift ? SHIFT_WEEKS : draft.weekly.weeks;
  const event = scheduleCompleted({ scheduleType: draft.type, variant, weeks });
  return { key: `${draft.type}:${variant}`, event };
}
