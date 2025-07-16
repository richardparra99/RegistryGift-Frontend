describe("Detalle de evento (solo info del evento)", () => {
  beforeEach(() => {
    cy.login();

    cy.intercept("GET", "**/events/99/", {
      statusCode: 200,
      body: {
        id: 99,
        name: "Fiesta de Prueba",
        datetime: "2025-12-24T20:00:00",
        type: "birthday",
        color: "red",
        owner: {
          id: 1,
          username: "test@test.com",
        },
        description: "Fiesta navideña con amigos",
      },
    }).as("eventoDetail");
  });

  it("Carga correctamente el detalle de un evento sin regalos ni comentarios", () => {
    cy.visit("/eventos/99");

    cy.wait("@eventoDetail");

    cy.contains("Fiesta de Prueba").should("exist");
    cy.contains("Cumpleaños").should("exist");
    cy.contains("Fiesta navideña con amigos").should("exist");
    cy.contains("Creado por: test@test.com").should("exist");
  });
});
