import { useRef } from 'react';

import { ConsentBanner } from '@/components/ConsentBanner/ConsentBanner';
import { PrivacyDialog } from '@/components/PrivacyDialog/PrivacyDialog';
import type { MetricsConsent } from '@/hooks/useMetricsConsent';

import { DISCLAIMER } from './home-view.constants';

export function AppFooter({ metrics }: { metrics: MetricsConsent }) {
  const privacyRef = useRef<HTMLButtonElement>(null);
  return (
    <footer className="flex flex-col gap-4 border-t pt-6 text-sm text-muted-foreground">
      <ConsentBanner metrics={metrics} returnFocusRef={privacyRef} />
      <p>{DISCLAIMER}</p>
      <PrivacyDialog metrics={metrics} triggerRef={privacyRef} />
    </footer>
  );
}
