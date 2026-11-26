import type { CalendarDate } from '@internationalized/date';

import type { DayState } from '@/types/schedule';

const DATE_PARTS_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'UTC',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const TODAY_LABEL = 'hoje';

const STATE_LABELS: Record<DayState, string> = {
  work: 'trabalha',
  off: 'folga',
  'off-exit': 'folga, saída do plantão pela manhã',
};

type DayNameParams = {
  date: CalendarDate;
  state: DayState | null;
  isToday: boolean;
};

function formatDateParts(date: CalendarDate) {
  const utcDate = new Date(Date.UTC(date.year, date.month - 1, date.day));
  const parts = Object.fromEntries(
    DATE_PARTS_FORMAT.formatToParts(utcDate).map((part) => [part.type, part.value]),
  );
  return { fullDate: `${parts.day} de ${parts.month} de ${parts.year}`, weekday: parts.weekday };
}

export function getDayName({ date, state, isToday }: DayNameParams) {
  const { fullDate, weekday } = formatDateParts(date);
  const todayLabel = isToday ? TODAY_LABEL : null;
  const stateLabel = state ? STATE_LABELS[state] : null;
  return [fullDate, weekday, todayLabel, stateLabel].filter(Boolean).join(', ');
}
