describe('EventoForm', () => {
  const baseUrl = 'http://localhost:5173';
  const eventId = 42;

  context('Modo creación', () => {
    beforeEach(() => {
      cy.visit(`${baseUrl}/eventos/crear`);
    });

    it('Muestra error si los campos obligatorios están vacíos', () => {
      cy.get('button[type="submit"]').click();
      cy.contains('Todos los campos obligatorios deben ser completados.').should('be.visible');
    });

    it('Crea evento exitosamente y redirige al detalle', () => {
      cy.intercept('POST', '**/events/', {
        statusCode: 201,
        body: {
          id: eventId,
          name: 'Evento Test',
          description: 'Descripción',
          datetime: '2025-07-20T00:00:00Z',
          type: 'birthday',
          color: 'red',
          private: false,
        },
      }).as('createEvent');

      cy.get('input[type="text"]').type('Evento Test');
      cy.get('textarea').type('Descripción');
      cy.get('input[type="date"]').type('2025-07-20');
      cy.get('select').eq(0).select('Cumpleaños'); // label visible
      cy.get('select').eq(1).select('Rojo');
      cy.get('button[type="submit"]').click();

      cy.wait('@createEvent');
      cy.url().should('include', `/app/detail/${eventId}`);
    });

    it('Muestra error si falla la creación del evento', () => {
      cy.intercept('POST', '**/events/', {
        statusCode: 500,
        body: {},
      }).as('createEventFail');

      cy.get('input[type="text"]').type('Evento con Error');
      cy.get('input[type="date"]').type('2025-07-20');
      cy.get('select').eq(0).select('Cumpleaños');
      cy.get('select').eq(1).select('Rojo');
      cy.get('button[type="submit"]').click();

      cy.wait('@createEventFail');
      cy.contains('Ocurrió un error al guardar el evento.').should('be.visible');
    });
  });

  context('Modo edición', () => {
    beforeEach(() => {
      cy.intercept('GET', `**/events/${eventId}/`, {
        statusCode: 200,
        body: {
          id: eventId,
          name: 'Evento Existente',
          description: 'Descripción existente',
          datetime: '2025-07-15T00:00:00Z',
          type: 'wedding',
          color: 'blue',
          private: true,
          owner: 1,
        },
      }).as('getEvent');

      cy.visit(`${baseUrl}/eventos/edit/${eventId}`);
      cy.wait('@getEvent');
    });

    it('Carga datos existentes correctamente en el formulario', () => {
      cy.get('input[type="text"]').should('have.value', 'Evento Existente');
      cy.get('textarea').should('have.value', 'Descripción existente');
      cy.get('input[type="date"]').should('have.value', '2025-07-15');
      cy.get('select').eq(0).should('have.value', 'wedding');
      cy.get('select').eq(1).should('have.value', 'blue');
      cy.get('input[type="checkbox"]').should('be.checked');
    });

    it('Actualiza evento correctamente y redirige al detalle', () => {
      cy.intercept('PATCH', `**/events/${eventId}/`, {
        statusCode: 200,
        body: { id: eventId },
      }).as('updateEvent');

      cy.get('input[type="text"]').clear().type('Evento Actualizado');
      cy.get('button[type="submit"]').click();

      cy.wait('@updateEvent');
      cy.url().should('include', `/app/detail/${eventId}`);
    });

    it('Muestra error si falla la actualización del evento', () => {
      cy.intercept('PATCH', `**/events/${eventId}/`, {
        statusCode: 500,
        body: {},
      }).as('updateEventFail');

      cy.get('input[type="text"]').clear().type('Evento Fallido');
      cy.get('button[type="submit"]').click();

      cy.wait('@updateEventFail');
      cy.contains('Ocurrió un error al guardar el evento.').should('be.visible');
    });
  });
});
