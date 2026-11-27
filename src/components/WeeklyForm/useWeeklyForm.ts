import { useState } from 'react';

import { changeModality, changeWeeks, updateWeekly } from '@/domain/schedule/config.utils';
import { toggleOffDay } from '@/domain/schedule/off-days.utils';
import { WEEKLY_MODALITIES } from '@/domain/schedule/schedule.constants';
import { findOption } from '@/lib/options';
import type { ScheduleDraft } from '@/types/schedule';

export function useWeeklyForm(draft: ScheduleDraft, onChange: (draft: ScheduleDraft) => void) {
  const [offDaysCleared, setOffDaysCleared] = useState(false);
  function apply(next: ScheduleDraft, cleared = false) {
    setOffDaysCleared(cleared);
    onChange(next);
  }
  function handleModality(selected: string) {
    const modality = findOption(WEEKLY_MODALITIES, selected);
    if (!modality) return;
    const result = changeModality(draft, modality);
    apply(result.draft, result.offDaysCleared);
  }
  function handleWeeks(weeks: number) {
    apply(changeWeeks(draft, weeks));
  }
  function handleToggle(week: number, day: number) {
    apply(toggleOffDay(draft, { week, day }));
  }
  function handleAnchorDate(anchorDate: string | null) {
    apply(updateWeekly(draft, { anchorDate }));
  }
  return { offDaysCleared, handleModality, handleWeeks, handleToggle, handleAnchorDate };
}
