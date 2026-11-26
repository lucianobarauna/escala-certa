import { CalendarDate } from '@internationalized/date';

import {
  DAYS_PER_WEEK,
  EPOCH_WEEKDAY_OFFSET,
  MAX_YEAR,
  MIN_YEAR,
  MS_PER_DAY,
} from './schedule.constants';

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function toEpochDay(date: CalendarDate) {
  return Date.UTC(date.year, date.month - 1, date.day) / MS_PER_DAY;
}

export function daysBetween(from: CalendarDate, to: CalendarDate) {
  return toEpochDay(to) - toEpochDay(from);
}

export function positiveModulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

export function getWeekdayIndex(date: CalendarDate) {
  return positiveModulo(toEpochDay(date) + EPOCH_WEEKDAY_OFFSET, DAYS_PER_WEEK);
}

export function startOfWeekSunday(date: CalendarDate) {
  return date.subtract({ days: getWeekdayIndex(date) });
}

export function parseIsoDate(value: string): CalendarDate | null {
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  if (year < MIN_YEAR || year > MAX_YEAR) return null;
  const utc = new Date(Date.UTC(year, month - 1, day));
  const isSameDate = utc.getUTCMonth() === month - 1 && utc.getUTCDate() === day;
  return isSameDate ? new CalendarDate(year, month, day) : null;
}

export function isValidIsoDate(value: string) {
  return parseIsoDate(value) !== null;
}

export function toIsoDate(date: CalendarDate) {
  return date.toString();
}
