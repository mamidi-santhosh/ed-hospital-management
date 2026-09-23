import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Authentication & Access Control', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto();
  });

  test('TC-AUTH-01: Admin user can log in successfully', async ({ page }) => {
    await loginPage.login('admin@hospital.com', 'admin123');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(dashboardPage.pageTitle).toContainText('Hospital Management Dashboard');
  });

  test('TC-AUTH-02: Doctor user can log in successfully', async ({ page }) => {
    await loginPage.login('dr.priya@hospital.com', 'doctor123');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(dashboardPage.pageTitle).toContainText('Hospital Management Dashboard');
  });

  test('TC-AUTH-03: Patient user can log in successfully', async ({ page }) => {
    await loginPage.login('rahul@gmail.com', 'patient123');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(dashboardPage.pageTitle).toContainText('Hospital Management Dashboard');
  });

  test('TC-AUTH-04: Invalid credentials displays an error message', async ({ page }) => {
    await loginPage.login('admin@hospital.com', 'wrongpassword');
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC-AUTH-05: Unauthenticated user is redirected to login page when accessing protected route', async ({ page }) => {
    await page.goto('/appointments');
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC-AUTH-06: Authenticated user can log out', async ({ page }) => {
    await loginPage.login('admin@hospital.com', 'admin123');
    await expect(page).toHaveURL(/\/dashboard/);
    await dashboardPage.logout();
    await expect(page).toHaveURL(/\/login/);
  });

  // --- Field Validation Test Cases ---

  test('TC-AUTH-VAL-01: Login form prevents submission when email or password is empty', async ({ page }) => {
    // Clear pre-filled input values
    await loginPage.emailInput.fill('');
    await loginPage.passwordInput.fill('');
    
    // Attempt submission
    await loginPage.signInButton.click();

    // Verify HTML5 required field validation prevents form submission
    const isEmailValid = await loginPage.emailInput.evaluate((el) => el.checkValidity());
    const isPasswordValid = await loginPage.passwordInput.evaluate((el) => el.checkValidity());

    expect(isEmailValid).toBe(false);
    expect(isPasswordValid).toBe(false);
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC-AUTH-VAL-02: Login form prevents submission when email format is invalid', async ({ page }) => {
    await loginPage.emailInput.fill('invalid-email-format');
    await loginPage.passwordInput.fill('admin123');
    await loginPage.signInButton.click();

    // Verify HTML5 typeMismatch validation for invalid email pattern
    const isEmailMismatch = await loginPage.emailInput.evaluate((el) => el.validity.typeMismatch);
    expect(isEmailMismatch).toBe(true);
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC-AUTH-VAL-03: Registration form validates required fields before submission', async ({ page }) => {
    await page.goto('/register');
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Registration page has required inputs for email & password
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    const isEmailValid = await emailInput.evaluate((el) => el.checkValidity());
    const isPasswordValid = await passwordInput.evaluate((el) => el.checkValidity());

    expect(isEmailValid).toBe(false);
    expect(isPasswordValid).toBe(false);
    await expect(page).toHaveURL(/\/register/);
  });
});
