import { type Locator, type Page, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  // Step one: information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // Step two: overview
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly summarySubtotal: Locator;
  readonly summaryTax: Locator;
  readonly summaryTotal: Locator;

  // Complete
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
    this.errorMessage = page.locator('[data-test="error"]');

    this.finishButton = page.locator('#finish');
    this.cancelButton = page.locator('#cancel');
    this.summarySubtotal = page.locator('.summary_subtotal_label');
    this.summaryTax = page.locator('.summary_tax_label');
    this.summaryTotal = page.locator('.summary_total_label');

    this.completeHeader = page.locator('.complete-header');
    this.backHomeButton = page.locator('#back-to-products');
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async expectOrderComplete() {
    await expect(this.completeHeader).toHaveText(/Thank you for your order/i);
  }

  /** Parses "Item total: $29.99" -> 29.99 */
  private async parseAmount(locator: Locator): Promise<number> {
    const text = await locator.textContent();
    return parseFloat((text ?? '').replace(/[^0-9.]/g, ''));
  }

  async getSubtotal(): Promise<number> {
    return this.parseAmount(this.summarySubtotal);
  }

  async getTax(): Promise<number> {
    return this.parseAmount(this.summaryTax);
  }

  async getTotal(): Promise<number> {
    return this.parseAmount(this.summaryTotal);
  }
}
