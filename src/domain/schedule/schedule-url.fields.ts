import type { ConfigIssue } from '@/types/schedule';

import { createEmptyWeeks } from './config.utils';
import { parseIsoDate } from './date.utils';
import { createFieldIssue } from './schedule-url.messages';
import { parsePattern } from './schedule-url.pattern';
import { MAX_WEEKS, MIN_WEEKS } from './schedule.constants';

export type Field<T> = {
  value: T;
  issues: ConfigIssue[];
};

type PatternRequest = {
  weeks: number;
  maxOffDays: number;
};

export function absent<T>(value: T): Field<T> {
  return { value, issues: [] };
}

export function readOption<T extends string>(
  params: URLSearchParams,
  key: string,
  options: readonly T[],
): Field<T | null> {
  const raw = params.get(key);
  if (raw === null) return absent(null);
  const value = options.find((option) => option === raw) ?? null;
  return { value, issues: value ? [] : [createFieldIssue('invalid_field', key)] };
}

export function readDate(params: URLSearchParams): Field<string | null> {
  const raw = params.get('d');
  if (raw === null) return absent(null);
  if (parseIsoDate(raw) === null)
    return { value: null, issues: [createFieldIssue('invalid_field', 'd')] };
  return absent(raw);
}

export function readWeeks(params: URLSearchParams): Field<number> {
  const raw = params.get('w');
  if (raw === null) return absent(MIN_WEEKS);
  const weeks = /^\d+$/.test(raw) ? Number(raw) : 0;
  if (weeks < MIN_WEEKS || weeks > MAX_WEEKS) {
    return { value: MIN_WEEKS, issues: [createFieldIssue('invalid_field', 'w')] };
  }
  return absent(weeks);
}

export function readPattern(params: URLSearchParams, request: PatternRequest): Field<number[][]> {
  const raw = params.get('p');
  const emptyWeeks = createEmptyWeeks(request.weeks);
  if (raw === null) return absent(emptyWeeks);
  const offDays = parsePattern({ value: raw, ...request });
  if (!offDays)
    return { value: emptyWeeks, issues: [createFieldIssue('inconsistent_pattern', 'p')] };
  return absent(offDays);
}
