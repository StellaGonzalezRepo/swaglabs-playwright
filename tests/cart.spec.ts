import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { USERS } from '../fixtures/users';

test.describe('Cart', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
  });

  test('cart reflects the products added from inventory', async () => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.addToCartByName('Sauce Labs Fleece Jacket');
    await inventoryPage.goToCart();
    await cartPage.expectItemCount(2);
  });

  test('removing an item from the cart page updates the list and badge', async () => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.addToCartByName('Sauce Labs Fleece Jacket');
    await inventoryPage.goToCart();
    await cartPage.expectItemCount(2);

    await cartPage.removeItemByName('Sauce Labs Backpack');
    await cartPage.expectItemCount(1);
    await inventoryPage.expectCartCount(1);
  });

  test('continue shopping returns to the inventory page', async ({ page }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.continueShoppingButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('empty cart cannot proceed to a broken state', async () => {
    await inventoryPage.goToCart();
    await cartPage.expectItemCount(0);
    // Checkout button is still reachable even with an empty cart;
    // documents current behavior rather than assuming it should be disabled.
    await expect(cartPage.checkoutButton).toBeEnabled();
  });
});
