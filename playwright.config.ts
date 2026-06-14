import { defineConfig } from '@playwright/test';
import { baseConfig } from './packages/e2e-core/playwright.config.base';

export default defineConfig({
  testDir: './tests',
  ...baseConfig,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.001,
      threshold: 0.2,
      animations: 'disabled',
    },
  },
  use: {
    ...baseConfig.use,
    baseURL: 'http://localhost:5173',
    timezoneId: 'Asia/Tokyo',
    locale: 'ja-JP',
    viewport: { width: 1280, height: 742 },
    deviceScaleFactor: 1,
    hasTouch: false,
    animations: 'disabled',
  },
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/report.json' }],
  ],
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
