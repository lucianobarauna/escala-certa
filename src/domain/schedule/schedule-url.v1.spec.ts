import { describe, expect, test } from 'vitest';

import { parseSchedule } from './schedule-url.utils';

const WEEKLY = 'v=1&t=weekly&m=5x2&w=2&d=2026-11-22';

function issueFields(search: string) {
  return parseSchedule(search).issues.map((issue) => `${issue.code}:${issue.field}`);
}

describe('given an invalid date', () => {
  test.each(['2026-02-30', '2026-13-01', 'abc', ''])(
    'when d=%j, then only the date is dropped',
    (date) => {
      const { draft, issues } = parseSchedule(`?v=1&t=shift&c=12x36&s=night&d=${date}`);
      expect(draft.shift).toEqual({ startDate: null, cycle: '12x36', turn: 'night' });
      expect(issues).toHaveLength(1);
      expect(issues[0]).toMatchObject({ code: 'invalid_field', field: 'd' });
    },
  );

  test('uses the message of the TechSpec', () => {
    const [issue] = parseSchedule('?v=1&t=shift&d=2026-02-30').issues;
    expect(issue.message).toBe('A data de referência do link é inválida e foi ignorada.');
  });
});

describe('given invalid shift fields', () => {
  test('an invalid cycle is dropped and the turn is ignored', () => {
    const { draft, issues } = parseSchedule('?v=1&t=shift&c=9x9&s=night');
    expect(draft.shift).toEqual({ startDate: null, cycle: null, turn: null });
    expect(issues.map((issue) => issue.field)).toEqual(['c']);
  });

  test('an invalid turn with 12x36 is dropped and keeps the cycle', () => {
    const { draft, issues } = parseSchedule('?v=1&t=shift&c=12x36&s=evening');
    expect(draft.shift).toMatchObject({ cycle: '12x36', turn: null });
    expect(issues.map((issue) => issue.field)).toEqual(['s']);
  });

  test('a turn with a cycle other than 12x36 is ignored without issues', () => {
    const { draft, issues } = parseSchedule('?v=1&t=shift&c=24x48&s=night');
    expect(draft.shift.turn).toBeNull();
    expect(issues).toEqual([]);
  });

  test('an invalid type is reported and nothing of the other fields is used', () => {
    const { draft, issues } = parseSchedule('?v=1&t=monthly&c=24x48&n=Ana');
    expect(draft).toMatchObject({ type: null, name: 'Ana' });
    expect(draft.shift.cycle).toBeNull();
    expect(issues.map((issue) => issue.field)).toEqual(['t']);
  });
});

describe('given invalid weekly fields', () => {
  test.each(['0', '8', 'abc', '2.5', '-1'])('when w=%s, then it falls back to 1 week', (weeks) => {
    const { draft, issues } = parseSchedule(`?v=1&t=weekly&m=5x2&w=${weeks}`);
    expect(draft.weekly).toMatchObject({ weeks: 1, offDays: [[]] });
    expect(issues.map((issue) => issue.field)).toEqual(['w']);
  });

  test('an invalid modality is reported', () => {
    expect(issueFields('?v=1&t=weekly&m=4x3')).toEqual(['invalid_field:m']);
  });

  test.each(['0.7', '0.a', '0.1.2', '0', '00', '-.-.-'])(
    'when p=%s with w=2, then the pattern is inconsistent',
    (pattern) => {
      const { draft, issues } = parseSchedule(`?${WEEKLY}&p=${pattern}`);
      expect(draft.weekly.offDays).toEqual([[], []]);
      expect(issues.map((issue) => issue.code)).toEqual(['inconsistent_pattern']);
    },
  );

  test.each([
    ['5x2', '012.-'],
    ['6x1', '01.-'],
  ])('rejects more days off than %s allows (%s)', (modality, pattern) => {
    const search = `?v=1&t=weekly&m=${modality}&w=2&p=${pattern}`;
    expect(issueFields(search)).toEqual(['inconsistent_pattern:p']);
  });

  test('keeps the pattern days sorted', () => {
    expect(parseSchedule(`?${WEEKLY}&p=60.-`).draft.weekly.offDays).toEqual([[0, 6], []]);
  });

  test('drops a pattern with marked days when the modality is invalid', () => {
    expect(issueFields('?v=1&t=weekly&m=bad&p=0')).toEqual([
      'invalid_field:m',
      'inconsistent_pattern:p',
    ]);
  });
});
