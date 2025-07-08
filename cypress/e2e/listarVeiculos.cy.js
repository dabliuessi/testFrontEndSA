describe('E2E-003 - Exibição de veículos com login real', () => {
  let token;

  before(() => {
    cy.request('POST', 'https://apiestacionamento-1.onrender.com/auth/login', {
      email: 'usuario@teste.com',
      senha: '123456',
    }).then((res) => {
      token = res.body.token;
    });
  });

  beforeEach(() => {
    // Insere token no localStorage
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', token);
      }
    });
  });

  it('Deve exibir veículos com imagem', () => {
    cy.visit('http://localhost:5173/veiculos');

    // Aguarda os cards carregarem
    cy.get('img').should('have.length.greaterThan', 0);
  });
});
