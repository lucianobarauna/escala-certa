import { CalendarDate, type DateValue } from '@internationalized/date';

import { MAX_YEAR, MIN_YEAR } from '@/domain/schedule/schedule.constants';

export type DateError = 'incomplete' | 'out-of-range';

export const DATE_ERROR_MESSAGES: Record<DateError, string> = {
  incomplete: 'Data incompleta. Preencha dia, mês e ano no formato dd/mm/aaaa.',
  'out-of-range': `Informe uma data entre os anos ${MIN_YEAR} e ${MAX_YEAR}.`,
};

const EDITABLE_SEGMENT_SELECTOR = '[data-type]:not([data-type="literal"])';

export function isPartiallyFilled(field: Element) {
  const segments = [...field.querySelectorAll(EDITABLE_SEGMENT_SELECTOR)];
  const empty = segments.filter((segment) => segment.hasAttribute('data-placeholder'));
  return empty.length > 0 && empty.length < segments.length;
}

export function toCalendarDate({ year, month, day }: DateValue) {
  return new CalendarDate(year, month, day);
}
