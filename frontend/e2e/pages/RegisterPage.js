/**
 * Page Object Model for Patient Registration Page
 */
export class RegisterPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.nameInput = page.locator('input').filter({ hasText: '' }).nth(0);
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.phoneInput = page.locator('input[type="text"]').last();
    this.submitButton = page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto('/register');
  }
}
