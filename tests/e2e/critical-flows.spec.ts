import { expect, test } from '@playwright/test';

test('home page reaches every calculator family', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Measure it.');
  for (const name of ['Paint', 'Flooring & tile', 'Mulch, soil & gravel', 'Concrete', 'Fence']) await expect(page.getByRole('link', { name: new RegExp(name) }).first()).toBeVisible();
});

test('paint project calculates, saves, restores, and shares', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/calculators/paint/');
  await page.getByLabel('Project name').fill('Downstairs repaint');
  await page.getByRole('button', { name: 'Calculate project' }).click();
  await expect(page.getByRole('heading', { name: 'Downstairs repaint' })).toBeVisible();
  await expect(page.getByText('301', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Save locally' }).click();
  await expect(page.getByText('Saved in this browser.')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Project name')).toHaveValue('Downstairs repaint');
  await page.getByRole('button', { name: 'Copy share link' }).click();
  await expect(page.getByText(/Share link copied/)).toBeVisible();
  await expect(page).toHaveURL(/\?project=/);
});

test('concrete calculator compares bag sizes', async ({ page }) => {
  await page.goto('/calculators/concrete/');
  await page.getByRole('button', { name: 'Calculate project' }).click();
  await expect(page.getByRole('heading', { name: 'Which package is cheaper?' })).toBeVisible();
  await expect(page.getByText('Lowest entered bag cost')).toBeVisible();
});

test('measurement visual responds to calculator inputs', async ({ page }) => {
  await page.goto('/calculators/paint/');
  await expect(page.getByRole('heading', { name: 'Live room surface preview' })).toBeVisible();
  await expect(page.getByText('12 x 8 ft', { exact: true })).toBeVisible();
  await page.locator('.item-card').getByLabel('Length ft').fill('16');
  await expect(page.getByText('16 x 8 ft', { exact: true })).toBeVisible();
});

test('print view contains only the branded project sheet and project data', async ({ page }) => {
  await page.goto('/calculators/paint/');
  await page.getByRole('button', { name: 'Calculate project' }).click();
  await page.evaluate(() => document.documentElement.classList.add('printing-project'));
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.print-sheet-brand')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Project inputs' })).toBeVisible();
  await expect(page.getByText('Shopping list', { exact: true })).toBeVisible();
  await expect(page.locator('.page-hero')).toBeHidden();
  await expect(page.locator('.calculation-visual')).toBeHidden();
  await expect(page.locator('.ad-slot').first()).toBeHidden();
});

test('mobile navigation works from a guide route', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile-only navigation check');
  await page.goto('/guides/paint-coverage/');
  await page.getByLabel('Open navigation').click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Concrete' }).click();
  await expect(page).toHaveURL('/calculators/concrete/');
});
