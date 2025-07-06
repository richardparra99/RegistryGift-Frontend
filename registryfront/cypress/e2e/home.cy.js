describe('Página de inicio', () => {
  it('Carga correctamente el sitio', () => {
    cy.visit('/')
    cy.contains('TOP 10 HERRAMIENTAS').should('exist')
  })
})
2