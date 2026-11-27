import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';

import { ChoiceOption } from './ChoiceOption';

type ChoiceGroupOption = {
  value: string;
  label: string;
  description?: string;
};

type ChoiceGroupProps = {
  label: string;
  value: string | null;
  options: readonly ChoiceGroupOption[];
  onChange: (value: string) => void;
  isRequired?: boolean;
};

export function ChoiceGroup({ label, value, options, onChange, isRequired }: ChoiceGroupProps) {
  return (
    <RadioGroup value={value} onChange={onChange} isRequired={isRequired}>
      <Label>{label}</Label>
      {options.map((option) => (
        <ChoiceOption key={option.value} {...option} />
      ))}
    </RadioGroup>
  );
}
