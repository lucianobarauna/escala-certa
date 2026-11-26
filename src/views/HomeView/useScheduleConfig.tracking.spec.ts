import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { changeModality, changeScheduleType } from '@/domain/schedule/config.utils';
import { shiftDraft, weeklyDraft } from '@/domain/schedule/fixtures/draft.builders';
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

describe('given the completion tracking', () => {
  test('when the schedule becomes complete, then schedule_completed is sent once', async () => {
    const { result, act } = await renderHook(() => useScheduleConfig());
    await act(() => result.current.updateDraft(completeShift));
    await act(() => result.current.updateDraft({ ...completeShift, name: 'Ana' }));
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith({
      name: 'schedule_completed',
      params: { schedule_type: 'shift', variant: '24x48', weeks: 0 },
    });
  });

  test('when it is incomplete, then nothing is tracked', async () => {
    const { result, act } = await renderHook(() => useScheduleConfig());
    await act(() => result.current.updateDraft(shiftDraft({ cycle: '24x48' })));
    expect(track).not.toHaveBeenCalled();
  });

  test('when the type changes, then it is tracked again', async () => {
    const weekly = weeklyDraft({ modality: '6x1', anchorDate: '2026-11-01' });
    const { result, act } = await renderHook(() => useScheduleConfig());
    await act(() => result.current.updateDraft(completeShift));
    await act(() => result.current.updateDraft(weekly));
    expect(track).toHaveBeenCalledTimes(2);
  });

  test('when the modality changes, then it is tracked again', async () => {
    const weekly = weeklyDraft({ modality: '6x1', anchorDate: '2026-11-01' });
    const changed = changeModality(changeScheduleType(weekly, 'weekly'), '5x2').draft;
    const { result, act } = await renderHook(() => useScheduleConfig());
    await act(() => result.current.updateDraft(weekly));
    await act(() => result.current.updateDraft(changed));
    expect(track).toHaveBeenCalledTimes(2);
  });

  test('when the page opens with a complete link, then it is not tracked as completed', async () => {
    openWith(serializeSchedule(completeShift));
    const { result, act } = await renderHook(() => useScheduleConfig());
    await act(() => result.current.updateDraft({ ...completeShift, name: 'Ana' }));
    expect(track).not.toHaveBeenCalled();
  });

  test('when tracking the current completion on demand, then the event is sent', async () => {
    openWith(serializeSchedule(completeShift));
    const { result } = await renderHook(() => useScheduleConfig());
    result.current.trackCurrentCompletion();
    expect(track).toHaveBeenCalledTimes(1);
  });
});
