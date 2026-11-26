import type { ParseResult, ShiftDraft, WeeklyDraft } from '@/types/schedule';

import { createEmptyDraft } from './config.utils';
import { isNameTooLong, sanitizeName } from './name.utils';
import { getMaxOffDays } from './off-days.utils';
import { absent, readDate, readOption, readPattern, readWeeks } from './schedule-url.fields';
import type { Field } from './schedule-url.fields';
import { createNameTruncatedIssue } from './schedule-url.messages';
import { SCHEDULE_TYPES, SHIFT_CYCLES, SHIFT_TURNS, WEEKLY_MODALITIES } from './schedule.constants';

function parseShift(params: URLSearchParams): Field<ShiftDraft> {
  const cycle = readOption(params, 'c', SHIFT_CYCLES);
  const turn = cycle.value === '12x36' ? readOption(params, 's', SHIFT_TURNS) : absent(null);
  const date = readDate(params);
  const shift = { startDate: date.value, cycle: cycle.value, turn: turn.value };
  return { value: shift, issues: [...cycle.issues, ...turn.issues, ...date.issues] };
}

function parseWeekly(params: URLSearchParams): Field<WeeklyDraft> {
  const modality = readOption(params, 'm', WEEKLY_MODALITIES);
  const weeks = readWeeks(params);
  const request = { weeks: weeks.value, maxOffDays: getMaxOffDays(modality.value) };
  const pattern = readPattern(params, request);
  const date = readDate(params);
  const weekly = {
    modality: modality.value,
    weeks: weeks.value,
    offDays: pattern.value,
    anchorDate: date.value,
  };
  return {
    value: weekly,
    issues: [...modality.issues, ...weeks.issues, ...pattern.issues, ...date.issues],
  };
}

export function parseV1(params: URLSearchParams): ParseResult {
  const type = readOption(params, 't', SCHEDULE_TYPES);
  const rawName = params.get('n') ?? '';
  const nameIssues = isNameTooLong(rawName) ? [createNameTruncatedIssue()] : [];
  const draft = { ...createEmptyDraft(), type: type.value, name: sanitizeName(rawName) };
  const issues = [...type.issues, ...nameIssues];
  if (type.value === 'shift') {
    const shift = parseShift(params);
    return { draft: { ...draft, shift: shift.value }, issues: [...issues, ...shift.issues] };
  }
  if (type.value === 'weekly') {
    const weekly = parseWeekly(params);
    return { draft: { ...draft, weekly: weekly.value }, issues: [...issues, ...weekly.issues] };
  }
  return { draft, issues };
}
