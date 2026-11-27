import type { ScheduleType } from '@/types/schedule';

type ScheduleTypeOption = {
  value: ScheduleType;
  label: string;
  description: string;
};

export const SCHEDULE_TYPE_LABEL = 'Tipo de escala';

export const SCHEDULE_TYPE_OPTIONS: readonly ScheduleTypeOption[] = [
  {
    value: 'shift',
    label: 'Plantão',
    description: '12x36, 24x48 ou 24x72, como trabalhar um dia e folgar no outro',
  },
  {
    value: 'weekly',
    label: 'Semanal',
    description: '5x2 ou 6x1, com as mesmas folgas toda semana ou em rodízio',
  },
];
