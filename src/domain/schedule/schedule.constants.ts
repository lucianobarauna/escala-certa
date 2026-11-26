import type {
  DayState,
  ShiftCycle,
  ShiftTurn,
  ShiftVariant,
  WeeklyModality,
} from '@/types/schedule';

export const SHIFT_CYCLES: readonly ShiftCycle[] = ['12x36', '24x48', '24x72'];
export const SHIFT_TURNS: readonly ShiftTurn[] = ['day', 'night'];
export const WEEKLY_MODALITIES: readonly WeeklyModality[] = ['5x2', '6x1'];

export const SHIFT_CYCLE_PATTERNS: Record<ShiftVariant, readonly DayState[]> = {
  '12x36-day': ['work', 'off'],
  '12x36-night': ['work', 'off-exit'],
  '24x48': ['work', 'off-exit', 'off'],
  '24x72': ['work', 'off-exit', 'off', 'off'],
};

export const MAX_OFF_DAYS_BY_MODALITY: Record<WeeklyModality, number> = {
  '5x2': 2,
  '6x1': 1,
};

export const DAYS_PER_WEEK = 7;
export const EPOCH_WEEKDAY_OFFSET = 4;
export const MIN_WEEKS = 1;
export const MAX_WEEKS = 7;
export const MAX_NAME_LENGTH = 40;
export const MIN_YEAR = 1900;
export const MAX_YEAR = 2199;
export const MS_PER_DAY = 86_400_000;

export const MIN_TEXT_SIZE = 100;
export const MAX_TEXT_SIZE = 200;
export const TEXT_SIZE_STEP = 25;
