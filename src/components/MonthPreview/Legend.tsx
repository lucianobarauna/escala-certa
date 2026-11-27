import { cn } from '@/lib/utils';
import type { DayState } from '@/types/schedule';

import { LEGEND_TITLE, STATE_DISPLAY } from './month-preview.constants';

export function Legend({ states }: { states: DayState[] }) {
  if (states.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">{LEGEND_TITLE}</h3>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {states.map((state) => (
          <LegendItem key={state} state={state} />
        ))}
      </ul>
    </div>
  );
}

function LegendItem({ state }: { state: DayState }) {
  const { label, description, Icon, cellClass, iconClass } = STATE_DISPLAY[state];
  return (
    <li className="flex items-start gap-2 text-sm">
      <span
        aria-hidden="true"
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-md border',
          cellClass,
        )}
      >
        <Icon className={cn('size-4', iconClass)} />
      </span>
      <span className="flex flex-col">
        <span>{label}</span>
        {description && <span className="text-muted-foreground">{description}</span>}
      </span>
    </li>
  );
}
