import { Page, Locator } from '@playwright/test';
import { BasePage } from './base/BasePage';

/**
 * Login Page Object Model
 * Encapsulates all elements and actions for the login page
 */
export class LoginPage extends BasePage {
  // Page URL
  private readonly loginUrl = '/practice-test-login/';

  // Locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly pageTitle: Locator;

  // Success page elements
  private readonly successMessage: Locator;
  private readonly logoutButton: Locator;
  private readonly successPageTitle: Locator;

  // Error page elements
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.usernameInput = this.page.locator('#username');
    this.passwordInput = this.page.locator('#password');
    this.submitButton = this.page.locator('#submit');
    this.pageTitle = this.page.locator('h2');

    // Success page locators
    this.successMessage = this.page.locator('.post-title');
    this.logoutButton = this.page.locator('a:has-text("Log out")');
    this.successPageTitle = this.page.locator('h1');

    // Error page locators
    this.errorMessage = this.page.locator('#error');
  }

  /**
   * Navigate to login page
   */
  public async navigateToLoginPage(): Promise<void> {
    await this.navigateTo(this.loginUrl);
    await this.waitForPageLoad();
  }

  /**
   * Enter username
   */
  public async enterUsername(username: string): Promise<void> {
    await this.waitForElement(this.usernameInput);
    await this.fillInput(this.usernameInput, username);
  }

  /**
   * Enter password
   */
  public async enterPassword(password: string): Promise<void> {
    await this.waitForElement(this.passwordInput);
    await this.fillInput(this.passwordInput, password);
  }

  /**
   * Click submit button
   */
  public async clickSubmit(): Promise<void> {
    await this.waitForElement(this.submitButton);
    await this.clickElement(this.submitButton);
  }
  
   /**
   * Perform complete login flow
   */
  public async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickSubmit();
  }

  // Validation methods

  /**
   * Validate login page is loaded
   */
  public async validateLoginPageLoaded(): Promise<void> {
    await this.assertElementVisible(this.usernameInput, 'Username field should be visible');
    await this.assertElementVisible(this.passwordInput, 'Password field should be visible');
    await this.assertElementVisible(this.submitButton, 'Submit button should be visible');
    await this.assertUrlContains('/practice-test-login/', 'Should be on login page');
  }

  /**
   * Validate login page is loaded
   */
  public async validateFailedLogin(): Promise<void> {
    await this.assertElementVisible(this.errorMessage, 'Error message should be visible');
    await this.assertElementContainsText(this.errorMessage, 'Your username is invalid!', 'Error message should contain "Your username is invalid!"');
  }

  /**
   * Validate successful login
   */
  public async validateSuccessfulLogin(): Promise<void> {
    await this.assertUrlContains('/logged-in-successfully/', 'Should be on success page');
    await this.assertElementVisible(this.successMessage, 'Success message should be visible');
    await this.assertElementContainsText(this.successMessage, 'Logged In Successfully', 'Success message should contain "Logged In Successfully"');
    await this.assertElementVisible(this.logoutButton, 'Logout button should be visible');
  }

  // Success page methods

  /**
   * Check if login was successful by verifying URL
   */
  public async isLoginSuccessful(): Promise<boolean> {
    try {
      await this.waitForUrlToContain('/logged-in-successfully/', 10000);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get success message text
   */
  public async getSuccessMessage(): Promise<string> {
    await this.waitForElement(this.successMessage);
    return await this.getElementText(this.successMessage);
  }

  /**
   * Check if logout button is visible
   */
  public async isLogoutButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.logoutButton);
  }
}
