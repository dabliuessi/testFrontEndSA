describe('E2E-005 - Tentar registrar entrada em estacionamento lotado', () => {
    it('Exibe erro ao tentar registrar entrada sem vaga disponível', () => {
        cy.visit('/');
        cy.get('input[placeholder="E-mail / Matrícula"]').type('usuario@teste.com');
        cy.get('input[placeholder="Senha"]').type('123456');
        cy.contains('ENTRAR').click();
        cy.intercept('POST', '/auth/login').as('loginRequest');
        cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
        cy.url({ timeout: 10000 }).should('include', '/dashboard');
        cy.visit('/veiculos');
        cy.contains('Seus Veículos').should('be.visible');
        cy.visit('/entrada');
        cy.get('input[placeholder="Buscar veículo por modelo ou placa"]').type('Gol');
        cy.contains('Gol - ABC1234').click();
        cy.get('select').select(1); // seleciona o primeiro estacionamento disponível
        cy.get('button').contains('Registrar Entrada').click();
        cy.wait('@postEntrada');
        cy.contains('Entrada registrada!').should('be.visible');
        cy.contains('Sem vagas disponíveis').should('exist');
    });
});
