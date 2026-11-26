import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { shiftDraft } from '@/domain/schedule/fixtures/draft.builders';
import { serializeSchedule } from '@/domain/schedule/schedule-url.utils';
import { track } from '@/services/analytics.service';

import { useScheduleConfig } from './useScheduleConfig';

vi.mock('@/services/analytics.service', () => ({ track: vi.fn() }));

const ORIGINAL_URL = window.location.href;
const completeShift = shiftDraft({ startDate: '2026-11-01', cycle: '24x48' });

function openWith(search: string) {
  window.history.replaceState(null, '', `${window.location.pathname}${search}`);
}

beforeEach(() => {
  openWith('');
});

afterEach(() => {
  vi.mocked(track).mockClear();
  window.history.replaceState(null, '', ORIGINAL_URL);
});

describe('given the page address', () => {
  test('when it has a valid link, then the draft is restored without issues', async () => {
    openWith(serializeSchedule(completeShift));
    const { result } = await renderHook(() => useScheduleConfig());
    expect(result.current.draft.shift).toEqual(completeShift.shift);
    expect(result.current.issues).toEqual([]);
  });

  test('when it has an unknown version, then it returns issues and an empty draft', async () => {
    openWith('?v=9&t=shift');
    const { result } = await renderHook(() => useScheduleConfig());
    expect(result.current.issues[0]?.code).toBe('unknown_version');
    expect(result.current.draft.type).toBeNull();
  });
});

describe('given a change to the draft', () => {
  test('when the draft changes, then the query is mirrored without new history entries', async () => {
    const lengthBefore = window.history.length;
    const { result, act } = await renderHook(() => useScheduleConfig());
    await act(() => result.current.updateDraft(completeShift));
    expect(window.location.search).toBe(serializeSchedule(completeShift));
    expect(window.history.length).toBe(lengthBefore);
    expect(result.current.draft).toEqual(completeShift);
  });
});
