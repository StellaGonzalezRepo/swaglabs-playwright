# Matriz de Casos de Prueba — Swag Labs (saucedemo.com)

**Proyecto:** Portfolio QA Automation — Swag Labs
**Autora:** Stella Maris Gonzalez
**Objetivo:** Casos de prueba funcionales, listos para cargar en Jira y automatizar con Playwright + TypeScript

---

## Usuarios de prueba disponibles

| Usuario | Password | Comportamiento |
|---|---|---|
| `standard_user` | `secret_sauce` | Funcionamiento normal, sin fallos |
| `locked_out_user` | `secret_sauce` | Bloqueado — no puede iniciar sesión |
| `problem_user` | `secret_sauce` | Imágenes rotas/incorrectas en el catálogo |
| `performance_glitch_user` | `secret_sauce` | Demoras artificiales de carga |
| `error_user` | `secret_sauce` | Errores en checkout / ordenamiento |
| `visual_user` | `secret_sauce` | Diferencias visuales sutiles (layout) |

---

## 1. Login

| ID | Caso de prueba | Precondición | Pasos | Resultado esperado | Prioridad |
|---|---|---|---|---|---|
| LOGIN-01 | Login exitoso con usuario estándar | Estar en la página de login | 1. Ingresar `standard_user` / `secret_sauce`<br>2. Click en Login | Redirige a Inventory (`/inventory.html`) | Alta |
| LOGIN-02 | Login con usuario bloqueado | Estar en la página de login | 1. Ingresar `locked_out_user` / `secret_sauce`<br>2. Click en Login | Mensaje de error: "Sorry, this user has been locked out" | Alta |
| LOGIN-03 | Login con usuario y contraseña vacíos | Estar en la página de login | 1. Dejar ambos campos vacíos<br>2. Click en Login | Mensaje de error: "Username is required" | Media |
| LOGIN-04 | Login con contraseña vacía | Estar en la página de login | 1. Ingresar usuario válido<br>2. Dejar contraseña vacía<br>3. Click en Login | Mensaje de error: "Password is required" | Media |
| LOGIN-05 | Login con credenciales incorrectas | Estar en la página de login | 1. Ingresar usuario/password inexistentes<br>2. Click en Login | Mensaje de error: "Username and password do not match any user in this service" | Alta |
| LOGIN-06 | Login con usuario con glitch de performance | Estar en la página de login | 1. Ingresar `performance_glitch_user` / `secret_sauce`<br>2. Click en Login | Login exitoso pero con demora notable de carga | Baja |
| LOGIN-07 | Logout desde sesión activa | Estar logueado | 1. Abrir menú hamburguesa<br>2. Click en Logout | Redirige a la página de login | Alta |

---

## 2. Catálogo de productos (Inventory)

| ID | Caso de prueba | Precondición | Pasos | Resultado esperado | Prioridad |
|---|---|---|---|---|---|
| INV-01 | Visualizar listado completo de productos | Sesión iniciada | 1. Ingresar a Inventory | Se muestran los 6 productos con nombre, imagen, precio y descripción | Alta |
| INV-02 | Ordenar productos por nombre A-Z | Estar en Inventory | 1. Seleccionar "Name (A to Z)" en el dropdown | Productos ordenados alfabéticamente ascendente | Media |
| INV-03 | Ordenar productos por nombre Z-A | Estar en Inventory | 1. Seleccionar "Name (Z to A)" en el dropdown | Productos ordenados alfabéticamente descendente | Media |
| INV-04 | Ordenar productos por precio menor a mayor | Estar en Inventory | 1. Seleccionar "Price (low to high)" | Productos ordenados por precio ascendente | Media |
| INV-05 | Ordenar productos por precio mayor a menor | Estar en Inventory | 1. Seleccionar "Price (high to low)" | Productos ordenados por precio descendente | Media |
| INV-06 | Agregar producto al carrito desde el listado | Estar en Inventory | 1. Click en "Add to cart" de un producto | Botón cambia a "Remove", badge del carrito incrementa en 1 | Alta |
| INV-07 | Quitar producto del carrito desde el listado | Producto ya agregado | 1. Click en "Remove" del producto | Botón vuelve a "Add to cart", badge decrementa | Alta |
| INV-08 | Ver detalle de un producto | Estar en Inventory | 1. Click en el nombre o imagen de un producto | Se muestra vista de detalle con descripción completa | Media |
| INV-09 | Volver al listado desde el detalle | Estar en vista de detalle | 1. Click en botón "Back to products" | Regresa a Inventory | Baja |
| INV-10 | Verificar imágenes rotas con `problem_user` | Login con `problem_user` | 1. Ingresar a Inventory | Todas las imágenes muestran el mismo placeholder incorrecto | Baja |

---

## 3. Carrito de compras (Cart)

| ID | Caso de prueba | Precondición | Pasos | Resultado esperado | Prioridad |
|---|---|---|---|---|---|
| CART-01 | Visualizar productos agregados en el carrito | Al menos 1 producto agregado | 1. Click en ícono del carrito | Se listan los productos agregados con nombre, precio y cantidad | Alta |
| CART-02 | Carrito vacío no muestra productos | Ningún producto agregado | 1. Click en ícono del carrito | El carrito se muestra vacío, sin badge numérico | Media |
| CART-03 | Quitar producto desde el carrito | Producto en el carrito | 1. Click en "Remove" en el carrito | Producto desaparece de la lista, badge decrementa | Alta |
| CART-04 | Continuar comprando desde el carrito | Estar en vista de carrito | 1. Click en "Continue Shopping" | Regresa a Inventory manteniendo los productos agregados | Media |
| CART-05 | Iniciar checkout desde el carrito | Al menos 1 producto en el carrito | 1. Click en "Checkout" | Redirige al paso 1 del checkout (información del cliente) | Alta |
| CART-06 | Intentar checkout con carrito vacío | Carrito vacío | 1. Acceder directamente a la vista de checkout | Se muestra la vista sin ítems o se redirige (validar comportamiento real) | Baja |

