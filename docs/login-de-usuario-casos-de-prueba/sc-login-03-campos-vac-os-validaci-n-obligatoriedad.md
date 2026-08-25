# SC-LOGIN-03 — Campos vacíos (validación obligatoriedad)

**ID**: SC-LOGIN-03

  
**Título**: Intento de login sin completar ningún campo

  
**Prioridad**: Media

  
**Tipo**: Negativo — Validación de campos requeridos

  
**Precondiciones**:

*   Navegador abierto en [https://www.saucedemo.com/](https://www.saucedemo.com/)
    

  
**Datos de entrada**:

*   username: (vacío)
    
*   password: (vacío)
    

  
**Pasos**:

1.  Navegar a [https://www.saucedemo.com/](https://www.saucedemo.com/)
    
2.  Dejar ambos campos vacíos
    
3.  Hacer click en el botón LOGIN
    

  
**Resultado esperado**:

*   No hay redirección
    
*   Se muestra el mensaje: "Epic sadface: Username is required"
    

  
**Selector sugerido**:

*   \[data-test="error"\]