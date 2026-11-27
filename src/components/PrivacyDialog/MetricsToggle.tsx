import { useId } from 'react';

import { Switch } from '@/components/ui/switch';
import type { MetricsConsent } from '@/hooks/useMetricsConsent';
import { isGlobalPrivacyControlOn } from '@/services/consent.service';

import {
  GPC_MESSAGE,
  METRICS_OFF_MESSAGE,
  METRICS_ON_MESSAGE,
  METRICS_SWITCH_LABEL,
} from './privacy-dialog.constants';

export function MetricsToggle({ metrics }: { metrics: MetricsConsent }) {
  const labelId = useId();
  const isOn = metrics.consent === 'granted';
  const isGpcOn = isGlobalPrivacyControlOn();
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <Switch
          aria-labelledby={labelId}
          isSelected={isOn}
          isDisabled={isGpcOn}
          onChange={(selected) => (selected ? metrics.accept() : metrics.revoke())}
        />
        <span id={labelId} className="font-medium">
          {METRICS_SWITCH_LABEL}
        </span>
      </div>
      <output className="text-muted-foreground">
        {isOn ? METRICS_ON_MESSAGE : METRICS_OFF_MESSAGE}
      </output>
      {isGpcOn && <p className="text-muted-foreground">{GPC_MESSAGE}</p>}
    </div>
  );
}
