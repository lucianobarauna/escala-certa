import { InfoIcon, TriangleAlertIcon, type LucideIcon } from 'lucide-react';

import type { WeekStatus } from './weekly-form.utils';

const STATUS_ICONS: Record<WeekStatus['kind'], LucideIcon | null> = {
  none: null,
  incomplete: TriangleAlertIcon,
  limit: InfoIcon,
  'missing-modality': InfoIcon,
};

export function WeekStatusText({ status }: { status: WeekStatus }) {
  const Icon = STATUS_ICONS[status.kind];
  return (
    <output className="flex min-h-5 items-start gap-1.5 text-sm text-muted-foreground">
      {Icon && <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />}
      {status.text}
    </output>
  );
}
