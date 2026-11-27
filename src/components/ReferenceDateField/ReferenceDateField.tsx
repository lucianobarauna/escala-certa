import { useId } from 'react';
import { DatePicker, Dialog } from 'react-aria-components';

import { Calendar } from '@/components/ui/calendar';
import { FieldError } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Popover } from '@/components/ui/popover';

import { DATE_ERROR_MESSAGES } from './date-field.utils';
import { DateInputGroup } from './DateInputGroup';
import { useReferenceDate } from './useReferenceDate';

type ReferenceDateFieldProps = {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
};

export function ReferenceDateField({ label, value, onChange }: ReferenceDateFieldProps) {
  const errorId = useId();
  const { date, error, handleChange, handleBlur } = useReferenceDate({ value, onChange });
  return (
    <DatePicker
      value={date}
      onChange={handleChange}
      onBlur={handleBlur}
      isInvalid={error !== null}
      aria-describedby={error ? errorId : undefined}
      granularity="day"
      className="group flex flex-col gap-1.5"
    >
      <Label>{label}</Label>
      <DateInputGroup />
      {error && <FieldError id={errorId}>{DATE_ERROR_MESSAGES[error]}</FieldError>}
      <Popover className="w-auto">
        <Dialog>
          <Calendar />
        </Dialog>
      </Popover>
    </DatePicker>
  );
}
