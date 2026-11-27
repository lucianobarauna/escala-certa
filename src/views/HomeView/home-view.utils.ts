import { APP_TITLE, SCHEDULE_URL_VERSION_PARAM } from './home-view.constants';

export function getDocumentTitle(name: string) {
  const trimmedName = name.trim();
  return trimmedName ? `${trimmedName} · ${APP_TITLE}` : APP_TITLE;
}

export function hasScheduleInUrl(search: string) {
  return new URLSearchParams(search).has(SCHEDULE_URL_VERSION_PARAM);
}
