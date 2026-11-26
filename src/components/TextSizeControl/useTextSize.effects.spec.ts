import { afterEach, describe, expect, test, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { createSafeStorage } from '@/lib/safe-storage';
import { TEXT_SIZE_STORAGE_KEY } from '@/lib/storage-keys';
import { track } from '@/services/analytics.service';
import { breakStorage } from '@/services/consent.test-utils';

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

describe('given the root element', () => {
  test('when the level changes, then the percentage is applied to <html>', async () => {
    const { result, act } = await renderHook(() => useTextSize(storageWith()));
    await act(() => result.current.increase());
    expect(document.documentElement.style.fontSize).toBe('125%');
  });

  test('when the hook unmounts, then the font size is cleared', async () => {
    const { result, act, unmount } = await renderHook(() => useTextSize(storageWith()));
    await act(() => result.current.increase());
    await unmount();
    expect(document.documentElement.style.fontSize).toBe('');
  });
});

describe('given persistence and metrics', () => {
  test('when the level changes, then it is persisted', async () => {
    const storage = storageWith();
    const { result, act } = await renderHook(() => useTextSize(storage));
    await act(() => result.current.increase());
    expect(storage.read(TEXT_SIZE_STORAGE_KEY)).toBe('125');
  });

  test('when storage throws, then it still works without remembering', async () => {
    breakStorage();
    const { result, act } = await renderHook(() => useTextSize(createSafeStorage()));
    await act(() => result.current.increase());
    expect(result.current.level).toBe(125);
  });

  test('when the level changes, then text_size_changed is tracked with the level', async () => {
    const { result, act } = await renderHook(() => useTextSize(storageWith()));
    await act(() => result.current.increase());
    expect(track).toHaveBeenCalledWith({ name: 'text_size_changed', params: { level: 125 } });
  });

  test('when the same level is chosen again, then nothing is tracked', async () => {
    const { result, act } = await renderHook(() => useTextSize(storageWith()));
    await act(() => result.current.reset());
    expect(track).not.toHaveBeenCalled();
  });
});
