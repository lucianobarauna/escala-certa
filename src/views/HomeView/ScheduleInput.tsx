import { useId } from 'react';

import { ScheduleNameField } from '@/components/ScheduleNameField/ScheduleNameField';
import { ScheduleTypeSelector } from '@/components/ScheduleTypeSelector/ScheduleTypeSelector';
import { ShiftForm } from '@/components/ShiftForm/ShiftForm';
import { WeeklyForm } from '@/components/WeeklyForm/WeeklyForm';
import { changeScheduleType } from '@/domain/schedule/config.utils';
import type { ScheduleDraft } from '@/types/schedule';

import { INPUT_TITLE } from './home-view.constants';

type ScheduleInputProps = {
  draft: ScheduleDraft;
  onChange: (draft: ScheduleDraft) => void;
};

export function ScheduleInput({ draft, onChange }: ScheduleInputProps) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-6">
      <h2 id={titleId} className="text-lg font-semibold">
        {INPUT_TITLE}
      </h2>
      <ScheduleTypeSelector
        value={draft.type}
        onChange={(type) => onChange(changeScheduleType(draft, type))}
      />
      {draft.type === 'shift' && (
        <ShiftForm shift={draft.shift} onChange={(shift) => onChange({ ...draft, shift })} />
      )}
      {draft.type === 'weekly' && <WeeklyForm draft={draft} onChange={onChange} />}
      <ScheduleNameField value={draft.name} onChange={(name) => onChange({ ...draft, name })} />
    </section>
  );
}
