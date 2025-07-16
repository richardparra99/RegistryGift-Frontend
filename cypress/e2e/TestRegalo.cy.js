describe('Formulario de Regalo', () => {
  const baseUrl = 'http://localhost:5173';
  const eventoId = 1;
  const regaloId = 1; // si quieres test editar, cambia

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  context('Modo creación', () => {
    beforeEach(() => {
      cy.visit(`${baseUrl}/eventos/${eventoId}/crear-regalo`);
    });

    it('Valida campos obligatorios: nombre, descripción y cantidad', () => {
      cy.get('button[type="submit"]').click();

      cy.get('p.text-red-500')
        .should('be.visible')
        .and('contain.text', 'Los campos obligatorios deben ser completados correctamente.');
    });

    it('Crea regalo exitosamente y redirige al detalle', () => {
      cy.intercept('POST', '**/gifts/', {
        statusCode: 201,
        body: {
          id: regaloId,
          event: { id: eventoId },
          name: 'Regalo Test',
          description: 'Descripción regalo',
          quantity: 2,
          reference_link: null,
          priority: null,
        },
      }).as('createGift');

      cy.get('input[type="text"]').eq(0).type('Regalo Test');
      cy.get('textarea').type('Descripción regalo');
      cy.get('input[type="number"]').clear().type('2');
      cy.get('button[type="submit"]').click();

      cy.wait('@createGift');
      cy.url().should('include', `/eventos/${eventoId}`);
    });

    it('Muestra error si falla la creación del regalo', () => {
      cy.intercept('POST', '**/gifts/', {
        statusCode: 500,
        body: {},
      }).as('createGiftFail');

      cy.get('input[type="text"]').eq(0).type('Regalo con error');
      cy.get('textarea').type('Descripción regalo');
      cy.get('input[type="number"]').clear().type('1');
      cy.get('button[type="submit"]').click();

      cy.wait('@createGiftFail');

      cy.get('p.text-red-500')
        .should('be.visible')
        .and('contain', 'Ocurrió un error al guardar el regalo.');
    });
  });
});
