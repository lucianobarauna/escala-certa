import type { Page, Route } from '@playwright/test';

export type GoogleTraffic = {
  requests: string[];
  failScript: () => void;
};

const GOOGLE_HOST_PATTERN = /(^|\.)(googletagmanager|google-analytics)\.com$/;
const NO_CONTENT = 204;

export async function interceptGoogle(page: Page): Promise<GoogleTraffic> {
  const traffic = { requests: [] as string[], shouldFail: false };
  async function handle(route: Route) {
    traffic.requests.push(route.request().url());
    if (traffic.shouldFail) return route.abort('blockedbyclient');
    return route.fulfill({ status: NO_CONTENT, body: '' });
  }
  await page.route((url) => GOOGLE_HOST_PATTERN.test(url.hostname), handle);
  return {
    requests: traffic.requests,
    failScript: () => {
      traffic.shouldFail = true;
    },
  };
}

export function readDataLayer(page: Page): Promise<unknown[][]> {
  return page.evaluate(() => {
    const layer: unknown = Reflect.get(window, 'dataLayer');
    return Array.isArray(layer) ? layer.map((entry) => Array.from(entry)) : [];
  });
}

export async function readAnalyticsCookies(page: Page) {
  const cookies = await page.context().cookies();
  return cookies.filter((cookie) => cookie.name.startsWith('_ga'));
}
