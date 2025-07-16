describe('Formulario de Evento', () => {
  const baseUrl = 'http://localhost:5173';
  const eventId = 1; 
  
  Cypress.Commands.add("login", (username = "test@test.com", password = "test") => {
    cy.request({
      method: "POST",
      url: "http://localhost:8000/api/token/",
      body: { username, password },
    }).then(({ body }) => {
      window.localStorage.setItem("access_token", body.access);
      window.localStorage.setItem("refresh_token", body.refresh);
    });
  });

  context('Modo creación', () => {
    beforeEach(() => {
      cy.visit(`${baseUrl}/eventos/crear`);
    });

    it('Valida que todos los campos obligatorios sean requeridos', () => {
      cy.get('button[type="submit"]').click();

      cy.get('#name').should('have.class', 'border-red-500');
      cy.get('#datetime').should('have.class', 'border-red-500');
      cy.get('#type').should('have.class', 'border-red-500');
      cy.get('#color').should('have.class', 'border-red-500');

      cy.contains('Este campo es requerido').should('have.length.at.least', 1);
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

      cy.get('#name').type('Evento Test');
      cy.get('#description').type('Descripción');
      cy.get('#datetime').type('2025-07-20');
      cy.get('#type').select('Cumpleaños');
      cy.get('#color').select('Rojo');
      cy.get('button[type="submit"]').click();

      cy.wait('@createEvent');
      cy.url().should('include', `/eventos/${eventId}`);
    });

    it('Muestra error si falla la creación del evento', () => {
      cy.intercept('POST', '**/events/', {
        statusCode: 500,
        body: {},
      }).as('createEventFail');

      cy.get('#name').type('Evento con Error');
      cy.get('#datetime').type('2025-07-20');
      cy.get('#type').select('Cumpleaños');
      cy.get('#color').select('Rojo');
      cy.get('button[type="submit"]').click();

      cy.wait('@createEventFail');

      cy.get('.text-red-500')
        .should('be.visible')
        .and('contain', 'Ocurrió un error al guardar el evento.');
    });
  });
});
