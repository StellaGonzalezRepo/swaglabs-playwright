# SC-LOGIN-04 — Usuario con defectos visuales

**ID**: SC-LOGIN-04

  
**Título**: Login exitoso con visual\_user — detección de regresión visual

  
**Prioridad**: Media

  
**Tipo**: Visual (candidato a visual regression testing)

  
**Precondiciones**:

*   Navegador abierto en [https://www.saucedemo.com/](https://www.saucedemo.com/)
    
*   Screenshot baseline de la página de inventario disponible (para comparación)
    

  
**Datos de entrada**:

*   username: visual\_user
    
*   password: secret\_sauce
    

  
**Pasos**:

1.  Navegar a [https://www.saucedemo.com/](https://www.saucedemo.com/)
    
2.  Completar credenciales de visual\_user
    
3.  Hacer click en LOGIN
    
4.  Capturar screenshot de la página de inventario
    
5.  Comparar contra baseline (ej. con toHaveScreenshot() de Playwright)
    

  
**Resultado esperado**:

*   Login exitoso (misma validación funcional que SC-LOGIN-01)
    
*   La comparación visual detecta diferencias respecto al baseline (esperado, ya que este usuario simula defectos de UI)
    

  
**Selector sugerido**:

*   page.screenshot() / expect(page).toHaveScreenshot()