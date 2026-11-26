import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { createSafeStorage } from './safe-storage';

const KEY = 'escala-certa:test';

function loadStorage() {
  const { read, write } = createSafeStorage();
  return { readStorage: read, writeStorage: write };
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe('given an available storage', () => {
  test('when a value is written, then it is read back and persisted', async () => {
    const { readStorage, writeStorage } = loadStorage();
    writeStorage(KEY, '150');
    expect(readStorage(KEY)).toBe('150');
    expect(window.localStorage.getItem(KEY)).toBe('150');
  });

  test('when the key does not exist, then it reads null', async () => {
    const { readStorage } = loadStorage();
    expect(readStorage(KEY)).toBeNull();
  });
});

describe('given a storage that throws', () => {
  test('when setItem throws, then the value is kept in memory', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota', 'QuotaExceededError');
    });
    const { readStorage, writeStorage } = loadStorage();
    writeStorage(KEY, '175');
    expect(readStorage(KEY)).toBe('175');
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });

  test('when getItem throws, then it reads null instead of failing', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Denied', 'SecurityError');
    });
    const { readStorage } = loadStorage();
    expect(readStorage(KEY)).toBeNull();
  });

  test('when the page is visited again, then the memory value is gone', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota', 'QuotaExceededError');
    });
    const firstVisit = loadStorage();
    firstVisit.writeStorage(KEY, '125');
    const nextVisit = loadStorage();
    expect(nextVisit.readStorage(KEY)).toBeNull();
  });

  test('when storage works again, then the stored value replaces the memory one', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new DOMException('Quota', 'QuotaExceededError');
    });
    const { readStorage, writeStorage } = loadStorage();
    writeStorage(KEY, '125');
    writeStorage(KEY, '200');
    expect(setItem).toHaveBeenCalledTimes(2);
    expect(readStorage(KEY)).toBe('200');
  });
});
