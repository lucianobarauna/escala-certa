import type { CalendarDate } from '@internationalized/date';

import type { DayState } from '@/types/schedule';

import { daysBetween, getWeekdayIndex, positiveModulo, startOfWeekSunday } from './date.utils';
import { DAYS_PER_WEEK } from './schedule.constants';

type WeeklyPatternParams = {
  weeks: number;
  offDays: number[][];
  anchorDate: CalendarDate;
};

export function getWeekIndex({ weeks, anchorDate }: WeeklyPatternParams, date: CalendarDate) {
  const firstWeekStart = startOfWeekSunday(anchorDate);
  const weeksSinceStart = Math.floor(daysBetween(firstWeekStart, date) / DAYS_PER_WEEK);
  return positiveModulo(weeksSinceStart, weeks);
}

export function getWeeklyDayState(params: WeeklyPatternParams, date: CalendarDate): DayState {
  const weekOffDays = params.offDays[getWeekIndex(params, date)] ?? [];
  return weekOffDays.includes(getWeekdayIndex(date)) ? 'off' : 'work';
}
