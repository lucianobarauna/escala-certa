import { cn } from '@/lib/utils';
import type { CalendarDay } from '@/types/schedule';

import { STATE_DISPLAY, TODAY_BADGE } from './month-preview.constants';
import { StateMark } from './StateMark';

type DayCellProps = {
  day: CalendarDay;
  weekday: string;
  className?: string;
};

export function DayCell({ day, weekday, className }: DayCellProps) {
  const display = day.state ? STATE_DISPLAY[day.state] : null;
  return (
    <li
      className={cn(
        'flex min-h-11 min-w-0 flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border px-3 py-2 @month-grid:min-h-18 @month-grid:flex-col @month-grid:flex-nowrap @month-grid:items-start @month-grid:px-2',
        display?.cellClass,
        day.isToday && 'border-2 border-foreground',
        className,
      )}
    >
      <span className="sr-only">{day.accessibleName}</span>
      <span aria-hidden="true" className="flex items-baseline gap-2">
        <span className="text-base font-semibold tabular-nums">{day.day}</span>
        <span className="text-sm text-muted-foreground @month-grid:hidden">{weekday}</span>
      </span>
      {day.isToday && (
        <span
          aria-hidden="true"
          className="rounded-sm bg-foreground px-1.5 text-xs font-semibold text-background"
        >
          {TODAY_BADGE}
        </span>
      )}
      {display && <StateMark display={display} />}
    </li>
  );
}
