describe('Formulario de Usuario', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3005/api/auth/login', {
      username: 'juanito_Perez',
      password: 'juan123'
    }).then((response) => {
      window.localStorage.setItem('token', response.body.token);
    });
  });

  it('Crea un nuevo usuario correctamente', () => {
   cy.wait(3000);
   
    cy.visit('http://localhost:5173/admin/usuarios/create', {
      onBeforeLoad(win) {
        const token = window.localStorage.getItem('token');
        const user=window.localStorage.getItem('user');
        if (token) {
          win.localStorage.setItem('token', token);
          win.localStorage.setItem('user',user);
        }
      }
    });

    cy.get('input[placeholder="Ingrese el nombre de usuario"]').type('usuario_test');
    cy.get('input[placeholder="Ingrese el nombre"]').type('Test');
    cy.get('input[placeholder="Ingrese el apellido"]').type('Usuario');
    cy.get('input[placeholder="Ingrese el email"]').type('testusuario@example.com');
    cy.get('input[placeholder="Ingrese la contraseña"]').type('password123');

    cy.get('select').should('exist').should('not.have.value', '');
    cy.get('select').then((select) => {
      const options = select.find('option');
      if (options.length > 1) {
        cy.get('select').select(options[1].value);
      }
    });

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/admin/usuarios');
  });
});
