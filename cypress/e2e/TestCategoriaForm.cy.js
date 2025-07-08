describe('Formulario de categoría', () => {
  beforeEach(() => {
    // Login antes de cada test
    cy.request({
      method: 'POST',
      url: 'http://localhost:3005/api/auth/login',
      body: {
        username: 'juanito_Perez',
        password: 'juan123'
      }
    }).then((response) => {
      // Guardar el token en localStorage antes de visitar la página
      window.localStorage.setItem('authToken', response.body.token);
    });
  });

  it('Crea una nueva categoría', () => {
    cy.wait(3000);
    // Visitar la página después de guardar el token
    cy.visit('http://localhost:5173/createCategoria/', {
      onBeforeLoad(win) {
        // Establecer el token ANTES de que cargue la app
        const token = window.localStorage.getItem('authToken');
        if (token) {
          win.localStorage.setItem('authToken', token);
        }
      }
    });

    // Rellenar el formulario
    cy.get('input[type="text"]').type('Nueva Categoría');
    cy.get('button[type="submit"]').click();

    // Verificar la redirección o resultado esperado
    cy.url().should('eq', 'http://localhost:5173/categoria');
  });
});
