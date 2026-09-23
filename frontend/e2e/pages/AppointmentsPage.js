/**
 * Page Object Model for Appointments Page
 */
export class AppointmentsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.bookAppointmentButton = page.getByRole('button', { name: 'Book Appointment' });
    
    // Modal Locators
    this.modal = page.locator('.modal-content');
    this.patientSelect = this.modal.locator('select').nth(0);
    this.doctorSelect = this.modal.locator('select').filter({ hasText: 'Select Doctor' });
    this.dateInput = this.modal.locator('input[type="date"]');
    this.timeSlotSelect = this.modal.locator('select').filter({ hasText: '09:00 AM' });
    this.reasonInput = this.modal.locator('textarea');
    this.confirmBookingButton = this.modal.getByRole('button', { name: 'Confirm Booking' });
    this.cancelBookingButton = this.modal.getByRole('button', { name: 'Cancel' });

    // Filter Buttons
    this.filterAll = page.getByRole('button', { name: 'ALL' });
    this.filterPending = page.getByRole('button', { name: 'PENDING' });
    this.filterConfirmed = page.getByRole('button', { name: 'CONFIRMED' });
    this.filterCancelled = page.getByRole('button', { name: 'CANCELLED' });

    // Table Locators
    this.tableRows = page.locator('table.custom-table tbody tr');
  }

  async goto() {
    await this.page.goto('/appointments');
  }

  async openBookingModal() {
    await this.bookAppointmentButton.click();
  }

  async bookAppointment({ doctorIndex = 1, date = '2026-10-15', timeSlot = '10:00 AM', reason = 'Checkup' }) {
    await this.openBookingModal();
    
    // Select Doctor (index 1 is first available doctor)
    await this.doctorSelect.selectOption({ index: doctorIndex });
    await this.dateInput.fill(date);
    await this.timeSlotSelect.selectOption(timeSlot);
    await this.reasonInput.fill(reason);
    
    await this.confirmBookingButton.click();
  }

  async filterByStatus(statusName) {
    await this.page.getByRole('button', { name: statusName, exact: true }).click();
  }
}
