type Gtag = (...args: unknown[]) => void;

export const PAGE_TITLE = 'Escala Certa';

const GTAG_SCRIPT_URL = 'https://www.googletagmanager.com/gtag/js';

export function getMeasurementId() {
  return import.meta.env.VITE_GA_MEASUREMENT_ID || null;
}

export function getPageLocation() {
  return `${window.location.origin}${import.meta.env.BASE_URL}`;
}

export function setDisabledFlag(id: string, disabled: boolean) {
  Reflect.set(window, `ga-disable-${id}`, disabled);
}

export function ensureGtag(): Gtag {
  const existing: unknown = Reflect.get(window, 'gtag');
  if (typeof existing === 'function') return existing as Gtag;
  const dataLayer: unknown[] = [];
  Reflect.set(window, 'dataLayer', dataLayer);
  function gtag() {
    dataLayer.push(arguments);
  }
  Reflect.set(window, 'gtag', gtag);
  return gtag;
}

function injectScript(id: string) {
  const script = document.createElement('script');
  script.async = true;
  script.src = `${GTAG_SCRIPT_URL}?id=${encodeURIComponent(id)}`;
  script.onerror = () => {
    if (import.meta.env.DEV) console.warn('Google Analytics indisponível.');
  };
  document.head.append(script);
}

export function loadGtag(id: string) {
  const gtag = ensureGtag();
  gtag('js', new Date());
  gtag('config', id, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: getPageLocation(),
    page_title: PAGE_TITLE,
  });
  injectScript(id);
}
