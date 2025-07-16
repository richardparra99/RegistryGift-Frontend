describe("Acceso autenticado a lista de eventos", () => {
  beforeEach(() => {
    cy.visit("/"); 
    cy.login();

    cy.intercept("GET", "**/events/", {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: "Evento 1",
          datetime: "2025-08-01T10:00:00",
          type: "birthday",
          color: "red",
        },
        {
          id: 2,
          name: "Evento 2",
          datetime: "2025-08-15T14:30:00",
          type: "wedding",
          color: "blue",
        },
      ],
    }).as("eventList");
  });

  it("Debería mostrar eventos después de login simulado", () => {
    cy.visit("/eventos");

    cy.wait("@eventList");

    cy.contains("Evento 1").should("exist");
    cy.contains("Evento 2").should("exist");

    cy.get("li").should("have.length", 2);
  });
});
