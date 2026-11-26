import { describe, expect, test } from 'vitest';

import { acceptConsent, getConsent, refuseConsent, revokeConsent } from './consent.service';
import { breakStorage, createDeps, setupConsentEnvironment } from './consent.test-utils';

setupConsentEnvironment();

describe('given the person makes a choice', () => {
  test('when accepting, then it is stored and analytics is enabled', () => {
    const deps = createDeps();
    expect(acceptConsent(deps)).toBe('granted');
    expect(getConsent(deps)).toBe('granted');
    expect(deps.setAnalyticsEnabled).toHaveBeenCalledWith(true);
  });

  test('when refusing, then it is stored and analytics is not enabled', () => {
    const deps = createDeps();
    expect(refuseConsent(deps)).toBe('denied');
    expect(getConsent(deps)).toBe('denied');
    expect(deps.setAnalyticsEnabled).not.toHaveBeenCalledWith(true);
  });

  test('when revoking after accepting, then analytics is disabled and _ga cookies are removed', () => {
    document.cookie = '_ga=1; path=/';
    document.cookie = '_ga_ABC123=2; path=/';
    document.cookie = 'other=3; path=/';
    const deps = createDeps();
    acceptConsent(deps);
    revokeConsent(deps);
    expect(deps.setAnalyticsEnabled).toHaveBeenLastCalledWith(false);
    expect(document.cookie).toBe('other=3');
  });

  test('when storage is unavailable, then the choice lasts the visit only', () => {
    breakStorage();
    const firstVisit = createDeps();
    acceptConsent(firstVisit);
    expect(getConsent(firstVisit)).toBe('granted');
    expect(getConsent(createDeps())).toBe('unknown');
  });
});
