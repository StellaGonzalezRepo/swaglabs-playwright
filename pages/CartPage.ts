import { type Locator, type Page, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async expectItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }

  async removeItemByName(name: string) {
    await this.cartItems
      .filter({ hasText: name })
      .getByRole('button', { name: /remove/i })
      .click();
  }

  async goToCheckout() {
    await this.checkoutButton.click();
  }
}
