import { ReferenceDateField } from '@/components/ReferenceDateField/ReferenceDateField';
import type { ScheduleDraft } from '@/types/schedule';

import { ModalityField } from './ModalityField';
import { useWeeklyForm } from './useWeeklyForm';
import { ANCHOR_DATE_LABEL } from './weekly-form.constants';
import { WeekRow } from './WeekRow';
import { WeeksStepper } from './WeeksStepper';

type WeeklyFormProps = {
  draft: ScheduleDraft;
  onChange: (draft: ScheduleDraft) => void;
};

export function WeeklyForm({ draft, onChange }: WeeklyFormProps) {
  const form = useWeeklyForm(draft, onChange);
  const { weekly } = draft;
  return (
    <div className="flex flex-col gap-6">
      <ModalityField
        value={weekly.modality}
        offDaysCleared={form.offDaysCleared}
        onChange={form.handleModality}
      />
      <WeeksStepper weeks={weekly.weeks} onChange={form.handleWeeks} />
      {weekly.offDays.map((_, week) => (
        <WeekRow key={week} week={week} weekly={weekly} onToggle={form.handleToggle} />
      ))}
      <ReferenceDateField
        label={ANCHOR_DATE_LABEL}
        value={weekly.anchorDate}
        onChange={form.handleAnchorDate}
      />
    </div>
  );
}
