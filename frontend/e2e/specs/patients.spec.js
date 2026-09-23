import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PatientsPage } from '../pages/PatientsPage';

test.describe('Patient Directory', () => {
  let loginPage;
  let patientsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    patientsPage = new PatientsPage(page);

    await loginPage.goto();
    await loginPage.login('admin@hospital.com', 'admin123');
    await expect(page).toHaveURL(/\/dashboard/);
    await patientsPage.goto();
  });

  test('TC-PAT-01: Patient Directory table renders correct headers', async ({ page }) => {
    await expect(page).toHaveURL(/\/patients/);
    await expect(patientsPage.searchInput).toBeVisible();
    await expect(patientsPage.tableHeaders.nth(0)).toHaveText('Patient Name');
    await expect(patientsPage.tableHeaders.nth(1)).toHaveText('Email');
    await expect(patientsPage.tableHeaders.nth(2)).toHaveText('Phone');
  });

  test('TC-PAT-02: Search input filters the patient directory list', async ({ page }) => {
    await patientsPage.search('NonExistentPatientXYZ999');
    await expect(page.getByText('No patients found.')).toBeVisible();

    await patientsPage.search('');
  });
});
