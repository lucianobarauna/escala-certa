import { afterEach, beforeEach, vi } from 'vitest';

import { createSafeStorage } from '@/lib/safe-storage';

export function createDeps() {
  return { storage: createSafeStorage(), setAnalyticsEnabled: vi.fn() };
}

function clearCookies() {
  document.cookie.split(';').forEach((cookie) => {
    document.cookie = `${cookie.split('=')[0].trim()}=; Max-Age=0; path=/`;
  });
}

export function breakStorage() {
  function fail(): never {
    throw new DOMException('Denied', 'SecurityError');
  }
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(fail);
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(fail);
}

export function setupConsentEnvironment() {
  beforeEach(() => {
    window.localStorage.clear();
    clearCookies();
  });
  afterEach(() => {
    vi.restoreAllMocks();
    Reflect.deleteProperty(navigator, 'globalPrivacyControl');
    window.localStorage.clear();
    clearCookies();
  });
}
