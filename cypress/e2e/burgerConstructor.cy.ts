describe('Тест базавой функциональности', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');

    cy.wait('@getIngredients');
  });

  it('добовление ингридиента в конструктор', () => {
    cy.get('[data-cy=ingredient-item][data-name="Краторная булка N-200i"]')
      .contains('button', 'Добавить')
      .click();

    cy.get(
      '[data-cy=ingredient-constructor-bun][data-name-bun="Краторная булка N-200i"]'
    ).should('exist');
  });

  it('Тест работы модальных окон', () => {
    cy.get('[data-cy=ingredient-item][data-name="Краторная булка N-200i"]')
      .find('a')
      .click();

    cy.get('#modals')
      .find('[data-cy=modal-window]')
      .should('be.visible')
      .and('contain', 'Краторная булка N-200i');

    cy.get('#modals').find('[data-cy=button-modal-close]').click();

    cy.get('#modals').find('[data-cy=modal-window]').should('not.exist');
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/auth/user', {
      fixture: 'userData.json'
    });

    cy.setCookie('accessToken', 'mock-access-token');
    localStorage.setItem('refreshToken', 'mock-refresh-token');

    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('POST', '/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.visit('/');

    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Сценарий создания заказа', () => {
    cy.get('[data-cy=ingredient-item][data-name="Флюоресцентная булка R2-D3"]')
      .contains('button', 'Добавить')
      .click();

    cy.get(
      '[data-cy="ingredient-item"][data-name="Филе Люминесцентного тетраодонтимформа"]'
    )
      .contains('button', 'Добавить')
      .click();

    cy.get('[data-cy="ingredient-constructor-bun"]').should(
      'contain',
      'Флюоресцентная булка R2-D3'
    );

    cy.contains('button', 'Оформить заказ').click();

    cy.wait('@createOrder');

    cy.get('#modals')
      .find('[data-cy=modal-window]')
      .should('be.visible')
      .and('contain', '96634');

    cy.get('[data-cy=button-modal-close]').click();

    cy.get('[data-cy=modal-window]').should('not.exist');

    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});
