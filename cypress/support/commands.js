Cypress.Commands.add('dismissCookieBanner', () => {
  cy.get('#CybotCookiebotDialogBodyButtonDecline')
    .should('be.visible')
    .click()
})

Cypress.Commands.add('generateTestUser', () => {
  return cy.fixture('users').then((users) => {
    return {
      ...users.validUser,
      email: `test${Date.now()}@gmail.com`,
    }
  })
})
