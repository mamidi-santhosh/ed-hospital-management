import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AppointmentsPage } from '../pages/AppointmentsPage';

test.describe('Appointments Management', () => {
  let loginPage;
  let appointmentsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    appointmentsPage = new AppointmentsPage(page);

    // Login as Admin before running appointment test cases
    await loginPage.goto();
    await loginPage.login('admin@hospital.com', 'admin123');
    await expect(page).toHaveURL(/\/dashboard/);
    await appointmentsPage.goto();
  });

  test('TC-APPT-01: Appointments page renders status filter tabs and book button', async ({ page }) => {
    await expect(page).toHaveURL(/\/appointments/);
    await expect(appointmentsPage.filterAll).toBeVisible();
    await expect(appointmentsPage.filterPending).toBeVisible();
    await expect(appointmentsPage.filterConfirmed).toBeVisible();
    await expect(appointmentsPage.filterCancelled).toBeVisible();
    await expect(appointmentsPage.bookAppointmentButton).toBeVisible();
  });

  test('TC-APPT-02: Clicking status filter tabs updates filter selection', async ({ page }) => {
    await appointmentsPage.filterPending.click();
    await expect(appointmentsPage.filterPending).toHaveClass(/btn-primary/);

    await appointmentsPage.filterConfirmed.click();
    await expect(appointmentsPage.filterConfirmed).toHaveClass(/btn-primary/);

    await appointmentsPage.filterAll.click();
    await expect(appointmentsPage.filterAll).toHaveClass(/btn-primary/);
  });

  test('TC-APPT-03: Opening Book Appointment modal renders inputs properly', async ({ page }) => {
    await appointmentsPage.openBookingModal();
    await expect(appointmentsPage.modal).toBeVisible();
    await expect(appointmentsPage.confirmBookingButton).toBeVisible();
    
    // Close modal
    await appointmentsPage.cancelBookingButton.click();
    await expect(appointmentsPage.modal).not.toBeVisible();
  });
});
