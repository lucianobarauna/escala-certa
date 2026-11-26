import { useEffect, useState } from 'react';

import {
  acceptConsent,
  getConsent,
  initConsent,
  refuseConsent,
  revokeConsent,
} from '@/services/consent.service';
import type { Consent, ConsentDeps } from '@/services/consent.service';

export type MetricsConsent = {
  consent: Consent;
  accept: () => void;
  refuse: () => void;
  revoke: () => void;
};

export function useMetricsConsent(deps?: ConsentDeps): MetricsConsent {
  const [consent, setConsent] = useState(() => getConsent(deps));
  useEffect(() => {
    initConsent(deps);
  }, [deps]);
  return {
    consent,
    accept: () => setConsent(acceptConsent(deps)),
    refuse: () => setConsent(refuseConsent(deps)),
    revoke: () => setConsent(revokeConsent(deps)),
  };
}
