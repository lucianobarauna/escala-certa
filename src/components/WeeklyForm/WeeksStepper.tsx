import { MinusIcon, PlusIcon, type LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { MAX_WEEKS, MIN_WEEKS } from '@/domain/schedule/schedule.constants';

import { getWeeksLimitText, getWeeksText } from './weekly-form.utils';

type StepButtonProps = {
  label: string;
  Icon: LucideIcon;
  isDisabled: boolean;
  onPress: () => void;
};

function StepButton({ label, Icon, isDisabled, onPress }: StepButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon-sm"
      aria-label={label}
      isDisabled={isDisabled}
      onPress={onPress}
    >
      <Icon aria-hidden="true" />
    </Button>
  );
}

type WeeksStepperProps = {
  weeks: number;
  onChange: (weeks: number) => void;
};

export function WeeksStepper({ weeks, onChange }: WeeksStepperProps) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-sm font-medium">Semanas do padrão</legend>
      <div className="flex items-center gap-2">
        <StepButton
          label="Reduzir semanas"
          Icon={MinusIcon}
          isDisabled={weeks <= MIN_WEEKS}
          onPress={() => onChange(weeks - 1)}
        />
        <output className="min-w-24 text-center text-sm tabular-nums">{getWeeksText(weeks)}</output>
        <StepButton
          label="Aumentar semanas"
          Icon={PlusIcon}
          isDisabled={weeks >= MAX_WEEKS}
          onPress={() => onChange(weeks + 1)}
        />
      </div>
      <p className="text-sm text-muted-foreground">{getWeeksLimitText(weeks)}</p>
    </fieldset>
  );
}
