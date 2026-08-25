import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { USERS } from '../fixtures/users';

/**
 * Documentación lista para Confluence: "Login de usuario - Casos de Prueba"
 *
 * Resumen: Pruebas de login para SauceDemo que verifican distintos estados
 * de autenticación (usuario estándar, usuario bloqueado, credenciales
 * inválidas y validaciones de campos obligatorios).
 *
 * Mapeo rápido de casos (copiar/pegar en Confluence):
 * - Caso: Inicio de sesión exitoso (standard user can log in successfully)
 *   Objetivo: Verificar que un usuario estándar puede iniciar sesión.
 *   Pasos: Navegar > Ingresar credenciales válidas > Pulsar Login
 *   Resultado esperado: Usuario redirigido al inventario.
 *
 * - Caso: Usuario bloqueado (locked out user sees a clear error message)
 *   Objetivo: Comprobar mensaje de error claro para usuario bloqueado.
 *   Pasos: Intentar login con usuario bloqueado
 *   Resultado esperado: Mostrar mensaje "Sorry, this user has been locked out."
 *
 * - Caso: Credenciales inválidas (invalid credentials are rejected)
 *   Objetivo: Validar rechazos por credenciales incorrectas.
 *   Pasos: Intentar login con credenciales inválidas
 *   Resultado esperado: Mostrar mensaje de error informativo.
 *
 * - Caso: Validaciones de campos (empty username/password)
 *   Objetivo: Asegurar que los campos obligatorios muestran el error.
 *   Pasos: Enviar formulario con campo vacío
 *   Resultado esperado: Mensaje de validación correspondiente.
 *
 * Referencia al script de prueba: tests/login.spec.ts
 */

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // SC-LOGIN-01 — Login exitoso con usuario estándar
  test('standard user can log in successfully', async () => {
    const { username, password } = USERS.standard;
    await loginPage.login(username, password);
    await loginPage.expectLoggedIn();
  });

  // SC-LOGIN-02 — Login rechazado con usuario bloqueado
  test('locked out user sees a clear error message', async () => {
    const { username, password } = USERS.lockedOut;
    await loginPage.login(username, password);
    await loginPage.expectErrorMessage('Epic sadface: Sorry, this user has been locked out.');
  });

  // SC-LOGIN-03 — Campos vacíos / validación / credenciales inválidas
  test('invalid credentials are rejected', async () => {
    await loginPage.login('invalid_user', 'wrong_password');
    await loginPage.expectErrorMessage('Epic sadface: Username and password do not match any user in this service');
  });

  test('empty username shows validation error', async () => {
    await loginPage.login('', USERS.standard.password);
    await loginPage.expectErrorMessage('Epic sadface: Username is required');
  });

  test('empty password shows validation error', async () => {
    await loginPage.login(USERS.standard.username, '');
    await loginPage.expectErrorMessage('Epic sadface: Password is required');
  });

  // SC-LOGIN-04 — Usuario con defectos visuales (visual regression)
  test.skip('SC-LOGIN-04 - Usuario con defectos visuales (visual checks)', async () => {
    // Este caso requiere pruebas visuales o revisión manual.
    // Recomendación: usar herramienta de visual-regression o capturas y comparar contra baseline.
  });

  // SC-LOGIN-05 — Usuario con degradación de performance (performance checks)
  test.skip('SC-LOGIN-05 - Usuario con degradación de performance (perf checks)', async () => {
    // Este caso requiere pruebas de carga/performance separadas.
    // Recomendación: usar scripts de carga y comparar tiempos/umbrales.
  });

  test('login form has no accessibility-breaking issues on required fields', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeEnabled();
  });
});
