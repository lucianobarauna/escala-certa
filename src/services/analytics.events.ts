export type TextSizeLevel = 100 | 125 | 150 | 175 | 200;

export type ShareMethod = 'native' | 'clipboard' | 'manual';

export type AnalyticsEvent =
  | { name: 'page_view'; params: { has_schedule: 'yes' | 'no' } }
  | {
      name: 'schedule_completed';
      params: { schedule_type: 'shift' | 'weekly'; variant: string; weeks: number };
    }
  | { name: 'schedule_shared'; params: { method: ShareMethod } }
  | { name: 'text_size_changed'; params: { level: TextSizeLevel } };

type ScheduleCompletedParams = {
  scheduleType: 'shift' | 'weekly';
  variant: string;
  weeks: number;
};

export function pageView(hasSchedule: boolean): AnalyticsEvent {
  return { name: 'page_view', params: { has_schedule: hasSchedule ? 'yes' : 'no' } };
}

export function scheduleCompleted(params: ScheduleCompletedParams): AnalyticsEvent {
  const { scheduleType, variant, weeks } = params;
  return {
    name: 'schedule_completed',
    params: { schedule_type: scheduleType, variant, weeks },
  };
}

export function scheduleShared(method: ShareMethod): AnalyticsEvent {
  return { name: 'schedule_shared', params: { method } };
}

export function textSizeChanged(level: TextSizeLevel): AnalyticsEvent {
  return { name: 'text_size_changed', params: { level } };
}
