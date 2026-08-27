import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { USERS } from '../../fixtures/users';

/**
 * SC-LOGIN-01: verifies that a standard user can log in successfully.
 * Confluence reference: docs/login-de-usuario-casos-de-prueba/
 */
test('SC-LOGIN-01 - standard user can log in successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  const { username, password } = USERS.standard;
  await loginPage.login(username, password);
  await loginPage.expectLoggedIn();
});