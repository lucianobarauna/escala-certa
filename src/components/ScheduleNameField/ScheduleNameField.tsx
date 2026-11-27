import { Text, TextField } from 'react-aria-components';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MAX_NAME_LENGTH } from '@/domain/schedule/schedule.constants';

const NAME_LABEL = 'Nome da escala (opcional)';
const NAME_PLACEHOLDER = 'Ex.: Escala da Ana';
const NAME_PRIVACY_NOTICE = 'O nome vai no link e pode ser visto por quem receber o link.';

type ScheduleNameFieldProps = {
  value: string;
  onChange: (name: string) => void;
};

export function ScheduleNameField({ value, onChange }: ScheduleNameFieldProps) {
  return (
    <TextField
      value={value}
      onChange={onChange}
      maxLength={MAX_NAME_LENGTH}
      className="flex flex-col gap-1.5"
    >
      <Label>{NAME_LABEL}</Label>
      <Input placeholder={NAME_PLACEHOLDER} />
      <Text slot="description" className="text-sm text-muted-foreground">
        {NAME_PRIVACY_NOTICE}
      </Text>
    </TextField>
  );
}
