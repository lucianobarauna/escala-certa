import '@/index.css';
import { useRef } from 'react';

import { PrivacyDialog } from '@/components/PrivacyDialog/PrivacyDialog';
import { useMetricsConsent } from '@/hooks/useMetricsConsent';

import { ConsentBanner } from './ConsentBanner';

export function MetricsFooterHarness() {
  const metrics = useMetricsConsent();
  const privacyRef = useRef<HTMLButtonElement>(null);
  return (
    <footer>
      <ConsentBanner metrics={metrics} returnFocusRef={privacyRef} />
      <PrivacyDialog metrics={metrics} triggerRef={privacyRef} />
    </footer>
  );
}

export function turnOnGlobalPrivacyControl() {
  Object.defineProperty(navigator, 'globalPrivacyControl', { value: true, configurable: true });
}
