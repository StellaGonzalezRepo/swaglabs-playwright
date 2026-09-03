# SC-LOGIN-03 — Campos vacíos / validación de obligatoriedad

**ID**: SC-LOGIN-03

**Título**: Validación de obligatoriedad con campos vacíos

**Prioridad**: Media

**Tipo**: Negativo

**Precondiciones**:

- Navegador abierto en [https://www.saucedemo.com/](https://www.saucedemo.com/)

**Datos de entrada**:

- username: vacío
- password: vacío

**Pasos**:

1. Dejar ambos campos vacíos
2. Hacer click en LOGIN

**Resultado esperado**:

- Se muestra un mensaje de validación
- El sistema no permite continuar

**Selector sugerido**:

- page.locator('[data-test="error"]')
