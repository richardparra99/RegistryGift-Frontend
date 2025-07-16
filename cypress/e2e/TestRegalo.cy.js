describe('RegaloForm', () => {
  const baseUrl = 'http://localhost:5173';
  const eventoId = 123;
  const giftId = 1;

  context('Modo creación', () => {
    beforeEach(() => {
      cy.visit(`${baseUrl}/regalos/create/${eventoId}`);
    });

    it('Muestra error si campos obligatorios están vacíos', () => {
      cy.get('button[type="submit"]').click();
      cy.contains('Los campos obligatorios deben ser completados correctamente.').should('be.visible');
    });

    it('Crea regalo exitosamente y redirige al detalle del evento', () => {
      cy.intercept('POST', '**/gifts/', {
        statusCode: 201,
        body: {
          id: giftId,
          event: { id: eventoId },
          name: 'Regalo Test',
          description: 'Descripción del regalo',
          quantity: 2,
        },
      }).as('createGift');

      cy.get('input[type="text"]').type('Regalo Test');
      cy.get('textarea').type('Descripción del regalo');
      cy.get('input[type="number"]').clear().type('2');
      cy.get('button[type="submit"]').click();

      cy.wait('@createGift');
      cy.url().should('include', `/app/detail/${eventoId}`);
    });

    it('Muestra error si falla la creación', () => {
      cy.intercept('POST', '**/gifts/', {
        statusCode: 500,
        body: {},
      }).as('createGiftFail');

      cy.get('input[type="text"]').type('Regalo Test');
      cy.get('textarea').type('Descripción del regalo');
      cy.get('input[type="number"]').clear().type('2');
      cy.get('button[type="submit"]').click();

      cy.wait('@createGiftFail');
      cy.contains('Ocurrió un error al guardar el regalo.').should('be.visible');
    });
  });

  context('Modo edición', () => {
    beforeEach(() => {
      // Interceptamos la carga inicial del regalo para editar
      cy.intercept('GET', `**/gifts/${giftId}/`, {
        statusCode: 200,
        body: {
          id: giftId,
          name: 'Regalo Existente',
          description: 'Descripción existente',
          quantity: 3,
          reference_link: 'https://referencia.com',
          priority: 'medium',
          event: { id: eventoId },
        },
      }).as('getGift');

      cy.visit(`${baseUrl}/regalos/edit/${eventoId}/${giftId}`);
      cy.wait('@getGift');
    });

    it('Carga datos correctamente en el formulario', () => {
      cy.get('input[type="text"]').should('have.value', 'Regalo Existente');
      cy.get('textarea').should('have.value', 'Descripción existente');
      cy.get('input[type="number"]').should('have.value', '3');
      cy.get('input[type="url"]').should('have.value', 'https://referencia.com');
      cy.get('select').should('have.value', 'medium');
    });

    it('Actualiza regalo y redirige al detalle del evento', () => {
      cy.intercept('PATCH', `**/gifts/${giftId}/`, {
        statusCode: 200,
        body: {
          id: giftId,
          event: { id: eventoId },
        },
      }).as('updateGift');

      cy.get('input[type="text"]').clear().type('Regalo Editado');
      cy.get('button[type="submit"]').click();

      cy.wait('@updateGift');
      cy.url().should('include', `/app/detail/${eventoId}`);
    });

    it('Muestra error si falla la actualización', () => {
      cy.intercept('PATCH', `**/gifts/${giftId}/`, {
        statusCode: 500,
        body: {},
      }).as('updateGiftFail');

      cy.get('input[type="text"]').clear().type('Regalo Editado');
      cy.get('button[type="submit"]').click();

      cy.wait('@updateGiftFail');
      cy.contains('Ocurrió un error al guardar el regalo.').should('be.visible');
    });
  });
});
