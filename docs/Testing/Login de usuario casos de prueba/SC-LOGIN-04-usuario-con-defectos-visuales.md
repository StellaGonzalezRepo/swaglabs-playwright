# SC-LOGIN-04 — Usuario con defectos visuales

**ID**: SC-LOGIN-04

**Título**: Usuario visual con defectos visuales esperados

**Prioridad**: Baja

**Tipo**: Visual

**Precondiciones**:

- Navegador abierto en [https://www.saucedemo.com/](https://www.saucedemo.com/)

**Datos de entrada**:

- username: visual_user
- password: secret_sauce

**Pasos**:

1. Navegar a la página de login
2. Completar credenciales del usuario visual
3. Hacer click en LOGIN
4. Comparar con referencia visual esperada

**Resultado esperado**:

- Login exitoso
- Se detectan diferencias visuales esperadas
- Se puede reportar como caso de regression visual

**Selector sugerido**:

- page.locator('[data-test="login-button"]')
- page.locator('.inventory_list')
