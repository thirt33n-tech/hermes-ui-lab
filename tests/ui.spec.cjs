const { test, expect } = require('@playwright/test');

test('hermes-ui-lab loads', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page).toHaveTitle(/Vite|React|.*/);
});
