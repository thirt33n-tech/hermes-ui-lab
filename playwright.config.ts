import { defineConfig } from '@playwright/test';
import { baseConfig } from './packages/e2e-core/playwright.config.base';

export default defineConfig({
  testDir: './tests',
  ...baseConfig,
  use: {
    ...baseConfig.use,
    baseURL: 'http://localhost:5173',
    timezoneId: 'Asia/Tokyo',
    locale: 'ja-JP',
    viewport: { width: 1280, height: 720 },
    animations: 'disabled',
  },
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/report.json' }],
  ],
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
