import { BriefcaseIcon, HouseIcon, SunriseIcon, type LucideIcon } from 'lucide-react';

import type { DayState } from '@/types/schedule';

export type StateDisplay = {
  label: string;
  shortLabel: string;
  description: string | null;
  Icon: LucideIcon;
  cellClass: string;
  iconClass: string;
};

export const STATE_ORDER: readonly DayState[] = ['work', 'off', 'off-exit'];

export const STATE_DISPLAY: Record<DayState, StateDisplay> = {
  work: {
    label: 'Trabalha',
    shortLabel: 'Trabalha',
    description: null,
    Icon: BriefcaseIcon,
    cellClass: 'border-state-work-icon/40 bg-state-work',
    iconClass: 'text-state-work-icon',
  },
  off: {
    label: 'Folga',
    shortLabel: 'Folga',
    description: null,
    Icon: HouseIcon,
    cellClass: 'border-state-off-icon/40 bg-state-off',
    iconClass: 'text-state-off-icon',
  },
  'off-exit': {
    label: 'Folga (saída do plantão)',
    shortLabel: 'Folga',
    description: 'Sai do plantão pela manhã e folga o resto do dia.',
    Icon: SunriseIcon,
    cellClass: 'border-state-off-exit-icon/40 bg-state-off-exit',
    iconClass: 'text-state-off-exit-icon',
  },
};

export const FIRST_DAY_COLUMN_CLASSES = [
  '@month-grid:col-start-1',
  '@month-grid:col-start-2',
  '@month-grid:col-start-3',
  '@month-grid:col-start-4',
  '@month-grid:col-start-5',
  '@month-grid:col-start-6',
  '@month-grid:col-start-7',
] as const;

export const TODAY_BADGE = 'Hoje';
export const LEGEND_TITLE = 'Legenda';
export const PREVIOUS_MONTH_LABEL = 'Mês anterior';
export const NEXT_MONTH_LABEL = 'Próximo mês';
export const CURRENT_MONTH_LABEL = 'Voltar ao mês atual';
