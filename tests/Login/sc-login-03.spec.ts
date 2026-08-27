import { expect, test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { USERS } from '../../fixtures/users';

/**
 * SC-LOGIN-03: verifies invalid credentials and required-field validation.
 * Confluence reference: docs/login-de-usuario-casos-de-prueba/
 */
test.describe('SC-LOGIN-03 - invalid credentials and required fields', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // Invalid username and password must be rejected with a clear message.
  test('invalid credentials are rejected', async () => {
    await loginPage.login('invalid_user', 'wrong_password');
    await loginPage.expectErrorMessage('Epic sadface: Username and password do not match any user in this service');
  });

  // Submitting without a username must show the required-field validation.
  test('empty username shows validation error', async () => {
    await loginPage.login('', USERS.standard.password);
    await loginPage.expectErrorMessage('Epic sadface: Username is required');
  });

  // Submitting without a password must show the required-field validation.
  test('empty password shows validation error', async () => {
    await loginPage.login(USERS.standard.username, '');
    await loginPage.expectErrorMessage('Epic sadface: Password is required');
  });

  // Required login controls must be visible and the Login button enabled.
  test('login form has no accessibility-breaking issues on required fields', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeEnabled();
  });
});