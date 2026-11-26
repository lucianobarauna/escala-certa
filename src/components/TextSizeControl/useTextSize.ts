import { useEffect, useState } from 'react';

import { sharedStorage } from '@/lib/safe-storage';
import type { SafeStorage } from '@/lib/safe-storage';
import { TEXT_SIZE_STORAGE_KEY } from '@/lib/storage-keys';
import { textSizeChanged } from '@/services/analytics.events';
import type { TextSizeLevel } from '@/services/analytics.events';
import { track } from '@/services/analytics.service';

import {
  DEFAULT_TEXT_SIZE,
  MAX_TEXT_SIZE_REASON,
  MIN_TEXT_SIZE_REASON,
} from './text-size.constants';
import { applyRootFontSize, getLevelMessage, parseStoredLevel, stepLevel } from './text-size.utils';

export type TextSize = {
  level: TextSizeLevel;
  message: string;
  decreaseBlockedReason: string | null;
  increaseBlockedReason: string | null;
  decrease: () => void;
  increase: () => void;
  reset: () => void;
};

export function useTextSize(storage: SafeStorage = sharedStorage): TextSize {
  const [level, setLevel] = useState(() => parseStoredLevel(storage.read(TEXT_SIZE_STORAGE_KEY)));
  useEffect(() => applyRootFontSize(level), [level]);
  function changeTo(next: TextSizeLevel) {
    if (next === level) return;
    setLevel(next);
    storage.write(TEXT_SIZE_STORAGE_KEY, String(next));
    track(textSizeChanged(next));
  }
  const previous = stepLevel(level, -1);
  const following = stepLevel(level, 1);
  return {
    level,
    message: getLevelMessage(level),
    decreaseBlockedReason: previous === level ? MIN_TEXT_SIZE_REASON : null,
    increaseBlockedReason: following === level ? MAX_TEXT_SIZE_REASON : null,
    decrease: () => changeTo(previous),
    increase: () => changeTo(following),
    reset: () => changeTo(DEFAULT_TEXT_SIZE),
  };
}
