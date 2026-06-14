const { test, expect } = require('@playwright/test');

test.describe('i18n switching', () => {
  test('renders in Japanese (?lang=ja)', async ({ page }) => {
    await page.goto('/?lang=ja');
    await expect(page.locator('h1')).toHaveText('Hermes UI ラボ');
    await expect(page.locator('body')).not.toContainText('undefined');
    await expect(page.locator('body')).not.toContainText('null');
  });

  test('renders in English (?lang=en)', async ({ page }) => {
    await page.goto('/?lang=en');
    await expect(page.locator('h1')).toHaveText('Hermes UI Lab');
    await expect(page.locator('body')).not.toContainText('undefined');
    await expect(page.locator('body')).not.toContainText('null');
  });

  test('language switcher JA → EN', async ({ page }) => {
    await page.goto('/?lang=ja');
    await expect(page.locator('h1')).toHaveText('Hermes UI ラボ');
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    await expect(page.locator('h1')).toHaveText('Hermes UI Lab');
  });
});
