const { test, expect } = require('@playwright/test');

test('homepage visual regression', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Visual regression runs only on Chromium');
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixelRatio: 0.03,
  });
});
