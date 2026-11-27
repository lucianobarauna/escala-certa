import { cn } from '@/lib/utils';

import type { StateDisplay } from './month-preview.constants';

export function StateMark({ display }: { display: StateDisplay }) {
  const { Icon } = display;
  return (
    <span
      aria-hidden="true"
      className="ml-auto flex min-w-0 items-center gap-1.5 text-sm @month-grid:ml-0 @month-grid:text-xs"
    >
      <Icon className={cn('size-4 shrink-0', display.iconClass)} />
      <span className="@month-grid:hidden">{display.label}</span>
      <span className="hidden @month-grid:inline">{display.shortLabel}</span>
    </span>
  );
}
