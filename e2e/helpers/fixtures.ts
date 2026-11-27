import { test as base, expect } from '@playwright/test';

import { interceptGoogle } from './google.ts';
import type { GoogleTraffic } from './google.ts';
import { FIXED_NOW } from './schedule-links.ts';

type Fixtures = {
  google: GoogleTraffic;
};

export const test = base.extend<Fixtures>({
  google: [
    async ({ page }, use) => {
      const traffic = await interceptGoogle(page);
      await page.clock.setFixedTime(FIXED_NOW);
      await use(traffic);
    },
    { auto: true },
  ],
});

export { expect };
