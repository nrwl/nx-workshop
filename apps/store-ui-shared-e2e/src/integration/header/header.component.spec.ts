describe('store-ui-shared: Header component', () => {
  beforeEach(() =>
    cy.visit(
      '/iframe.html?id=headercomponent--primary&args=title:BoardGameHoard'
    )
  );

  it('should show the title', () => {
    cy.get('header').contains('Board Game Hoard');
  });
});
