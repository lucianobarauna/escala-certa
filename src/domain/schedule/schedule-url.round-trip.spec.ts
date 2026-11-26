import { describe, expect, test } from 'vitest';

import type { ScheduleDraft } from '@/types/schedule';

import { createEmptyDraft } from './config.utils';
import { shiftDraft, weeklyDraft } from './fixtures/draft.builders';
import { parseSchedule, serializeSchedule } from './schedule-url.utils';

function roundTrip(draft: ScheduleDraft) {
  return parseSchedule(serializeSchedule(draft));
}

describe('given a complete or partial draft', () => {
  test.each([
    shiftDraft({ startDate: '2026-11-26', cycle: '12x36', turn: 'day' }),
    shiftDraft({ startDate: '2026-11-26', cycle: '12x36', turn: 'night' }),
    shiftDraft({ startDate: '2028-02-29', cycle: '24x48' }),
    shiftDraft({ startDate: '1900-01-01', cycle: '24x72' }),
    shiftDraft({ cycle: '12x36' }),
    createEmptyDraft(),
  ])('round-trips the shift draft %#', (draft) => {
    expect(roundTrip(draft)).toEqual({ draft, issues: [] });
  });

  test.each([
    weeklyDraft({ modality: '5x2', weeks: 1, offDays: [[0, 6]], anchorDate: '2026-11-22' }),
    weeklyDraft({ modality: '6x1', weeks: 3, offDays: [[0], [], [4]], anchorDate: '2026-11-22' }),
    weeklyDraft({ modality: '6x1', weeks: 7, offDays: [[0], [1], [2], [3], [4], [5], [6]] }),
    weeklyDraft({ modality: '5x2', weeks: 2, offDays: [[], []] }),
    weeklyDraft({ weeks: 4, offDays: [[], [], [], []] }),
  ])('round-trips the weekly draft %#', (draft) => {
    expect(roundTrip(draft)).toEqual({ draft, issues: [] });
  });

  test('serializes only the active type and always the version', () => {
    const draft = {
      ...shiftDraft({ cycle: '24x48', startDate: '2026-11-26' }),
      weekly: weeklyDraft({ modality: '5x2' }).weekly,
    };
    expect(serializeSchedule(draft)).toBe('?v=1&t=shift&c=24x48&d=2026-11-26');
    expect(serializeSchedule(createEmptyDraft())).toBe('?v=1');
  });

  test('does not serialize the turn when the cycle is not 12x36', () => {
    expect(serializeSchedule(shiftDraft({ cycle: '24x48', turn: 'night' }))).not.toContain('s=');
  });
});

describe('given a schedule name', () => {
  test('keeps special characters as plain text through the round-trip', () => {
    const name = 'Ação & "Plantão" =#%+ <script>alert(1)</script> 👩‍⚕️';
    expect(roundTrip(shiftDraft({}, name.slice(0, 40))).draft.name).toBe(name.slice(0, 40));
    expect(serializeSchedule(shiftDraft({}, '<b>'))).not.toContain('<');
  });

  test('cuts more than 40 characters and reports name_truncated', () => {
    const { draft, issues } = parseSchedule(`?v=1&n=${'a'.repeat(41)}`);
    expect(draft.name).toBe('a'.repeat(40));
    expect(issues.map((issue) => issue.code)).toEqual(['name_truncated']);
  });

  test('removes control characters', () => {
    expect(parseSchedule('?v=1&n=Ana%00%0A%20Silva').draft.name).toBe('Ana Silva');
  });
});
