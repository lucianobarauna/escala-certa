import { describe, expect, test } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { METRICS_CONSENT_STORAGE_KEY } from '@/lib/storage-keys';
import { breakStorage, createDeps, setupConsentEnvironment } from '@/services/consent.test-utils';

import { useMetricsConsent } from './useMetricsConsent';

setupConsentEnvironment();

describe('given no stored preference', () => {
  test('when the hook mounts, then the consent is unknown and analytics is disabled', async () => {
    const deps = createDeps();
    const { result } = await renderHook(() => useMetricsConsent(deps));
    expect(result.current.consent).toBe('unknown');
    expect(deps.setAnalyticsEnabled).toHaveBeenCalledWith(false);
  });

  test('when the user accepts, then it persists, enables analytics and exposes granted', async () => {
    const deps = createDeps();
    const { result, act } = await renderHook(() => useMetricsConsent(deps));
    await act(() => result.current.accept());
    expect(result.current.consent).toBe('granted');
    expect(deps.storage.read(METRICS_CONSENT_STORAGE_KEY)).toBe('granted');
    expect(deps.setAnalyticsEnabled).toHaveBeenLastCalledWith(true);
  });

  test('when the user refuses, then it persists and does not enable analytics', async () => {
    const deps = createDeps();
    const { result, act } = await renderHook(() => useMetricsConsent(deps));
    await act(() => result.current.refuse());
    expect(result.current.consent).toBe('denied');
    expect(deps.storage.read(METRICS_CONSENT_STORAGE_KEY)).toBe('denied');
    expect(deps.setAnalyticsEnabled).not.toHaveBeenCalledWith(true);
  });
});

describe('given a stored preference', () => {
  test('when it is granted, then the hook starts granted and enables analytics', async () => {
    const deps = createDeps();
    deps.storage.write(METRICS_CONSENT_STORAGE_KEY, 'granted');
    const { result } = await renderHook(() => useMetricsConsent(deps));
    expect(result.current.consent).toBe('granted');
    expect(deps.setAnalyticsEnabled).toHaveBeenCalledWith(true);
  });

  test('when it is denied, then the hook starts denied', async () => {
    const deps = createDeps();
    deps.storage.write(METRICS_CONSENT_STORAGE_KEY, 'denied');
    const { result } = await renderHook(() => useMetricsConsent(deps));
    expect(result.current.consent).toBe('denied');
  });

  test('when it is invalid, then the consent is unknown', async () => {
    const deps = createDeps();
    deps.storage.write(METRICS_CONSENT_STORAGE_KEY, 'maybe');
    const { result } = await renderHook(() => useMetricsConsent(deps));
    expect(result.current.consent).toBe('unknown');
  });
});

describe('given the user already accepted', () => {
  test('when the user revokes, then analytics is disabled and _ga cookies are removed', async () => {
    document.cookie = '_ga=GA1.1.1; path=/';
    const deps = createDeps();
    const { result, act } = await renderHook(() => useMetricsConsent(deps));
    await act(() => result.current.accept());
    await act(() => result.current.revoke());
    expect(result.current.consent).toBe('denied');
    expect(deps.setAnalyticsEnabled).toHaveBeenLastCalledWith(false);
    expect(document.cookie).not.toContain('_ga=');
  });
});

describe('given a browser that signals Global Privacy Control', () => {
  test('when the hook mounts, then it is denied and analytics is never enabled', async () => {
    Object.defineProperty(navigator, 'globalPrivacyControl', { value: true, configurable: true });
    const deps = createDeps();
    const { result, act } = await renderHook(() => useMetricsConsent(deps));
    await act(() => result.current.accept());
    expect(result.current.consent).toBe('denied');
    expect(deps.setAnalyticsEnabled).not.toHaveBeenCalledWith(true);
  });
});

describe('given unavailable storage', () => {
  test('when the user accepts, then it holds during the visit and is unknown on the next', async () => {
    breakStorage();
    const deps = createDeps();
    const { result, act } = await renderHook(() => useMetricsConsent(deps));
    await act(() => result.current.accept());
    expect(result.current.consent).toBe('granted');
    const nextVisit = await renderHook(() => useMetricsConsent(createDeps()));
    expect(nextVisit.result.current.consent).toBe('unknown');
  });
});
