import { useId } from 'react';
import type { RefObject } from 'react';

import type { MetricsConsent } from '@/hooks/useMetricsConsent';

import { BANNER_TEXT, BANNER_TITLE } from './consent-banner.constants';
import { ConsentChoices } from './ConsentChoices';

type ConsentBannerProps = {
  metrics: MetricsConsent;
  returnFocusRef: RefObject<HTMLElement | null>;
};

export function ConsentBanner({ metrics, returnFocusRef }: ConsentBannerProps) {
  const titleId = useId();
  if (metrics.consent !== 'unknown') return null;
  function choose(action: () => void) {
    action();
    returnFocusRef.current?.focus();
  }
  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col gap-3 rounded-lg border bg-card p-4 text-sm"
    >
      <h2 id={titleId} className="font-semibold">
        {BANNER_TITLE}
      </h2>
      <p>{BANNER_TEXT}</p>
      <ConsentChoices
        onAccept={() => choose(metrics.accept)}
        onRefuse={() => choose(metrics.refuse)}
      />
    </section>
  );
}
