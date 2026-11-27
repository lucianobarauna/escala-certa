import { useState } from 'react';

import { shareLink } from '@/lib/share-link';
import type { ShareOutcome } from '@/lib/share-link';
import { scheduleShared } from '@/services/analytics.events';
import { track } from '@/services/analytics.service';

import { getShareParams } from './share-button.utils';

export type ShareStatus = { kind: 'idle' } | { kind: 'copied' } | { kind: 'manual'; url: string };

const IDLE: ShareStatus = { kind: 'idle' };

function toStatus(outcome: Exclude<ShareOutcome, 'cancelled'>, url: string): ShareStatus {
  if (outcome === 'manual') return { kind: 'manual', url };
  if (outcome === 'clipboard') return { kind: 'copied' };
  return IDLE;
}

export function useShare(name: string) {
  const [status, setStatus] = useState<ShareStatus>(IDLE);
  async function share() {
    const url = window.location.href;
    setStatus(IDLE);
    const outcome = await shareLink(getShareParams(name, url));
    if (outcome === 'cancelled') return;
    track(scheduleShared(outcome));
    setStatus(toStatus(outcome, url));
  }
  return { status, share };
}
