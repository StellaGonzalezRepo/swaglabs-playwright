# Login de usuario casos de prueba

Contenido sincronizado desde Confluence (página raíz) — la carpeta `docs/Testing/Login de usuario casos de prueba/` contiene las subpáginas sincronizadas por caso.

ID

PÁGINA

Usuario

Tipo

Resultado esperado

Automatizable

SC-LOGIN-01

SC-LOGIN-01

standard_user

Funcional

Éxito, sin errores

✅

SC-LOGIN-02

SC-LOGIN-02

locked_out_user

Negativo

Bloqueo con mensaje

✅

SC-LOGIN-03

SC-LOGIN-03

(vacío)

Negativo

Validación de campo requerido

✅

SC-LOGIN-04

SC-LOGIN-04

visual_user

Visual

Éxito + diff visual esperado

✅ (regression visual)

SC-LOGIN-05

SC-LOGIN-05

performance_glitch_user

Performance

Éxito + latencia alta

✅ (con umbral configurable)

SC-LOGIN-06 (pendiente)

error_user

Funcional (post-login)

Falla en acción posterior (ej. add to cart)

A definir según flujo siguiente

SC-LOGIN-07 (pendiente)

problem_user

Funcional/Visual (post-login)

Imágenes rotas en catálogo

A definir según flujo siguiente

---

Subpáginas sincronizadas (carpeta): `docs/Testing/Login de usuario casos de prueba/`

- SC-LOGIN-01 — docs/Testing/Login de usuario casos de prueba/SC-LOGIN-01-login-exitoso-con-usuario-estandar.md
- SC-LOGIN-02 — docs/Testing/Login de usuario casos de prueba/SC-LOGIN-02-login-rechazado-con-usuario-bloqueado.md
- SC-LOGIN-03 — docs/Testing/Login de usuario casos de prueba/SC-LOGIN-03-campos-vacios-validacion-obligatoriedad.md
- SC-LOGIN-04 — docs/Testing/Login de usuario casos de prueba/SC-LOGIN-04-usuario-con-defectos-visuales.md
- SC-LOGIN-05 — docs/Testing/Login de usuario casos de prueba/SC-LOGIN-05-usuario-con-degradacion-de-performance.md
