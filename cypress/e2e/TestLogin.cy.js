describe('Login Form Validation and Authentication', () => {
	const validUsername = 'testuser';
	const validPassword = 'password123';

	beforeEach(() => {
		cy.visit('/login');
	});

	it('Muestra errores de validación cuando los campos están vacíos', () => {
		cy.get('button[type="submit"]').click();

		cy.contains('Este campo es requerido').should('exist');
		cy.get('#username').should('have.class', 'input-error');
		cy.get('#password').should('have.class', 'input-error');
	});

	it('Permite ingresar valores en los campos', () => {
		cy.get('#username')
			.type(validUsername)
			.should('have.value', validUsername);
		cy.get('#password')
			.type(validPassword)
			.should('have.value', validPassword);
	});

	it('Login exitoso redirige a Eventos (/eventos)', () => {
		cy.intercept('POST', '**/token/', {
			statusCode: 200,
			body: {
				access: 'fake_access_token',
				refresh: 'fake_refresh_token',
			},
		}).as('loginRequest');

		cy.intercept('GET', '**/auth/me/', {
			statusCode: 200,
			body: {
				id: 1,
				username: validUsername,
			},
		}).as('meRequest');

		cy.get('#username').type(validUsername);
		cy.get('#password').type(validPassword);
		cy.get('button[type="submit"]').click();

		cy.wait('@loginRequest');
		cy.wait('@meRequest');

		cy.url().should('include', '/eventos');
	});
});
