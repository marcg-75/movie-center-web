import { expect, test } from '@playwright/test';

test('should display the movie center page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Movie Center');
});
