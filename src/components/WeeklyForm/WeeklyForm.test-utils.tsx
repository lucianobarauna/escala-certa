import { useState } from 'react';

import { createEmptyDraft } from '@/domain/schedule/config.utils';
import type { ScheduleDraft } from '@/types/schedule';

import { WeeklyForm } from './WeeklyForm';

type HarnessProps = {
  spy?: (draft: ScheduleDraft) => void;
};

export function WeeklyFormHarness({ spy }: HarnessProps) {
  const [draft, setDraft] = useState<ScheduleDraft>({ ...createEmptyDraft(), type: 'weekly' });
  function handleChange(next: ScheduleDraft) {
    setDraft(next);
    spy?.(next);
  }
  return <WeeklyForm draft={draft} onChange={handleChange} />;
}
