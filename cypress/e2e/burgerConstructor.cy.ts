describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');

    cy.wait('@getIngredients').then((interception) => {
      console.log(interception.response?.body);
    });
  });

  it('добовление ингридиента в конструктор', () => {
    cy.get('[data-cy=ingredient-item][data-name="Краторная булка N-200i"]')
      .contains('button', 'Добавить')
      .click();

    cy.get(
      '[data-cy=ingredient-constructor][data-name-bun="Краторная булка N-200i"]'
    ).should('exist');
  });
});
