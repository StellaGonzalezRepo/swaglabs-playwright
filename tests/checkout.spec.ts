import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, CHECKOUT_INFO } from '../fixtures/users';

test.describe('Checkout', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.addToCartByName('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    await cartPage.goToCheckout();
  });

  test('missing required fields blocks progress with a clear error', async () => {
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('valid information advances to the order overview', async ({ page }) => {
    await checkoutPage.fillInformation(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  test('order total equals subtotal plus tax', async () => {
    await checkoutPage.fillInformation(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );

    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('completing the order shows the confirmation screen', async () => {
    await checkoutPage.fillInformation(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );
    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderComplete();
  });

  test('cancel on the overview step returns to inventory', async ({ page }) => {
    await checkoutPage.fillInformation(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );
    await checkoutPage.cancelButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('after completing an order, the cart badge resets to empty', async () => {
    await checkoutPage.fillInformation(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );
    await checkoutPage.finishOrder();
    await checkoutPage.backHomeButton.click();
    await inventoryPage.expectCartCount(0);
  });
});
