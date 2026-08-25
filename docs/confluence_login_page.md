# Login de usuario - Casos de Prueba

Contenido sincronizado desde Confluence (página raíz) — la carpeta `docs/login-de-usuario-casos-de-prueba/` contiene las subpáginas sincronizadas por caso.

ID

PÁGINA

Usuario

Tipo

Resultado esperado

Automatizable

SC-LOGIN-01

SC-LOGIN-01

standard\_user

Funcional

Éxito, sin errores

✅

SC-LOGIN-02

SC-LOGIN-02

locked\_out\_user

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

visual\_user

Visual

Éxito + diff visual esperado

✅ (regression visual)

SC-LOGIN-05

SC-LOGIN-05

performance\_glitch\_user

Performance

Éxito + latencia alta

✅ (con umbral configurable)

SC-LOGIN-06 (pendiente)

error\_user

Funcional (post-login)

Falla en acción posterior (ej. add to cart)

A definir según flujo siguiente

SC-LOGIN-07 (pendiente)

problem\_user

Funcional/Visual (post-login)

Imágenes rotas en catálogo

A definir según flujo siguiente

---

Subpáginas sincronizadas (carpeta): `docs/login-de-usuario-casos-de-prueba/`

- SC-LOGIN-01 — docs/login-de-usuario-casos-de-prueba/sc-login-01-login-exitoso-con-usuario-est-ndar.md
- SC-LOGIN-02 — docs/login-de-usuario-casos-de-prueba/sc-login-02-login-rechazado-con-usuario-bloqueado.md
- SC-LOGIN-03 — docs/login-de-usuario-casos-de-prueba/sc-login-03-campos-vacios-validaci-n-obligatoriedad.md
- SC-LOGIN-04 — docs/login-de-usuario-casos-de-prueba/sc-login-04-usuario-con-defectos-visuales.md
- SC-LOGIN-05 — docs/login-de-usuario-casos-de-prueba/sc-login-05-usuario-con-degradaci-n-de-performance.md

Referencia del script de automatización: [tests/login.spec.ts](tests/login.spec.ts)

