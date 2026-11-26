import { describe, expect, test } from 'vitest';

import { createEmptyDraft } from './config.utils';
import { shiftDraft } from './fixtures/draft.builders';
import { FROZEN_V1_LINKS } from './fixtures/schedule-v1.fixture';
import { buildScheduleUrl, parseSchedule, serializeSchedule } from './schedule-url.utils';

describe('given a query that cannot be fully trusted', () => {
  test.each(['', '?'])('without query (%j) gives an empty draft and no issues', (search) => {
    expect(parseSchedule(search)).toEqual({ draft: createEmptyDraft(), issues: [] });
  });

  test.each(['?t=shift', '?v=0', '?v=2', '?v=abc', '?v=', '?v=constructor'])(
    '%s is an unknown version',
    (search) => {
      const { draft, issues } = parseSchedule(search);
      expect(draft).toEqual(createEmptyDraft());
      expect(issues.map((issue) => issue.code)).toEqual(['unknown_version']);
    },
  );

  test('uses the first of duplicated parameters', () => {
    expect(parseSchedule('?v=1&t=shift&c=24x48&c=24x72&v=2').draft.shift.cycle).toBe('24x48');
  });

  test('ignores unknown parameters and drops them on the next serialization', () => {
    const { draft, issues } = parseSchedule('?v=1&t=shift&c=24x48&utm=x&__proto__=1');
    expect(issues).toEqual([]);
    expect(serializeSchedule(draft)).toBe('?v=1&t=shift&c=24x48');
  });

  test('limits a very long query without throwing', () => {
    const search = `?v=1&t=shift&c=24x48&n=${'a'.repeat(100_000)}`;
    expect(() => parseSchedule(search)).not.toThrow();
    expect(parseSchedule(search).draft.name).toBe('a'.repeat(40));
  });
});

describe('buildScheduleUrl', () => {
  test('keeps the pathname and the hash', () => {
    const draft = shiftDraft({ cycle: '24x48' });
    const url = buildScheduleUrl({ draft, pathname: '/escala-certa/', hash: '#topo' });
    expect(url).toBe('/escala-certa/?v=1&t=shift&c=24x48#topo');
  });
});

describe('given the frozen v1 links (RF39)', () => {
  test.each(FROZEN_V1_LINKS)('opens $search with the same draft', ({ search, draft }) => {
    expect(parseSchedule(search)).toEqual({ draft, issues: [] });
  });

  test.each(FROZEN_V1_LINKS)('still writes $search in the same format', ({ search, draft }) => {
    expect(serializeSchedule(draft)).toBe(search);
  });
});
