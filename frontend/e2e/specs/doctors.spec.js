import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Doctors Directory', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin@hospital.com', 'admin123');
    await expect(page).toHaveURL(/\/dashboard/);
    await page.goto('/doctors');
  });

  test('TC-DOC-01: Doctors directory renders search and specialization selector', async ({ page }) => {
    await expect(page).toHaveURL(/\/doctors/);
    await expect(page.getByPlaceholder('Search by doctor name or specialization...')).toBeVisible();
    await expect(page.locator('select.form-select')).toBeVisible();
  });

  test('TC-DOC-02: Admin user sees the Add Doctor button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Add Doctor' })).toBeVisible();
  });
});
