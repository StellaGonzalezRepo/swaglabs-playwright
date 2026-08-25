# SC-LOGIN-01 — Login exitoso con usuario estándar

**ID**: SC-LOGIN-01  

**Título**: Login exitoso con standard\_user  

**Prioridad**: Alta  

**Tipo**: Funcional — Camino feliz  

**Precondiciones**:

*   Navegador abierto en [https://www.saucedemo.com/](https://www.saucedemo.com/)
    
*   No hay sesión activa previa
    

  
**Datos de entrada**: Valores exactos a usar

*   username: standard\_user
    
*   password: secret\_sauce  
    

**Pasos**:

1.  Navegar a [https://www.saucedemo.com/](https://www.saucedemo.com/)
    
2.  Completar el campo username con "standard\_user"
    
3.  Completar el campo password con "secret\_sauce"
    
4.  Hacer click en el botón LOGIN  
    

**Resultado esperado**:

*   La URL cambia a [https://www.saucedemo.com/inventory.html](https://www.saucedemo.com/inventory.html)
    
*   Se visualiza el título "Products"
    
*   Se listan 6 productos sin errores visuales
    

**Selector sugerido**:

*   input\[data-test="username"\]
    
*   input\[data-test="password"\]
    
*   input\[data-test="login-button"\]
    
*   .title (validación de texto "Products")