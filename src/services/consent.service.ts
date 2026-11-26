import { sharedStorage } from '@/lib/safe-storage';
import type { SafeStorage } from '@/lib/safe-storage';
import { METRICS_CONSENT_STORAGE_KEY } from '@/lib/storage-keys';

import { setAnalyticsEnabled } from './analytics.service';

export type Consent = 'unknown' | 'granted' | 'denied';

export type ConsentDeps = {
  storage: SafeStorage;
  setAnalyticsEnabled: (enabled: boolean) => void;
};

const defaultDeps: ConsentDeps = { storage: sharedStorage, setAnalyticsEnabled };

const ANALYTICS_COOKIE_PREFIX = '_ga';
const EXPIRED_COOKIE = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';

export function isGlobalPrivacyControlOn() {
  return 'globalPrivacyControl' in navigator && navigator.globalPrivacyControl === true;
}

export function getConsent({ storage } = defaultDeps): Consent {
  if (isGlobalPrivacyControlOn()) return 'denied';
  const stored = storage.read(METRICS_CONSENT_STORAGE_KEY);
  return stored === 'granted' || stored === 'denied' ? stored : 'unknown';
}

function getCookieDomains() {
  const labels = window.location.hostname.split('.');
  const parents = labels.map((_, index) => labels.slice(index).join('.'));
  return [undefined, ...parents.flatMap((domain) => [domain, `.${domain}`])];
}

function deleteAnalyticsCookies() {
  const names = document.cookie.split(';').map((cookie) => cookie.split('=')[0].trim());
  names
    .filter((name) => name.startsWith(ANALYTICS_COOKIE_PREFIX))
    .forEach((name) => {
      getCookieDomains().forEach((domain) => {
        const domainPart = domain ? `; domain=${domain}` : '';
        document.cookie = `${name}=; ${EXPIRED_COOKIE}; path=/${domainPart}`;
      });
    });
}

export function initConsent(deps = defaultDeps) {
  const consent = getConsent(deps);
  deps.setAnalyticsEnabled(consent === 'granted');
  return consent;
}

export function acceptConsent(deps = defaultDeps): Consent {
  if (isGlobalPrivacyControlOn()) return 'denied';
  deps.storage.write(METRICS_CONSENT_STORAGE_KEY, 'granted');
  deps.setAnalyticsEnabled(true);
  return 'granted';
}

export function refuseConsent(deps = defaultDeps): Consent {
  deps.storage.write(METRICS_CONSENT_STORAGE_KEY, 'denied');
  deps.setAnalyticsEnabled(false);
  return 'denied';
}

export function revokeConsent(deps = defaultDeps): Consent {
  const consent = refuseConsent(deps);
  deleteAnalyticsCookies();
  return consent;
}
