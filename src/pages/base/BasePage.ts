import { Page, Locator, expect } from '@playwright/test';
import { environment } from '../../config/environment';

type WaitOptions = Parameters<Locator['waitFor']>[0];

export abstract class BasePage {
  protected readonly page: Page;
  protected readonly baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = environment.baseUrl;
  }

  public async navigateTo(url: string): Promise<void> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    await this.page.goto(fullUrl, {
      waitUntil: 'domcontentloaded',
      timeout: environment.test.timeout,
    });
  }

  public async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  public async assertElementVisible(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeVisible();
  }

  public async waitForUrlToContain(text: string, timeout?: number): Promise<void> {
    await this.page.waitForURL(url => url.toString().includes(text), {
      timeout: timeout || environment.test.timeout,
    });
  }

  public async assertUrlContains(text: string, message?: string): Promise<void> {
    await expect(this.page, message).toHaveURL(new RegExp(text));
  }

  public async getElementText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }

  public async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  public async waitForElement(locator: string | Locator, options?: WaitOptions): Promise<Locator> {
  const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
  await element.waitFor({
    state: options?.state || 'visible',
    timeout: options?.timeout || environment.test.timeout,
  });
  return element;
}


  public async fillInput(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  public async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }

  public async assertElementContainsText(locator: Locator, expectedText: string, message?: string): Promise<void> {
    await expect(locator, message).toContainText(expectedText);
  }
}
