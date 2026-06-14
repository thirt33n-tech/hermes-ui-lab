import type { Page } from '@playwright/test';

type AriaRole = Parameters<Page['getByRole']>[0];

// Self-healing locator: data-testid → aria role → aria-label
export function selfHeal(page: Page, testId: string, role: AriaRole, name: string) {
  return page
    .getByTestId(testId)
    .or(page.getByRole(role, { name }))
    .or(page.locator(`[aria-label="${name}"]`));
}
