describe('Formulario de Login', () => {
  const baseUrl = 'http://localhost:5173';
  const apiUrl = 'http://localhost:3005'; 

  beforeEach(() => {
    cy.visit(`${baseUrl}/login`);
  });

  it('Realiza login exitoso y redirige al dashboard correcto', () => {
    cy.intercept('POST', `${apiUrl}/api/auth/login`, {
      statusCode: 200,
      body: {
        token: 'fake-token-123',
        user: {
          username: 'juanito_Perez',
          rol: 'administrador'
        }
      }
    }).as('loginRequest');

   cy.get('input[id=email]').type('juanito_Perez');
 cy.get('input[id="password"]').type('juan123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');


    cy.url().should('include', '/admin/dashboard');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.eq('fake-token-123');
      const user = JSON.parse(win.localStorage.getItem('user'));
      expect(user.username).to.eq('juanito_Perez');
      expect(user.rol).to.eq('administrador');
    });
  });

  it('Muestra error con credenciales incorrectas', () => {
    cy.intercept('POST', `${apiUrl}/api/auth/login`, {
      statusCode: 401,
      body: { message: 'Credenciales inválidas' }
    }).as('loginFail');

    cy.get('input[id="email"]').type('usuarioX');
    cy.get('input[id="password"]').type('claveX');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginFail');

    cy.get('.alert-danger').should('contain', 'Credenciales inválidas');
  });
});
