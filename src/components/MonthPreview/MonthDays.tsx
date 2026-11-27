import { WEEKDAYS } from '@/domain/schedule/schedule.constants';
import type { MonthModel } from '@/types/schedule';

import { DayCell } from './DayCell';
import { getFirstDayColumnClass, getWeekdayShortName } from './month-preview.utils';

export function MonthDays({ model }: { model: MonthModel }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        aria-hidden="true"
        className="hidden grid-cols-7 gap-1.5 text-center text-xs font-medium text-muted-foreground @month-grid:grid"
      >
        {WEEKDAYS.map(({ short }) => (
          <span key={short}>{short}</span>
        ))}
      </div>
      <ul className="grid grid-cols-1 gap-1.5 @month-grid:grid-cols-7">
        {model.days.map((day, index) => (
          <DayCell
            key={day.day}
            day={day}
            weekday={getWeekdayShortName(model.leadingBlanks, index)}
            className={getFirstDayColumnClass(model.leadingBlanks, index)}
          />
        ))}
      </ul>
    </div>
  );
}
