import { afterEach, describe, expect, test, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { createSafeStorage } from '@/lib/safe-storage';
import { TEXT_SIZE_STORAGE_KEY } from '@/lib/storage-keys';
import { track } from '@/services/analytics.service';

import { useTextSize } from './useTextSize';

vi.mock('@/services/analytics.service', () => ({ track: vi.fn() }));

afterEach(() => {
  vi.restoreAllMocks();
  vi.mocked(track).mockClear();
  window.localStorage.clear();
});

function storageWith(value?: string) {
  const storage = createSafeStorage();
  if (value) storage.write(TEXT_SIZE_STORAGE_KEY, value);
  return storage;
}

describe('given the stored preference', () => {
  test('when there is none, then it starts at 100', async () => {
    const { result } = await renderHook(() => useTextSize(storageWith()));
    expect(result.current.level).toBe(100);
  });

  test('when it is valid, then it restores the level', async () => {
    const { result } = await renderHook(() => useTextSize(storageWith('150')));
    expect(result.current.level).toBe(150);
  });

  test.each(['abc', '90', '300'])('when it is %s, then it falls back to 100', async (value) => {
    const { result } = await renderHook(() => useTextSize(storageWith(value)));
    expect(result.current.level).toBe(100);
  });
});

describe('given the level controls', () => {
  test('when increasing and decreasing, then it moves in steps of 25', async () => {
    const { result, act } = await renderHook(() => useTextSize(storageWith()));
    await act(() => result.current.increase());
    expect(result.current.level).toBe(125);
    await act(() => result.current.decrease());
    expect(result.current.level).toBe(100);
  });

  test('when at 100, then decreasing is blocked with a reason', async () => {
    const { result } = await renderHook(() => useTextSize(storageWith()));
    expect(result.current.decreaseBlockedReason).toContain('padrão');
    expect(result.current.increaseBlockedReason).toBeNull();
  });

  test('when at 200, then increasing is blocked with a reason', async () => {
    const { result, act } = await renderHook(() => useTextSize(storageWith('200')));
    await act(() => result.current.increase());
    expect(result.current.level).toBe(200);
    expect(result.current.increaseBlockedReason).toContain('máximo');
  });

  test('when resetting, then it goes back to 100', async () => {
    const { result, act } = await renderHook(() => useTextSize(storageWith('175')));
    await act(() => result.current.reset());
    expect(result.current.level).toBe(100);
  });

  test('when the level is 150, then the message says "Texto em 150%"', async () => {
    const { result } = await renderHook(() => useTextSize(storageWith('150')));
    expect(result.current.message).toBe('Texto em 150%');
  });
});
