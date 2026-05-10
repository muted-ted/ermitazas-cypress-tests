import RegistrationPage from '../../support/pages/RegistrationPage'

describe('User registration — happy path', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.dismissCookieBanner()
  })

  it('registers a new user and lands them in their account area', () => {
    cy.generateTestUser().then((user) => {
      // Intercept the registration API call before submitting the form.
      // This lets us assert on both the UI outcome and the API response.
      cy.intercept('POST', '**/api/register').as('registerCall')

      RegistrationPage.visit()
      cy.url().should('include', '/registruotis')

      RegistrationPage.fillForm(user)
      RegistrationPage.acceptPrivacyPolicy()
      RegistrationPage.submit()

      // Assert the API call was made and returned a success response.
      cy.wait('@registerCall').then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
      })

      // Assert the UI reflects the logged-in state.
      cy.get('[aria-label="Naudotojo mygtukas"]')
        .first()
        .should('have.text', 'Mano paskyra')
    })
  })
})
