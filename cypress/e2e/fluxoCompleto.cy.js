describe('E2E - Fluxo completo do sistema', () => {
    it('Login, cadastro de veículo, entrada e saída', () => {
        // Intercepta chamadas API usadas durante o fluxo
        cy.intercept('POST', '/auth/login').as('loginRequest');
        cy.intercept('POST', '/veiculos').as('postVeiculo');
        cy.intercept('POST', '/acessos/entrada').as('postEntrada');
        cy.intercept('PUT', /\/acessos\/saida\/\d+/).as('putSaida');

        // 1. Login
        cy.visit('/');
        cy.get('input[placeholder="E-mail / Matrícula"]').type('usuario@teste.com');
        cy.get('input[placeholder="Senha"]').type('123456');
        cy.contains('ENTRAR').click();
        cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
        cy.url({ timeout: 10000 }).should('include', '/dashboard');
        cy.visit('/veiculos');
        cy.contains('Seus Veículos').should('be.visible');
        // 2. Cadastro do veículo
        cy.visit('/veiculos');
        cy.contains('Adicionar Veículo').click();
        cy.get('input[placeholder="Modelo"]').type('Gol');
        cy.get('input[placeholder="Placa"]').type('ABC1234');
        cy.get('input[placeholder="Cor"]').type('Prata');
        cy.get('form').submit();
        cy.wait('@postVeiculo').its('response.statusCode').should('eq', 200);
        cy.contains('Veículo adicionado com sucesso!').should('be.visible');
        cy.contains('Gol').should('be.visible');

        // 3. Registrar entrada
        cy.visit('/entrada');
        cy.get('input[placeholder="Buscar veículo por modelo ou placa"]').type('Gol');
        cy.contains('Gol - ABC1234').click();
        cy.get('select').select(1); // seleciona o primeiro estacionamento disponível
        cy.get('button').contains('Registrar Entrada').click();
        cy.wait('@postEntrada');
        cy.contains('Entrada registrada!').should('be.visible');

        // 4. Registrar saída
        cy.visit('/saida');
        // Espera o botão "Registrar Saída" aparecer e clica
        cy.get('button', { timeout: 10000 }).contains(/registrar saída/i).click();
        cy.wait('@putSaida').its('response.statusCode').should('eq', 200);
        cy.contains('Saída registrada com sucesso!').should('be.visible');
    });
});
