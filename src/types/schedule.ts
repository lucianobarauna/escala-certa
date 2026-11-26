export type DayState = 'work' | 'off' | 'off-exit';

export type ScheduleType = 'shift' | 'weekly';

export type ShiftCycle = '12x36' | '24x48' | '24x72';

export type ShiftTurn = 'day' | 'night';

export type ShiftVariant = '12x36-day' | '12x36-night' | '24x48' | '24x72';

export type WeeklyModality = '5x2' | '6x1';

export type ShiftDraft = {
  startDate: string | null;
  cycle: ShiftCycle | null;
  turn: ShiftTurn | null;
};

export type WeeklyDraft = {
  modality: WeeklyModality | null;
  weeks: number;
  offDays: number[][];
  anchorDate: string | null;
};

export type ScheduleDraft = {
  type: ScheduleType | null;
  name: string;
  shift: ShiftDraft;
  weekly: WeeklyDraft;
};

export type CalendarDay = {
  day: number;
  state: DayState | null;
  isToday: boolean;
  accessibleName: string;
};

export type MonthCounts = {
  work: number;
  off: number;
  offExit: number;
};

export type MonthModel = {
  year: number;
  month: number;
  leadingBlanks: number;
  days: CalendarDay[];
  counts: MonthCounts;
};

export type ConfigIssueCode =
  | 'unknown_version'
  | 'invalid_field'
  | 'inconsistent_pattern'
  | 'name_truncated';

export type ConfigIssue = {
  code: ConfigIssueCode;
  field?: string;
  message: string;
};
