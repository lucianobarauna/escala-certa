import { DAYS_PER_WEEK, WEEKDAYS } from '@/domain/schedule/schedule.constants';
import type { DayState, MonthCounts } from '@/types/schedule';

import { FIRST_DAY_COLUMN_CLASSES, STATE_ORDER } from './month-preview.constants';

const COUNT_BY_STATE: Record<DayState, keyof MonthCounts> = {
  work: 'work',
  off: 'off',
  'off-exit': 'offExit',
};

export function getPresentStates(counts: MonthCounts): DayState[] {
  return STATE_ORDER.filter((state) => counts[COUNT_BY_STATE[state]] > 0);
}

export function getWeekdayShortName(leadingBlanks: number, dayIndex: number) {
  return WEEKDAYS[(leadingBlanks + dayIndex) % DAYS_PER_WEEK].short;
}

export function getFirstDayColumnClass(leadingBlanks: number, dayIndex: number) {
  if (dayIndex !== 0) return undefined;
  return FIRST_DAY_COLUMN_CLASSES[leadingBlanks];
}
