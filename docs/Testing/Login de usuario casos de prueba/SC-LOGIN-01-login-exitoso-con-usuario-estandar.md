# SC-LOGIN-01 — Login exitoso con usuario estándar

**ID**: SC-LOGIN-01

**Título**: Login exitoso con usuario estándar

**Prioridad**: Alta

**Tipo**: Funcional

**Precondiciones**:

- Navegador abierto en [https://www.saucedemo.com/](https://www.saucedemo.com/)

**Datos de entrada**:

- username: standard_user
- password: secret_sauce

**Pasos**:

1. Navegar a [https://www.saucedemo.com/](https://www.saucedemo.com/)
2. Completar credenciales válidas
3. Hacer click en LOGIN
4. Validar redirección a /inventory.html

**Resultado esperado**:

- Login exitoso
- Redirección a la página de productos
- No aparecen errores de validación

**Selector sugerido**:

- page.locator('[data-test="username"]')
- page.locator('[data-test="password"]')
- page.locator('[data-test="login-button"]')
