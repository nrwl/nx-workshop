describe('store-ui-shared', () => {
  beforeEach(() =>
    cy.visit(
      '/iframe.html?id=headercomponent--primary&knob-title=BoardGameHoard'
    )
  );

  it('should render the component', () => {
    cy.get('bg-hoard-header').should('exist');
  });
  it('should show the title', () => {
    cy.get('bg-hoard-header').contains('BoardGameHoard');
  });
});
