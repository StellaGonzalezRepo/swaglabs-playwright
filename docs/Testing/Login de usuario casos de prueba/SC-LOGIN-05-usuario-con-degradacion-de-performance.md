# SC-LOGIN-05 — Usuario con degradación de performance

**ID**: SC-LOGIN-05

**Título**: Medición de tiempo de respuesta con performance_glitch_user

**Prioridad**: Baja

**Tipo**: Performance (no funcional)

**Precondiciones**:

- Navegador abierto en [https://www.saucedemo.com/](https://www.saucedemo.com/)

**Datos de entrada**:

- username: performance_glitch_user
- password: secret_sauce

**Pasos**:

1. Navegar a [https://www.saucedemo.com/](https://www.saucedemo.com/)
2. Completar credenciales de performance_glitch_user
3. Registrar timestamp antes del click en LOGIN
4. Hacer click en LOGIN
5. Esperar a que cargue /inventory.html
6. Registrar timestamp de carga completa

**Resultado esperado**:

- Login exitoso
- El tiempo de carga es sensiblemente mayor al de standard_user
- Se puede establecer un umbral como criterio de fallo

**Selector sugerido**:

- page.waitForURL()
- Date.now() antes y después del login
