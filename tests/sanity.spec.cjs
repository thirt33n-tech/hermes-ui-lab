const { test, expect } = require('@playwright/test');

// ① UTF-8 sanity — checks for replacement characters (U+FFFD = 文字化け記号)
test('no UTF-8 replacement characters', async ({ page }) => {
  await page.goto('/');
  const bodyText = await page.textContent('body');
  expect(bodyText).not.toContain('�');
});

// ① Japanese text integrity — skips automatically when no Japanese text is present
test('Japanese text integrity', async ({ page }) => {
  await page.goto('/');
  const bodyText = await page.textContent('body');
  const hasJapanese = /[぀-ヿ一-鿿]/.test(bodyText || '');
  test.skip(!hasJapanese, 'No Japanese text in application');
  expect(bodyText).not.toContain('�');
});

// ⑤ JS runtime error detection
test('no JavaScript errors on page load', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  await page.goto('/');
  expect(errors, `JS errors: ${errors.join(', ')}`).toHaveLength(0);
});

// ④ Layout renders in ja-JP locale (set in config)
test('content renders with correct locale settings', async ({ page }) => {
  await page.goto('/');
  const main = page.locator('#center');
  await expect(main).toBeVisible();
  const box = await main.boundingBox();
  expect(box?.width).toBeGreaterThan(0);
  expect(box?.height).toBeGreaterThan(0);
});
