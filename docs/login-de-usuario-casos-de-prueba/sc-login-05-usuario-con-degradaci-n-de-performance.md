# SC-LOGIN-05 — Usuario con degradación de performance

**ID**: SC-LOGIN-05

  
**Título**: Medición de tiempo de respuesta con performance\_glitch\_user

  
**Prioridad**: Baja

  
**Tipo**: Performance (no funcional)

  
**Precondiciones**:

*   Navegador abierto en [https://www.saucedemo.com/](https://www.saucedemo.com/)
    

  
**Datos de entrada**:

*   username: performance\_glitch\_user
    
*   password: secret\_sauce
    

  
**Pasos**:

1.  Navegar a [https://www.saucedemo.com/](https://www.saucedemo.com/)
    
2.  Completar credenciales de performance\_glitch\_user
    
3.  Registrar timestamp antes del click en LOGIN
    
4.  Hacer click en LOGIN
    
5.  Esperar a que cargue /inventory.html
    
6.  Registrar timestamp de carga completa
    

  
**Resultado esperado**:

*   Login exitoso
    
*   El tiempo de carga es sensiblemente mayor al de standard\_user (referencia: varios segundos de diferencia)
    
*   Se puede establecer un umbral (ej. > 3000ms) como criterio de fallo en el pipeline
    

  
**Selector sugerido**:

*   page.waitForURL() combinado con Date.now() antes/después