---

## 4. Checkout — Paso 1 (Información del cliente)

| ID | Caso de prueba | Precondición | Pasos | Resultado esperado | Prioridad |
|---|---|---|---|---|---|
| CHK1-01 | Completar formulario con datos válidos | Estar en checkout paso 1 | 1. Completar Nombre, Apellido, Código Postal<br>2. Click en "Continue" | Redirige a paso 2 (Overview) | Alta |
| CHK1-02 | Campo Nombre vacío | Estar en checkout paso 1 | 1. Dejar Nombre vacío, completar el resto<br>2. Click en "Continue" | Error: "First Name is required" | Alta |
| CHK1-03 | Campo Apellido vacío | Estar en checkout paso 1 | 1. Dejar Apellido vacío, completar el resto<br>2. Click en "Continue" | Error: "Last Name is required" | Alta |
| CHK1-04 | Campo Código Postal vacío | Estar en checkout paso 1 | 1. Dejar Código Postal vacío, completar el resto<br>2. Click en "Continue" | Error: "Postal Code is required" | Alta |
| CHK1-05 | Cancelar desde el checkout paso 1 | Estar en checkout paso 1 | 1. Click en "Cancel" | Regresa al carrito | Media |

---

## 5. Checkout — Paso 2 (Overview / Resumen)

| ID | Caso de prueba | Precondición | Pasos | Resultado esperado | Prioridad |
|---|---|---|---|---|---|
| CHK2-01 | Verificar resumen de productos | Estar en checkout paso 2 | 1. Revisar listado de productos | Coincide con lo agregado al carrito (cantidad, precio) | Alta |
| CHK2-02 | Verificar cálculo de subtotal | Estar en checkout paso 2 | 1. Revisar "Item total" | Suma correcta de los precios de los productos | Alta |
| CHK2-03 | Verificar cálculo de impuestos | Estar en checkout paso 2 | 1. Revisar "Tax" | Impuesto calculado correctamente sobre el subtotal | Media |
| CHK2-04 | Verificar total final | Estar en checkout paso 2 | 1. Revisar "Total" | Total = subtotal + impuestos | Alta |
| CHK2-05 | Finalizar la compra | Estar en checkout paso 2 | 1. Click en "Finish" | Redirige a pantalla de confirmación "Thank you for your order" | Alta |
| CHK2-06 | Cancelar desde el checkout paso 2 | Estar en checkout paso 2 | 1. Click en "Cancel" | Regresa a Inventory | Media |

---

## 6. Confirmación de compra

| ID | Caso de prueba | Precondición | Pasos | Resultado esperado | Prioridad |
|---|---|---|---|---|---|
| CONF-01 | Verificar mensaje de confirmación | Compra finalizada | 1. Revisar pantalla final | Se muestra "Thank you for your order!" con ícono de check | Alta |
| CONF-02 | Volver al catálogo tras confirmar | Estar en pantalla de confirmación | 1. Click en "Back Home" | Redirige a Inventory con el carrito vacío | Media |

---

## 7. Menú lateral (hamburguesa)

| ID | Caso de prueba | Precondición | Pasos | Resultado esperado | Prioridad |
|---|---|---|---|---|---|
| MENU-01 | Abrir y cerrar el menú lateral | Sesión iniciada | 1. Click en ícono de hamburguesa<br>2. Click en la "X" | El menú se abre y se cierra correctamente | Baja |
| MENU-02 | Navegar a "All Items" | Menú abierto | 1. Click en "All Items" | Redirige a Inventory | Baja |
| MENU-03 | Navegar a "About" | Menú abierto | 1. Click en "About" | Redirige a sitio externo (saucelabs.com) | Baja |
| MENU-04 | Reset App State | Producto(s) en el carrito | 1. Click en "Reset App State" | El carrito se vacía, badge desaparece (sin redirigir) | Media |
| MENU-05 | Logout desde el menú | Menú abierto | 1. Click en "Logout" | Cierra sesión y redirige al login | Alta |

---

## 8. Casos especiales por comportamiento de usuario

| ID | Caso de prueba | Precondición | Pasos | Resultado esperado | Prioridad |
|---|---|---|---|---|---|
| SPEC-01 | Errores en checkout con `error_user` | Login con `error_user` | 1. Intentar completar checkout | Se produce un error/comportamiento inesperado (a documentar según hallazgo) | Media |
| SPEC-02 | Ordenamiento fallido con `error_user` | Login con `error_user` | 1. Intentar ordenar productos | El ordenamiento falla o no responde como se espera | Baja |
| SPEC-03 | Diferencias visuales con `visual_user` | Login con `visual_user` | 1. Navegar por Inventory y carrito | Se detectan diferencias visuales sutiles respecto al usuario estándar | Baja |

---

## Notas para automatización (Playwright + TypeScript)

- **Prioridad de automatización sugerida:** Login (completo) → Inventory (agregar/quitar/ordenar) → Cart → Checkout (los 3 pasos) → casos negativos de formularios.
- **Page Object Model recomendado:** `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutStepOnePage`, `CheckoutStepTwoPage`, `CheckoutCompletePage`.
- Los casos de usuarios especiales (`problem_user`, `error_user`, `visual_user`) son buenos candidatos para *visual regression testing* o para documentar como "known issues" del sistema de prueba.
- Los IDs de casos (LOGIN-01, INV-01, etc.) están pensados para mapear 1 a 1 con tickets de Jira (ej: `TICKET-101` → LOGIN-01).