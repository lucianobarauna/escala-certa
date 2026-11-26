import { describe, expect, test } from 'vitest';

import { METRICS_CONSENT_STORAGE_KEY } from '@/lib/storage-keys';

import { acceptConsent, getConsent, initConsent } from './consent.service';
import { createDeps, setupConsentEnvironment } from './consent.test-utils';

setupConsentEnvironment();

describe('given the stored preference', () => {
  test('when nothing is stored, then it is unknown', () => {
    expect(getConsent(createDeps())).toBe('unknown');
  });

  test.each(['granted', 'denied'] as const)('when %s is stored, then it is returned', (stored) => {
    const deps = createDeps();
    deps.storage.write(METRICS_CONSENT_STORAGE_KEY, stored);
    expect(getConsent(deps)).toBe(stored);
  });

  test('when the stored value is invalid, then it is unknown', () => {
    const deps = createDeps();
    deps.storage.write(METRICS_CONSENT_STORAGE_KEY, 'maybe');
    expect(getConsent(deps)).toBe('unknown');
  });

  test('when granted is stored at startup, then analytics is enabled', () => {
    const deps = createDeps();
    deps.storage.write(METRICS_CONSENT_STORAGE_KEY, 'granted');
    expect(initConsent(deps)).toBe('granted');
    expect(deps.setAnalyticsEnabled).toHaveBeenCalledWith(true);
  });
});

describe('given Global Privacy Control is on', () => {
  test('when reading and accepting, then it stays denied and analytics stays off', () => {
    Object.defineProperty(navigator, 'globalPrivacyControl', { value: true, configurable: true });
    const deps = createDeps();
    expect(getConsent(deps)).toBe('denied');
    expect(acceptConsent(deps)).toBe('denied');
    expect(initConsent(deps)).toBe('denied');
    expect(deps.setAnalyticsEnabled).not.toHaveBeenCalledWith(true);
    expect(deps.storage.read(METRICS_CONSENT_STORAGE_KEY)).toBeNull();
  });
});
