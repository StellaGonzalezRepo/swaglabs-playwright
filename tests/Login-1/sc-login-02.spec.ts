import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { USERS } from '../../fixtures/users';

/**
 * SC-LOGIN-02: verifies that a locked-out user receives the expected error.
 * Confluence reference: docs/login-de-usuario-casos-de-prueba/
 */
test('SC-LOGIN-02 - locked out user sees a clear error message', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  const { username, password } = USERS.lockedOut;
  await loginPage.login(username, password);
  await loginPage.expectErrorMessage('Epic sadface: Sorry, this user has been locked out.');
});