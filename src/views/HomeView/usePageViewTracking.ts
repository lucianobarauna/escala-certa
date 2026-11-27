import { useEffect, useState } from 'react';

import { pageView } from '@/services/analytics.events';
import { track } from '@/services/analytics.service';
import type { Consent } from '@/services/consent.service';

import { hasScheduleInUrl } from './home-view.utils';

export function usePageViewTracking(consent: Consent) {
  const [arrivedWithSchedule] = useState(() => hasScheduleInUrl(window.location.search));
  useEffect(() => {
    if (consent === 'granted') track(pageView(arrivedWithSchedule));
  }, [consent, arrivedWithSchedule]);
}
