import { type Locator, type Page, expect } from '@playwright/test';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryList: Locator;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly burgerMenuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryList = page.locator('.inventory_list');
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  itemByName(name: string): Locator {
    return this.page.locator('.inventory_item').filter({ hasText: name });
  }

  async addToCartByName(name: string) {
    await this.itemByName(name).getByRole('button', { name: /add to cart/i }).click();
  }

  async removeFromCartByName(name: string) {
    await this.itemByName(name).getByRole('button', { name: /remove/i }).click();
  }

  async sortBy(option: SortOption) {
    await this.sortDropdown.selectOption(option);
  }

  async getProductNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const texts = await this.page.locator('.inventory_item_price').allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async expectCartCount(count: number) {
    if (count === 0) {
      await expect(this.cartBadge).toHaveCount(0);
    } else {
      await expect(this.cartBadge).toHaveText(String(count));
    }
  }

  async logout() {
    await this.burgerMenuButton.click();
    await this.logoutLink.click();
  }
}
