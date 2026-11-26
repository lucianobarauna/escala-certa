import type { MonthCounts, MonthModel, ScheduleDraft } from '@/types/schedule';

import { getMissingFieldsMessage, isScheduleComplete } from './day-state.utils';
import { getMonthLabel } from './month.utils';

type SummaryParams = {
  month: MonthModel;
  draft: ScheduleDraft;
};

function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function describeWork(work: number, draft: ScheduleDraft) {
  if (draft.type === 'weekly') return pluralize(work, 'dia trabalhando', 'dias trabalhando');
  return pluralize(work, 'dia de plantão', 'dias de plantão');
}

function describeExits({ off, offExit }: MonthCounts) {
  if (offExit === 0) return '';
  const exits = offExit === off + offExit ? 'todos' : String(offExit);
  return ` (${exits} com saída do plantão pela manhã)`;
}

export function summarizeMonth({ month, draft }: SummaryParams) {
  if (!isScheduleComplete(draft)) return getMissingFieldsMessage(draft);
  const { counts } = month;
  const offTotal = counts.off + counts.offExit;
  const offText = pluralize(offTotal, 'dia de folga', 'dias de folga');
  return `${getMonthLabel(month)}: ${describeWork(counts.work, draft)}, ${offText}${describeExits(counts)}`;
}
