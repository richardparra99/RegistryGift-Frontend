describe('Formulario de roles', () => {
  let token;
   let user;

  beforeEach(() => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3005/api/auth/login',
      body: {
        username: 'juanito_Perez',
        password: 'juan123'
      }
    }).then((response) => {
      token = response.body.token;
      user = response.body.user;
    });
  });

  it('Crea un nuevo rol', () => {
    cy.wait(3000)
    cy.visit('http://localhost:5173/admin/roles/create', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', token);
        win.localStorage.setItem('user', JSON.stringify(user));
      }
    });

    cy.get('input[type="text"]').type('Nuevo Rol');
    cy.get('button[type="submit"]').click();

    cy.url().should('eq', 'http://localhost:5173/admin/roles/');
  });
});
