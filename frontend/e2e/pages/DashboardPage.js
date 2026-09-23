/**
 * Page Object Model for Dashboard Page & App Layout
 */
export class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('.page-title');
    this.navDashboard = page.locator('nav.sidebar-menu').getByRole('link', { name: 'Dashboard' });
    this.navDoctors = page.locator('nav.sidebar-menu').getByRole('link', { name: 'Doctors' });
    this.navPatients = page.locator('nav.sidebar-menu').getByRole('link', { name: 'Patients' });
    this.navAppointments = page.locator('nav.sidebar-menu').getByRole('link', { name: 'Appointments' });
    this.navSpecializations = page.locator('nav.sidebar-menu').getByRole('link', { name: 'Specializations' });
    this.navReports = page.locator('nav.sidebar-menu').getByRole('link', { name: 'Reports' });
    this.navSettings = page.locator('nav.sidebar-menu').getByRole('link', { name: 'Settings' });
    this.logoutButton = page.locator('button[title="Logout"]');
    this.userRoleBadge = page.locator('.sidebar-footer div').filter({ hasText: /ADMIN|DOCTOR|PATIENT/i });
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async logout() {
    await this.logoutButton.click();
  }
}
