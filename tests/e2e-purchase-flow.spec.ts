import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, CHECKOUT_INFO } from '../fixtures/users';

/**
 * Full end-to-end journey: login -> browse -> add to cart -> checkout -> confirm.
 * This is the scenario most useful to showcase (e.g. as a recorded run/GIF),
 * since it exercises every page object in a single, realistic user story.
 */
test('standard user completes a full purchase end to end', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await test.step('Log in', async () => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await loginPage.expectLoggedIn();
  });

  await test.step('Sort products by price, low to high', async () => {
    await inventoryPage.sortBy('lohi');
  });

  await test.step('Add two products to the cart', async () => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.addToCartByName('Sauce Labs Onesie');
    await inventoryPage.expectCartCount(2);
  });

  await test.step('Review the cart', async () => {
    await inventoryPage.goToCart();
    await cartPage.expectItemCount(2);
    await cartPage.goToCheckout();
  });

  await test.step('Fill in checkout information', async () => {
    await checkoutPage.fillInformation(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );
  });

  await test.step('Finish the order and confirm', async () => {
    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderComplete();
  });
});
