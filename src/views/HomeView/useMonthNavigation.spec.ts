import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { useMonthNavigation } from './useMonthNavigation';

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 10, 26, 12));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('given the current date is 26/11/2026', () => {
  test('when the hook mounts, then it shows the current month', async () => {
    const { result } = await renderHook(() => useMonthNavigation());
    expect(result.current.month).toEqual({ year: 2026, month: 11 });
    expect(result.current.isCurrentMonth).toBe(true);
    expect(result.current.today.day).toBe(26);
  });

  test('when going next twice, then it crosses December into January', async () => {
    const { result, act } = await renderHook(() => useMonthNavigation());
    await act(() => result.current.goToNext());
    await act(() => result.current.goToNext());
    expect(result.current.month).toEqual({ year: 2027, month: 1 });
  });

  test('when going previous 11 times, then it crosses January into December', async () => {
    const { result, act } = await renderHook(() => useMonthNavigation());
    for (let step = 0; step < 11; step += 1) await act(() => result.current.goToPrevious());
    expect(result.current.month).toEqual({ year: 2025, month: 12 });
  });

  test('when away from the current month, then isCurrentMonth is false and today goes back', async () => {
    const { result, act } = await renderHook(() => useMonthNavigation());
    await act(() => result.current.goToPrevious());
    expect(result.current.isCurrentMonth).toBe(false);
    await act(() => result.current.goToToday());
    expect(result.current.month).toEqual({ year: 2026, month: 11 });
    expect(result.current.isCurrentMonth).toBe(true);
  });
});
