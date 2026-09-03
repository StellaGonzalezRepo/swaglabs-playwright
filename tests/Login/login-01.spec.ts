import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { USERS } from '../../fixtures/users';

test('LOGIN-01 - login exitoso con usuario estandar', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  const { username, password } = USERS.standard;
  await loginPage.login(username, password);
  await loginPage.expectLoggedIn();
});