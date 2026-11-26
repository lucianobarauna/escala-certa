const WEEK_SEPARATOR = '.';
const EMPTY_WEEK = '-';
const WEEK_PATTERN = /^(-|[0-6]+)$/;

type PatternParams = {
  value: string;
  weeks: number;
  maxOffDays: number;
};

export function serializePattern(offDays: number[][]) {
  return offDays.map((days) => (days.length > 0 ? days.join('') : EMPTY_WEEK)).join(WEEK_SEPARATOR);
}

function parseWeek(segment: string) {
  if (!WEEK_PATTERN.test(segment)) return null;
  if (segment === EMPTY_WEEK) return [];
  const days = Array.from(segment, Number);
  const hasRepeatedDay = new Set(days).size !== days.length;
  return hasRepeatedDay ? null : days.toSorted((a, b) => a - b);
}

export function parsePattern({ value, weeks, maxOffDays }: PatternParams) {
  const segments = value.split(WEEK_SEPARATOR);
  if (segments.length !== weeks) return null;
  const offDays: number[][] = [];
  for (const segment of segments) {
    const week = parseWeek(segment);
    if (!week || week.length > maxOffDays) return null;
    offDays.push(week);
  }
  return offDays;
}
