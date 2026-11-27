import { ChoiceGroup } from '@/components/ChoiceOption/ChoiceGroup';
import { ReferenceDateField } from '@/components/ReferenceDateField/ReferenceDateField';
import type { ShiftDraft } from '@/types/schedule';

import {
  CYCLE_LABEL,
  CYCLE_OPTIONS,
  CYCLE_WITH_TURN,
  START_DATE_LABEL,
  TURN_LABEL,
  TURN_OPTIONS,
} from './shift-form.constants';
import { useShiftForm } from './useShiftForm';

type ShiftFormProps = {
  shift: ShiftDraft;
  onChange: (shift: ShiftDraft) => void;
};

export function ShiftForm({ shift, onChange }: ShiftFormProps) {
  const { handleStartDate, handleCycle, handleTurn } = useShiftForm(shift, onChange);
  return (
    <div className="flex flex-col gap-6">
      <ReferenceDateField
        label={START_DATE_LABEL}
        value={shift.startDate}
        onChange={handleStartDate}
      />
      <ChoiceGroup
        label={CYCLE_LABEL}
        value={shift.cycle}
        options={CYCLE_OPTIONS}
        onChange={handleCycle}
      />
      {shift.cycle === CYCLE_WITH_TURN && (
        <ChoiceGroup
          label={TURN_LABEL}
          value={shift.turn}
          options={TURN_OPTIONS}
          onChange={handleTurn}
          isRequired
        />
      )}
    </div>
  );
}
