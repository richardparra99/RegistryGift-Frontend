describe('Formulario de Registro', () => {
	const baseUrl = 'http://localhost:5173';
	const apiUrl = 'http://localhost:8000'; // Ajusta si es diferente
	const username = 'nuevo_usuario';
	const email = 'nuevo@correo.com';
	const password = 'claveSegura123';

	beforeEach(() => {
		cy.visit(`${baseUrl}/register`);
		cy.wait(300);
	});

	it('Valida que todos los campos sean requeridos', () => {
		cy.get('button[type="submit"]').click();

		cy.contains('Este campo es requerido').should('exist');
		cy.get('#username').should('have.class', 'input-error');
		cy.get('#email').should('have.class', 'input-error');
		cy.get('#password').should('have.class', 'input-error');
	});

	it('Permite llenar todos los campos correctamente', () => {
		cy.get('#username').type(username, { delay: 100 });
		cy.get('#email').type(email, { delay: 100 });
		cy.get('#password').type(password, { delay: 100 });

		cy.get('#username').should('have.value', username);
		cy.get('#email').should('have.value', email);
		cy.get('#password').should('have.value', password);
	});

	it('Envío exitoso redirige al login', () => {
		cy.intercept('POST', `**/auth/register/`, {
			statusCode: 200,
			body: {
				message: 'Usuario registrado correctamente',
			},
		}).as('registerSuccess');

		cy.get('#username').type(username);
		cy.get('#email').type(email);
		cy.get('#password').type(password);
		cy.get('button[type="submit"]').click();

		cy.wait('@registerSuccess');
		cy.url().should('include', '/login');
	});

	it('Muestra mensaje de error si ya existe el usuario', () => {
		cy.intercept('POST', `**/auth/register/`, {
			statusCode: 400,
			body: {
				error: 'Ocurrió un error al registrarse.',
			},
		}).as('registerError');

		cy.get('#username').type(username);
		cy.get('#email').type(email);
		cy.get('#password').type(password);
		cy.get('button[type="submit"]').click();

		cy.wait('@registerError');

		cy.get('.text-red-500')
			.should('be.visible')
			.and('contain', 'Ocurrió un error al registrarse.');
	});
});
