import { isOffDayLimitReached } from '@/domain/schedule/off-days.utils';
import type { WeeklyDraft } from '@/types/schedule';

import { DayToggle } from './DayToggle';
import { WEEKDAYS } from './weekly-form.constants';
import { getWeekLabel, getWeekStatus } from './weekly-form.utils';
import { WeekStatusText } from './WeekStatusText';

type WeekRowProps = {
  week: number;
  weekly: WeeklyDraft;
  onToggle: (week: number, day: number) => void;
};

export function WeekRow({ week, weekly, onToggle }: WeekRowProps) {
  const weekLabel = getWeekLabel(week);
  const marked = weekly.offDays[week] ?? [];
  const isLimitReached = isOffDayLimitReached(weekly, week);
  return (
    <div className="@container">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-sm font-medium">{weekLabel}</legend>
        <div className="grid grid-cols-1 gap-2 @md:grid-cols-7">
          {WEEKDAYS.map(({ short, full }, day) => (
            <DayToggle
              key={short}
              shortName={short}
              accessibleName={`${full}, ${weekLabel.toLowerCase()}: folga`}
              isSelected={marked.includes(day)}
              isDisabled={isLimitReached && !marked.includes(day)}
              onChange={() => onToggle(week, day)}
            />
          ))}
        </div>
        <WeekStatusText status={getWeekStatus(weekly, week)} />
      </fieldset>
    </div>
  );
}
