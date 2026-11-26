import { useRef, useState } from 'react';

import { buildScheduleUrl, parseSchedule } from '@/domain/schedule/schedule-url.utils';
import { track } from '@/services/analytics.service';
import type { ConfigIssue, ScheduleDraft } from '@/types/schedule';

import { getCompletion } from './schedule-completion.utils';

export type ScheduleConfig = {
  draft: ScheduleDraft;
  issues: ConfigIssue[];
  updateDraft: (next: ScheduleDraft) => void;
  trackCurrentCompletion: () => void;
};

function mirrorDraftInUrl(draft: ScheduleDraft) {
  const { pathname, hash } = window.location;
  window.history.replaceState(
    window.history.state,
    '',
    buildScheduleUrl({ draft, pathname, hash }),
  );
}

export function useScheduleConfig(): ScheduleConfig {
  const [initial] = useState(() => parseSchedule(window.location.search));
  const [draft, setDraft] = useState(initial.draft);
  const trackedKey = useRef(getCompletion(initial.draft)?.key ?? null);
  function updateDraft(next: ScheduleDraft) {
    setDraft(next);
    mirrorDraftInUrl(next);
    const completion = getCompletion(next);
    if (!completion || completion.key === trackedKey.current) return;
    trackedKey.current = completion.key;
    track(completion.event);
  }
  function trackCurrentCompletion() {
    const completion = getCompletion(draft);
    if (completion) track(completion.event);
  }
  return { draft, issues: initial.issues, updateDraft, trackCurrentCompletion };
}
