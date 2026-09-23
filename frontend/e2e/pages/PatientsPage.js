/**
 * Page Object Model for Patients Directory Page
 */
export class PatientsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search patients...');
    this.tableRows = page.locator('table.custom-table tbody tr');
    this.tableHeaders = page.locator('table.custom-table th');
  }

  async goto() {
    await this.page.goto('/patients');
  }

  async search(query) {
    await this.searchInput.fill(query);
  }
}
