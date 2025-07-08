describe('Teste de Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173'); // agora acessa http://localhost:5173/
  });

  it('E2E-Login-Sucesso - Login com credenciais válidas', () => {
    cy.intercept('POST', '/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        usuario: {
          id: 1,
          nome: 'Usuário Teste',
          email: 'usuario@email.com',
          tipo: 'usuario'
        }
      }
    }).as('loginRequisicao');

    cy.get('input[placeholder="E-mail / Matrícula"]').type('usuario@email.com');
    cy.get('input[placeholder="Senha"]').type('123456');
    cy.contains('ENTRAR').click();

    cy.wait('@loginRequisicao');
    cy.contains('Login realizado com sucesso!').should('exist');
    cy.url().should('include', '/dashboard');
  });

  it('E2E-Login-Falha - Login com credenciais inválidas', () => {
    cy.intercept('POST', '/auth/login', {
      statusCode: 401,
      body: { message: 'Credenciais inválidas' }
    }).as('loginErro');

    cy.get('input[placeholder="E-mail / Matrícula"]').type('errado@email.com');
    cy.get('input[placeholder="Senha"]').type('senhaerrada');
    cy.contains('ENTRAR').click();

    cy.wait('@loginErro');
    cy.contains('E-mail / Matrícula ou senha inválidos').should('exist');
    cy.url().should('include', '/');
  });
});
