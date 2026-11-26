import type { TextSizeLevel } from '@/services/analytics.events';

const LEVEL_100: TextSizeLevel = 100;
const LEVEL_125: TextSizeLevel = 125;
const LEVEL_150: TextSizeLevel = 150;
const LEVEL_175: TextSizeLevel = 175;
const LEVEL_200: TextSizeLevel = 200;

export const TEXT_SIZE_LEVELS: readonly TextSizeLevel[] = [
  LEVEL_100,
  LEVEL_125,
  LEVEL_150,
  LEVEL_175,
  LEVEL_200,
];

export const DEFAULT_TEXT_SIZE = LEVEL_100;

export const MIN_TEXT_SIZE_REASON = 'O texto já está no tamanho padrão (100%).';

export const MAX_TEXT_SIZE_REASON = 'O texto já está no tamanho máximo (200%).';
