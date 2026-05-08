class RegistrationPage {
  get firstNameInput() { return cy.get('#input-register-form-firstName') }
  get lastNameInput()  { return cy.get('#input-register-form-lastName') }
  get emailInput()     { return cy.get('#input-register-form-email') }
  get phoneInput()     { return cy.get('#input-register-form-phoneNumber') }
  get passwordInput()  { return cy.get('#input-register-form-password') }
  get repeatPasswordInput() { return cy.get('#input-register-form-repeatPassword') }
  get privacyCheckbox() { return cy.get('#checkbox-register-form-privacy') }
  get submitButton()   { return cy.get('[form="register-form"]') }

  visit() {
    cy.visit('/registruotis')
  }

  fillForm({ firstName, lastName, email, phone, password, confirmPassword } = {}) {
    if (firstName) this.firstNameInput.type(firstName)
    if (lastName)  this.lastNameInput.type(lastName)
    if (email)     this.emailInput.type(email)
    if (phone)     this.phoneInput.type(phone)
    if (password)  this.passwordInput.type(password)
    if (confirmPassword !== undefined) {
      this.repeatPasswordInput.type(confirmPassword)
    } else if (password) {
      this.repeatPasswordInput.type(password)
    }
  }

  acceptPrivacyPolicy() {
    this.privacyCheckbox.check({ force: true })
  }

  submit() {
    this.submitButton.click()
  }
}

export default new RegistrationPage()
