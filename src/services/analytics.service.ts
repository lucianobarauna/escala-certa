import type { AnalyticsEvent } from './analytics.events';
import {
  PAGE_TITLE,
  ensureGtag,
  getMeasurementId,
  getPageLocation,
  loadGtag,
  setDisabledFlag,
} from './analytics.gtag';

export type AnalyticsState = {
  enabled: boolean;
  loaded: boolean;
  pageViewSent: boolean;
};

export function createAnalyticsState(): AnalyticsState {
  return { enabled: false, loaded: false, pageViewSent: false };
}

const sharedState = createAnalyticsState();

function loadOnce(state: AnalyticsState, id: string) {
  if (state.loaded) return;
  state.loaded = true;
  loadGtag(id);
}

function isDuplicatePageView(state: AnalyticsState, event: AnalyticsEvent) {
  if (event.name !== 'page_view') return false;
  const alreadySent = state.pageViewSent;
  state.pageViewSent = true;
  return alreadySent;
}

export function applyEnabled(state: AnalyticsState, enabled: boolean) {
  try {
    const id = getMeasurementId();
    if (!id) return;
    state.enabled = enabled;
    setDisabledFlag(id, !enabled);
    if (enabled) loadOnce(state, id);
  } catch {
    state.enabled = false;
  }
}

export function sendEvent(state: AnalyticsState, event: AnalyticsEvent) {
  try {
    if (!state.enabled || isDuplicatePageView(state, event)) return;
    ensureGtag()('event', event.name, {
      ...event.params,
      page_location: getPageLocation(),
      page_title: PAGE_TITLE,
    });
  } catch {
    state.enabled = false;
  }
}

export function setAnalyticsEnabled(enabled: boolean) {
  applyEnabled(sharedState, enabled);
}

export function track(event: AnalyticsEvent) {
  sendEvent(sharedState, event);
}
