# SC-LOGIN-02 — Login rechazado con usuario bloqueado

**ID**: SC-LOGIN-02

  
**Título**: Login fallido con locked\_out\_user

  
**Prioridad**: Alta

  
**Tipo**: Negativo

  
**Precondiciones**:

*   Navegador abierto en [https://www.saucedemo.com/](https://www.saucedemo.com/)
    
*   No hay sesión activa previa
    

  
**Datos de entrada**:

*   username: locked\_out\_user
    
*   password: secret\_sauce
    

  
**Pasos**:

1.  Navegar a [https://www.saucedemo.com/](https://www.saucedemo.com/)
    
2.  Completar el campo username con "locked\_out\_user"
    
3.  Completar el campo password con "secret\_sauce"
    
4.  Hacer click en el botón LOGIN
    

  
**Resultado esperado**:

*   La URL permanece en [https://www.saucedemo.com/](https://www.saucedemo.com/)
    
*   Se muestra el mensaje de error: "Epic sadface: Sorry, this user has been locked out."
    
*   El formulario mantiene el borde rojo de error en los inputs
    

  
**Selector sugerido**:

*   \[data-test="error"\] (contenedor del mensaje de error)
    
*   input\[data-test="username"\].error (validación visual)