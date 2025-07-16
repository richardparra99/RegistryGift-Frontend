describe("Editar Evento", () => {
  const eventoMock = {
    id: 1,
    name: "Evento Original",
    description: "Descripción original",
    datetime: "2025-12-24",
    type: "birthday",
    color: "red",
    private: true,
    owner: {
      id: 1,
      username: "test@test.com",
    },
  };

  beforeEach(() => {
    cy.login(); 

    cy.intercept("GET", "**/events/1/", {
      statusCode: 200,
      body: eventoMock,
    }).as("getEvento");

    cy.visit("/eventos/editar/1");
    cy.wait("@getEvento");
  });

  it("Carga los datos del evento correctamente en el formulario", () => {
    cy.get('input#name').should('have.value', eventoMock.name);
    cy.get('textarea#description').should('have.value', eventoMock.description);
    cy.get('input#datetime').should('have.value', eventoMock.datetime);
    cy.get('select#type').should('have.value', eventoMock.type);
    cy.get('select#color').should('have.value', eventoMock.color);
    cy.get('input#isPrivate').should('be.checked');
  });

  it("Muestra errores si los campos obligatorios están vacíos", () => {
    cy.get('input#name').clear();
    cy.get('input#datetime').clear();
    cy.get('select#type').select('');
    cy.get('select#color').select('');

    cy.get('form').submit();

    cy.get('p.text-red-500.text-sm.mt-1').should('have.length.at.least', 3);
    cy.get('#name').parent().should('contain', 'Este campo es requerido');
    cy.get('#datetime').parent().should('contain', 'Este campo es requerido');
    cy.get('#type').parent().should('contain', 'Este campo es requerido');
    cy.get('#color').parent().should('contain', 'Este campo es requerido');
  });

  it("Actualiza el evento exitosamente", () => {
    cy.intercept("PATCH", "**/events/1/", {
    statusCode: 200,
    body: { ...eventoMock, name: "Evento Actualizado" },
    }).as("updateEvento");

    cy.get('input#name').clear().type("Evento Actualizado");
    cy.get('textarea#description').clear().type("Descripción modificada");
    cy.get('input#datetime').clear().type("2025-12-31");
    cy.get('select#type').select("wedding");
    cy.get('select#color').select("blue");
    cy.get('input#isPrivate').uncheck();

    cy.get('form').submit();
    cy.wait("@updateEvento");

    cy.url().should("include", "/eventos/1");
  });
});


