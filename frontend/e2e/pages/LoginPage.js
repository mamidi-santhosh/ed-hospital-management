/**
 * Page Object Model for Login Page
 */
export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.signInButton = page.locator('button[type="submit"]');
    this.heading = page.getByRole('heading', { name: 'Hospital Management' });
    this.registerLink = page.getByRole('link', { name: 'Register as Patient' });
    this.errorBanner = page.locator('.auth-card > div').filter({ hasNotText: 'Hospital Management' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
