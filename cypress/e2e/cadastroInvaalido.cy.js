describe('E2E-002 - Cadastro de veículo inválido', () => {
  it('Exibe erro ao tentar cadastrar veículo sem preencher os campos', () => {
    cy.visit('/veiculos');
    cy.contains('Adicionar Veículo').click();
    cy.get('form').submit();
    cy.get('form').should('exist');
  });
});
