// Page Object for the login page on ermitazas.lt (/prisijungti)
//
// Mirrors the structure of RegistrationPage.js — getters for elements,
// methods for actions. Keeps tests readable and selectors in one place.

class LoginPage {
  // --- Selectors ---
  get emailInput()    { return cy.get('input[type="email"], input[name="email"]').first() }
  get passwordInput() { return cy.get('input[type="password"]').first() }
  get submitButton()  { return cy.contains('button', 'Prisijungti') }

  // The page shows two layers of error feedback:
  //   1. A general banner ("Prisijungimas nepavyko") at the top of the form
  //   2. Inline field-specific errors with role="alert" (e.g. "Neteisingas slaptažodis")
  // Tests target whichever is appropriate for the scenario being verified.
  get errorBanner()   { return cy.contains('Prisijungimas nepavyko') }
  get fieldErrors()   { return cy.get('[role="alert"]') }

  // --- Actions ---

  visit() {
    cy.visit('/prisijungti')
  }

  fillForm({ email, password } = {}) {
    if (email)    this.emailInput.type(email)
    if (password) this.passwordInput.type(password)
  }

  submit() {
    this.submitButton.click()
  }

  /**
   * Convenience method: fills and submits in one call.
   * Used by tests that aren't focused on the form-fill mechanics.
   */
  loginAs({ email, password }) {
    this.fillForm({ email, password })
    this.submit()
  }
}

export default new LoginPage()
