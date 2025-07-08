describe('Formulario de Evento', () => {
  const baseUrl = 'http://localhost:5173';
  const apiUrl = 'http://localhost:3005';

  beforeEach(() => {
    cy.visit(`${baseUrl}/eventos/crear`);
  });

  it('Valida campos requeridos', () => {
    cy.get('button[type="submit"]').click();
    cy.get('p').should('contain', 'Todos los campos obligatorios deben ser completados.');
  });

  it('Crea un evento exitosamente', () => {
    cy.intercept('POST', `${apiUrl}/api/eventos`, {
      statusCode: 201,
      body: { id: 1, nombre: 'Fiesta', descripcion: '', fecha: '2025-08-01', tipo: 'CUMPLEAÑOS' },
    }).as('createEvento');

    cy.get('input[type="text"]').type('Fiesta');
    cy.get('input[type="date"]').type('2025-08-01');
    cy.get('select').select('Cumpleaños');

    cy.get('button[type="submit"]').click();
    cy.wait('@createEvento');

    cy.url().should('include', '/eventos');
  });

  it('Muestra error si falla el backend al crear', () => {
    cy.intercept('POST', `${apiUrl}/api/eventos`, {
      statusCode: 500,
    }).as('createFail');

    cy.get('input[type="text"]').type('Evento Falla');
    cy.get('input[type="date"]').type('2025-09-01');
    cy.get('button[type="submit"]').click();

    cy.wait('@createFail');
    cy.get('p').should('contain', 'Ocurrió un error al guardar el evento.');
  });

  it('Carga datos para editar y guarda cambios', () => {
    // Simula modo edición
    cy.intercept('GET', `${apiUrl}/api/eventos/2`, {
      statusCode: 200,
      body: {
        id: 2,
        nombre: 'Boda Ana y Luis',
        descripcion: 'Evento elegante',
        fecha: '2025-12-15',
        tipo: 'BODA',
      },
    }).as('getEvento');

    cy.intercept('PUT', `${apiUrl}/api/eventos/2`, {
      statusCode: 200,
    }).as('updateEvento');

    cy.visit(`${baseUrl}/eventos/editar/2`);
    cy.wait('@getEvento');

    cy.get('input[type="text"]').clear().type('Boda Renombrada');
    cy.get('textarea').clear().type('Nueva descripción');
    cy.get('button[type="submit"]').click();

    cy.wait('@updateEvento');
    cy.url().should('include', '/eventos');
  });
});
