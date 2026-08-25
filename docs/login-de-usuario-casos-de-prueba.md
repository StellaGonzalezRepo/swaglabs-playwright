# Login de usuario - Casos de Prueba

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