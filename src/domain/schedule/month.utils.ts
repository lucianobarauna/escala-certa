import { CalendarDate } from '@internationalized/date';

import type {
  CalendarDay,
  DayState,
  MonthCounts,
  MonthModel,
  ScheduleDraft,
} from '@/types/schedule';

import { getWeekdayIndex } from './date.utils';
import { getDayName } from './day-name.utils';
import { getDayState } from './day-state.utils';

const MONTH_NAME_FORMAT = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', month: 'long' });

export type MonthRef = {
  year: number;
  month: number;
};

export type BuildMonthParams = MonthRef & {
  draft: ScheduleDraft;
  today: CalendarDate;
};

function capitalize(text: string) {
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

export function getMonthLabel({ year, month }: MonthRef) {
  const name = MONTH_NAME_FORMAT.format(new Date(Date.UTC(year, month - 1, 1)));
  return `${capitalize(name)} de ${year}`;
}

export function shiftMonth({ year, month }: MonthRef, delta: number): MonthRef {
  const shifted = new CalendarDate(year, month, 1).add({ months: delta });
  return { year: shifted.year, month: shifted.month };
}

function buildDay(date: CalendarDate, draft: ScheduleDraft, today: CalendarDate): CalendarDay {
  const state = getDayState(draft, date);
  const isToday = date.compare(today) === 0;
  return { day: date.day, state, isToday, accessibleName: getDayName({ date, state, isToday }) };
}

function countState(days: CalendarDay[], state: DayState) {
  return days.filter((day) => day.state === state).length;
}

function countStates(days: CalendarDay[]): MonthCounts {
  return {
    work: countState(days, 'work'),
    off: countState(days, 'off'),
    offExit: countState(days, 'off-exit'),
  };
}

export function buildMonth({ year, month, draft, today }: BuildMonthParams): MonthModel {
  const first = new CalendarDate(year, month, 1);
  const days = Array.from({ length: first.calendar.getDaysInMonth(first) }, (_, index) =>
    buildDay(first.add({ days: index }), draft, today),
  );
  return { year, month, leadingBlanks: getWeekdayIndex(first), days, counts: countStates(days) };
}
