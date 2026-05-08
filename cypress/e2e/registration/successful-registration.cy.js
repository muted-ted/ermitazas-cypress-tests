import RegistrationPage from '../../support/pages/RegistrationPage'

describe('User registration — happy path', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.dismissCookieBanner()
  })

  it('registers a new user and lands them in their account area', () => {
    cy.generateTestUser().then((user) => {
      RegistrationPage.visit()
      cy.url().should('include', '/registruotis')

      RegistrationPage.fillForm(user)
      RegistrationPage.acceptPrivacyPolicy()
      RegistrationPage.submit()

      cy.get('[aria-label="Naudotojo mygtukas"]')
        .first()
        .should('have.text', 'Mano paskyra')
    })
  })
})
