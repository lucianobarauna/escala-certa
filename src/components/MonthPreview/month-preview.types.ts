import type { CalendarDate } from '@internationalized/date';

import type { MonthRef } from '@/domain/schedule/month.utils';

export type MonthPreviewNavigation = {
  month: MonthRef;
  today: CalendarDate;
  isCurrentMonth: boolean;
  goToPrevious: () => void;
  goToNext: () => void;
  goToToday: () => void;
};
