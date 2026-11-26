import { getLocalTimeZone, today } from '@internationalized/date';
import type { CalendarDate } from '@internationalized/date';
import { useState } from 'react';

import { shiftMonth } from '@/domain/schedule/month.utils';
import type { MonthRef } from '@/domain/schedule/month.utils';

export type MonthNavigation = {
  month: MonthRef;
  today: CalendarDate;
  isCurrentMonth: boolean;
  goToPrevious: () => void;
  goToNext: () => void;
  goToToday: () => void;
};

function toMonthRef({ year, month }: MonthRef): MonthRef {
  return { year, month };
}

export function useMonthNavigation(): MonthNavigation {
  const [todayDate] = useState(() => today(getLocalTimeZone()));
  const [month, setMonth] = useState(() => toMonthRef(todayDate));
  const currentMonth = toMonthRef(todayDate);
  return {
    month,
    today: todayDate,
    isCurrentMonth: month.year === currentMonth.year && month.month === currentMonth.month,
    goToPrevious: () => setMonth((shown) => shiftMonth(shown, -1)),
    goToNext: () => setMonth((shown) => shiftMonth(shown, 1)),
    goToToday: () => setMonth(currentMonth),
  };
}
