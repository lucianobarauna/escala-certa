import type { CalendarDate, DateValue } from '@internationalized/date';
import { useState, type FocusEvent } from 'react';

import { isValidIsoDate, parseIsoDate, toIsoDate } from '@/domain/schedule/date.utils';

import { isPartiallyFilled, toCalendarDate, type DateError } from './date-field.utils';

type ReferenceDateParams = {
  value: string | null;
  onChange: (value: string | null) => void;
};

export function useReferenceDate({ value, onChange }: ReferenceDateParams) {
  const [error, setError] = useState<DateError | null>(null);
  const [pending, setPending] = useState<CalendarDate | null>(null);
  const date = (value ? parseIsoDate(value) : null) ?? pending;
  function handleChange(next: DateValue | null) {
    const picked = next ? toCalendarDate(next) : null;
    const isOutOfRange = picked !== null && !isValidIsoDate(toIsoDate(picked));
    setPending(isOutOfRange ? picked : null);
    setError(null);
    onChange(picked && !isOutOfRange ? toIsoDate(picked) : null);
  }
  function handleBlur(event: FocusEvent) {
    if (isPartiallyFilled(event.currentTarget)) return setError('incomplete');
    setError(pending ? 'out-of-range' : null);
  }
  return { date, error, handleChange, handleBlur };
}
