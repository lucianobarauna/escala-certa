import type { ShareParams } from '@/lib/share-link';

import { APP_NAME, NAMED_SHARE_TEXT, SHARE_TEXT } from './share-button.constants';

export function getShareParams(name: string, url: string): ShareParams {
  const trimmedName = name.trim();
  if (!trimmedName) return { title: APP_NAME, text: SHARE_TEXT, url };
  return {
    title: `${trimmedName} · ${APP_NAME}`,
    text: `${trimmedName}: ${NAMED_SHARE_TEXT}`,
    url,
  };
}
