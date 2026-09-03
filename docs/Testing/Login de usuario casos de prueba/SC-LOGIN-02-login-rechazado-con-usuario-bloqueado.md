# SC-LOGIN-02 — Login rechazado con usuario bloqueado

**ID**: SC-LOGIN-02

**Título**: Login rechazado con usuario bloqueado

**Prioridad**: Alta

**Tipo**: Negativo

**Precondiciones**:

- Navegador abierto en [https://www.saucedemo.com/](https://www.saucedemo.com/)

**Datos de entrada**:

- username: locked_out_user
- password: secret_sauce

**Pasos**:

1. Navegar a [https://www.saucedemo.com/](https://www.saucedemo.com/)
2. Completar credenciales del usuario bloqueado
3. Hacer click en LOGIN

**Resultado esperado**:

- Se muestra el mensaje: "Sorry, this user has been locked out"
- El usuario queda bloqueado
- No se inicia sesión

**Selector sugerido**:

- page.locator('[data-test="error"]')
