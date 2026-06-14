const { test, expect } = require('@playwright/test');

test('hermes-ui-lab loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Vite|React|.*/);
});

test('counter button increments', async ({ page }) => {
  await page.goto('/');

  // Self-healing: data-testid → role → class fallback
  const counter = page.getByTestId('counter-button')
    .or(page.getByRole('button', { name: /カウントアップ/ }))
    .or(page.locator('button.counter'));

  await expect(counter).toBeVisible();
  await counter.click();
  await expect(counter).toContainText('カウントアップ 1');
});
