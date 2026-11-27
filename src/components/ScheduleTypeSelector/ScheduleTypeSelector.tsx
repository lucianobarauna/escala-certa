import { ChoiceGroup } from '@/components/ChoiceOption/ChoiceGroup';
import { SCHEDULE_TYPES } from '@/domain/schedule/schedule.constants';
import { findOption } from '@/lib/options';
import type { ScheduleType } from '@/types/schedule';

import { SCHEDULE_TYPE_LABEL, SCHEDULE_TYPE_OPTIONS } from './schedule-type-selector.constants';

type ScheduleTypeSelectorProps = {
  value: ScheduleType | null;
  onChange: (type: ScheduleType) => void;
};

export function ScheduleTypeSelector({ value, onChange }: ScheduleTypeSelectorProps) {
  function handleChange(selected: string) {
    const type = findOption(SCHEDULE_TYPES, selected);
    if (type) onChange(type);
  }
  return (
    <ChoiceGroup
      label={SCHEDULE_TYPE_LABEL}
      value={value}
      options={SCHEDULE_TYPE_OPTIONS}
      onChange={handleChange}
    />
  );
}
