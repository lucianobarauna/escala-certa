import type { TextSizeLevel } from '@/services/analytics.events';

import { DEFAULT_TEXT_SIZE, TEXT_SIZE_LEVELS } from './text-size.constants';

export function parseStoredLevel(value: string | null): TextSizeLevel {
  return TEXT_SIZE_LEVELS.find((level) => String(level) === value) ?? DEFAULT_TEXT_SIZE;
}

export function stepLevel(level: TextSizeLevel, direction: 1 | -1): TextSizeLevel {
  const index = TEXT_SIZE_LEVELS.indexOf(level) + direction;
  return TEXT_SIZE_LEVELS[index] ?? level;
}

export function getLevelMessage(level: TextSizeLevel) {
  return `Texto em ${level}%`;
}

export function applyRootFontSize(level: TextSizeLevel) {
  const root = document.documentElement;
  root.style.fontSize = `${level}%`;
  return () => {
    root.style.removeProperty('font-size');
  };
}
