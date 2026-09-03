import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { USERS } from '../../fixtures/users';

test.describe('Inventory', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    inventoryPage = new InventoryPage(page);
    await inventoryPage.expectCartCount(0);
  });

  test('displays six products by default', async () => {
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('adding a product updates the cart badge', async () => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.expectCartCount(1);
  });

  test('adding multiple products accumulates in the cart badge', async () => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.addToCartByName('Sauce Labs Bike Light');
    await inventoryPage.addToCartByName('Sauce Labs Bolt T-Shirt');
    await inventoryPage.expectCartCount(3);
  });

  test('removing a product from the inventory page updates the badge', async () => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.expectCartCount(1);
    await inventoryPage.removeFromCartByName('Sauce Labs Backpack');
    await inventoryPage.expectCartCount(0);
  });

  test('sorting by name Z to A orders the list descending', async () => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('sorting by price low to high orders the list ascending', async () => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('sorting by price high to low orders the list descending', async () => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('logout returns the user to the login page', async ({ page }) => {
    await inventoryPage.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });
});

test.describe('Inventory - problem_user known bugs', () => {
  // Swag Labs seeds a "problem_user" that intentionally renders broken images.
  // Capturing that here documents real-world bug detection, not just happy paths.
  test('problem_user product images are all the same broken image (documented bug)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.problem.username, USERS.problem.password);

    const images = page.locator('.inventory_item_img img');
    const sources = await images.evaluateAll((imgs) =>
      imgs.map((img) => (img as HTMLImageElement).src)
    );
    const uniqueSources = new Set(sources);

    // Documents the known defect: all product images resolve to the same file.
    expect(uniqueSources.size).toBe(1);
  });
});
