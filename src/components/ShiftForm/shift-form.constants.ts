import type { ShiftCycle, ShiftTurn } from '@/types/schedule';

type Option<T extends string> = {
  value: T;
  label: string;
  description: string;
};

export const CYCLE_WITH_TURN: ShiftCycle = '12x36';
export const START_DATE_LABEL = 'Data de início do plantão';
export const CYCLE_LABEL = 'Escala';
export const TURN_LABEL = 'Turno (obrigatório)';

export const CYCLE_OPTIONS: readonly Option<ShiftCycle>[] = [
  { value: '12x36', label: '12x36', description: 'Trabalha 12 horas e folga 36 horas' },
  { value: '24x48', label: '24x48', description: 'Trabalha 24 horas e folga 48 horas' },
  { value: '24x72', label: '24x72', description: 'Trabalha 24 horas e folga 72 horas' },
];

export const TURN_OPTIONS: readonly Option<ShiftTurn>[] = [
  { value: 'day', label: 'Diurno', description: 'O plantão começa de dia' },
  { value: 'night', label: 'Noturno', description: 'O plantão começa à noite' },
];
