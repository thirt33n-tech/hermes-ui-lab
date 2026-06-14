import { test as base } from '@playwright/test';

// Extendable base fixture — extend per project to add auth state, seeded DB, etc.
export const test = base.extend({});
export { expect } from '@playwright/test';
