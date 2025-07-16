describe("Mis Eventos", () => {
  beforeEach(() => {
    cy.login(); 

    cy.intercept("GET", "**/events/my/", {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: "Fiesta Privada",
          datetime: "2025-08-20T20:00:00",
          type: "birthday",
          color: "green",
          owner: {
            id: 1,
            username: "test@test.com",
          },
          description: "Fiesta privada con amigos",
        },
        {
          id: 2,
          name: "Cena Romántica",
          datetime: "2025-09-14T19:00:00",
          type: "anniversary",
          color: "purple",
          owner: {
            id: 1,
            username: "test@test.com",
          },
          description: "Cena para dos personas",
        },
      ],
    }).as("misEventos");
  });

  it("Carga y muestra correctamente mis eventos", () => {
    cy.visit("/eventos/mios");
    cy.wait("@misEventos");

    cy.contains("Fiesta Privada").should("exist");
    cy.contains("Cena Romántica").should("exist");
    cy.contains("Cumpleaños").should("exist");
    cy.contains("Aniversario").should("exist");

    cy.get("button")
      .filter((_, el) => el.textContent?.trim() === "Eliminar")
      .should("have.length", 2);
  });

  it("Navega al detalle del evento al hacer click", () => {
    cy.visit("/eventos/mios");
    cy.wait("@misEventos");

    cy.contains("Fiesta Privada").click();
    cy.url().should("include", "/eventos/1");
  });

  it("Elimina un evento correctamente", () => {
    cy.visit("/eventos/mios");
    cy.wait("@misEventos");

    cy.window().then((win) => cy.stub(win, "confirm").returns(true));

    cy.intercept("DELETE", "**/events/1", {
      statusCode: 204,
    }).as("deleteEvento");

    cy.contains("li", "Fiesta Privada").within(() => {
      cy.contains("Eliminar").click();
    });

    cy.wait("@deleteEvento");

    cy.contains("Fiesta Privada").should("not.exist");
    cy.contains("Cena Romántica").should("exist");
  });

  it("No elimina si se cancela el confirm", () => {
    cy.visit("/eventos/mios");
    cy.wait("@misEventos");


    cy.window().then((win) => cy.stub(win, "confirm").returns(false));

    cy.contains("li", "Fiesta Privada").within(() => {
      cy.contains("Eliminar").click();
    });

    cy.contains("Fiesta Privada").should("exist");
    cy.contains("Cena Romántica").should("exist");
  });
});
