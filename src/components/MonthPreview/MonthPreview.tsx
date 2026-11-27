import { useId } from 'react';

import { buildMonth, getMonthLabel } from '@/domain/schedule/month.utils';
import { summarizeMonth } from '@/domain/schedule/summary.utils';
import type { ScheduleDraft } from '@/types/schedule';

import { Legend } from './Legend';
import type { MonthPreviewNavigation } from './month-preview.types';
import { getPresentStates } from './month-preview.utils';
import { MonthDays } from './MonthDays';
import { MonthHeader } from './MonthHeader';
import { MonthSummary } from './MonthSummary';

type MonthPreviewProps = {
  draft: ScheduleDraft;
  navigation: MonthPreviewNavigation;
};

export function MonthPreview({ draft, navigation }: MonthPreviewProps) {
  const headingId = useId();
  const model = buildMonth({ ...navigation.month, draft, today: navigation.today });
  return (
    <section aria-labelledby={headingId} className="@container flex flex-col gap-4">
      <MonthHeader label={getMonthLabel(model)} headingId={headingId} navigation={navigation} />
      <MonthDays model={model} />
      <Legend states={getPresentStates(model.counts)} />
      <MonthSummary text={summarizeMonth({ month: model, draft })} />
    </section>
  );
}
