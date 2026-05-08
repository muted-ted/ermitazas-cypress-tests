import RegistrationPage from '../../support/pages/RegistrationPage'

describe('User registration — validation errors', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.dismissCookieBanner()
    RegistrationPage.visit()
  })

  it('shows an error when the password and confirm password fields do not match', () => {
    RegistrationPage.fillForm({
      firstName: 'Testeris',
      lastName: 'Testauskas',
      email: `test${Date.now()}@gmail.com`,
      phone: '+37061111111',
      password: 'Testing123!',
      confirmPassword: 'Different456!',
    })
    RegistrationPage.acceptPrivacyPolicy()
    RegistrationPage.submit()

    // The error appears inline near the confirm-password field, not a popup,
    // and the form does not navigate away.
    RegistrationPage.errorMessages
      .should('contain.text', 'Slaptažodžiai turi sutapti')
    cy.url().should('include', '/registruotis')
  })
})
