import { ChoiceGroup } from '@/components/ChoiceOption/ChoiceGroup';
import type { WeeklyModality } from '@/types/schedule';

import { MODALITY_CHANGE_NOTICE, MODALITY_LABEL, MODALITY_OPTIONS } from './weekly-form.constants';

type ModalityFieldProps = {
  value: WeeklyModality | null;
  offDaysCleared: boolean;
  onChange: (modality: string) => void;
};

export function ModalityField({ value, offDaysCleared, onChange }: ModalityFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <ChoiceGroup
        label={MODALITY_LABEL}
        value={value}
        options={MODALITY_OPTIONS}
        onChange={onChange}
      />
      <output className="block text-sm text-muted-foreground">
        {offDaysCleared && MODALITY_CHANGE_NOTICE}
      </output>
    </div>
  );
}
