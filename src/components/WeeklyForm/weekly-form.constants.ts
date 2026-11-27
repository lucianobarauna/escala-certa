import type { WeeklyModality } from '@/types/schedule';

type ModalityOption = {
  value: WeeklyModality;
  label: string;
  description: string;
};

export const MODALITY_LABEL = 'Modalidade';
export const ANCHOR_DATE_LABEL = 'Data de início da semana 1';
export const MODALITY_CHANGE_NOTICE = 'As folgas marcadas foram limpas ao trocar a modalidade.';
export const MISSING_MODALITY_TEXT = 'Escolha a modalidade para marcar as folgas.';

export const MODALITY_OPTIONS: readonly ModalityOption[] = [
  { value: '5x2', label: '5x2', description: 'Trabalha 5 dias e folga 2 por semana' },
  { value: '6x1', label: '6x1', description: 'Trabalha 6 dias e folga 1 por semana' },
];
