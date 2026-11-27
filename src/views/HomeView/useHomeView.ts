import { isScheduleComplete } from '@/domain/schedule/day-state.utils';
import { useMetricsConsent } from '@/hooks/useMetricsConsent';
import type { MetricsConsent } from '@/hooks/useMetricsConsent';

import { useMonthNavigation } from './useMonthNavigation';
import { usePageViewTracking } from './usePageViewTracking';
import { useScheduleConfig } from './useScheduleConfig';

export function useHomeView() {
  const config = useScheduleConfig();
  const navigation = useMonthNavigation();
  const consent = useMetricsConsent();
  usePageViewTracking(consent.consent);
  const metrics: MetricsConsent = {
    ...consent,
    accept: () => {
      consent.accept();
      config.trackCurrentCompletion();
    },
  };
  return { config, navigation, metrics, isComplete: isScheduleComplete(config.draft) };
}
