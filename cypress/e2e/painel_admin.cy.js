describe('E2E-004 - Acesso ao painel admin', () => {
  it('Login como admin e acesso ao painel', () => {
    cy.visit('/');
    cy.get('input[placeholder="E-mail / Matrícula"]').type('admin@secreto.com');
    cy.get('input[placeholder="Senha"]').type('admin123');
    cy.contains('ENTRAR').click();

    cy.url({ timeout: 10000 }).should('include', '/admin');

    cy.visit('/admin');

    cy.contains('Registros').click();
    cy.wait(2000);  

    cy.contains('Estacionamentos').click();
    cy.wait(1000); 
  });
});
