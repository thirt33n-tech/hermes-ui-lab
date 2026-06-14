import type { PlaywrightTestConfig } from '@playwright/test';

export const baseConfig: Partial<PlaywrightTestConfig> = {
  use: {
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  workers: process.env.CI ? 2 : undefined,
  retries: process.env.CI ? 2 : 0,
};
