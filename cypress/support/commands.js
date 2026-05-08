// Custom commands for the Ermitazas test suite.

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

Cypress.Commands.add('login', (email, password) => {
  cy.session(
    [email, password],
    () => {
      cy.visit('/prisijungti')
      cy.get('body').then(($body) => {
        if ($body.find('#CybotCookiebotDialogBodyButtonDecline').length) {
          cy.dismissCookieBanner()
        }
      })
      cy.get('input[type="email"], input[name="email"]').first().type(email)
      cy.get('input[type="password"]').first().type(password)
      cy.contains('button', 'Prisijungti').click()
      cy.url().should('not.include', '/prisijungti')
    },
    {
      validate() {
        cy.visit('/')
        cy.get('[aria-label="Naudotojo mygtukas"]')
          .first()
          .should('have.text', 'Mano paskyra')
      },
    }
  )
})

Cypress.Commands.add('emptyCart', () => {
  cy.visit('/kurti-uzsakyma/krepselis')
  cy.getCookie('_ermiCartToken').then((cookie) => {
    if (!cookie || !cookie.value) {
      cy.log('emptyCart: no cart token, skipping')
      return
    }
    const cartToken = cookie.value
    cy.log('emptyCart: token ' + cartToken.substring(0, 8) + '...')
    cy.request({
      method: 'GET',
      url: 'https://mp.huts.lt/api/v2/cart/info',
      headers: {
        Carttoken: cartToken,
        Accept: 'application/json',
        Locale: 'lt',
        Market: 'lt',
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.log('emptyCart: cart/info status ' + response.status)
      if (response.status !== 200) return
      const items = response.body && response.body.data && response.body.data.items ? response.body.data.items : []
      cy.log('emptyCart: ' + items.length + ' items to remove')
      if (items.length === 0) return
      items.forEach((item) => {
        cy.request({
          method: 'DELETE',
          url: 'https://mp.huts.lt/api/v2/cart/removeProduct',
          headers: {
            Carttoken: cartToken,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Locale: 'lt',
            Market: 'lt',
          },
          body: { variantId: item.id },
          failOnStatusCode: false,
        }).then((r) => {
          cy.log('emptyCart: removed ' + item.id + ' status ' + r.status)
        })
      })
    })
  })
})
