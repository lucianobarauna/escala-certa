import type { ParseResult, ScheduleDraft } from '@/types/schedule';

import { createEmptyDraft } from './config.utils';
import { createUnknownVersionIssue } from './schedule-url.messages';
import { parseV1 } from './schedule-url.v1';
import { serializeV1 } from './schedule-url.v1.serialize';
import { MAX_QUERY_LENGTH } from './schedule.constants';

type UrlBase = {
  draft: ScheduleDraft;
  pathname: string;
  hash: string;
};

const PARSERS = new Map([['1', parseV1]]);

export function serializeSchedule(draft: ScheduleDraft) {
  return `?${serializeV1(draft)}`;
}

export function buildScheduleUrl({ draft, pathname, hash }: UrlBase) {
  return `${pathname}${serializeSchedule(draft)}${hash}`;
}

export function parseSchedule(search: string): ParseResult {
  const params = new URLSearchParams(search.slice(0, MAX_QUERY_LENGTH));
  if (params.size === 0) return { draft: createEmptyDraft(), issues: [] };
  const parse = PARSERS.get(params.get('v') ?? '');
  if (!parse) return { draft: createEmptyDraft(), issues: [createUnknownVersionIssue()] };
  return parse(params);
}
