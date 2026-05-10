import RegistrationPage from '../../support/pages/RegistrationPage';

describe('User registration — validation errors', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.dismissCookieBanner();
    RegistrationPage.visit();
  });

  it('shows an error when the password and confirm password fields do not match', () => {
    RegistrationPage.fillForm({
      firstName: 'Testeris',
      lastName: 'Testauskas',
      email: `test${Date.now()}@gmail.com`,
      phone: '+37061111111',
      password: 'Testing123!',
      confirmPassword: 'Different456!',
    });
    RegistrationPage.acceptPrivacyPolicy();
    RegistrationPage.submit();

    // The error appears inline near the confirm-password field, not a popup,
    // and the form does not navigate away.
    RegistrationPage.errorMessages.should('contain.text', 'Slaptažodžiai turi sutapti');
    cy.url().should('include', '/registruotis');
  });
  it('shows an error when the email is not in a valid format', () => {
    RegistrationPage.fillForm({
      firstName: 'Testeris',
      lastName: 'Testauskas',
      email: 'notanemail',
      phone: '+37061111111',
      password: 'Testing123!',
    });
    RegistrationPage.acceptPrivacyPolicy();
    RegistrationPage.submit();

    RegistrationPage.errorMessages.should(
      'contain.text',
      'Netinkamas el. pašto formatas'
    );
    cy.url().should('include', '/registruotis');
  });
  it('shows an error when the privacy policy is not accepted', () => {
    RegistrationPage.fillForm({
      firstName: 'Testeris',
      lastName: 'Testauskas',
      email: `test${Date.now()}@gmail.com`,
      phone: '+37061111111',
      password: 'Testing123!',
    });
    // Note: intentionally NOT calling RegistrationPage.acceptPrivacyPolicy()
    RegistrationPage.submit();

    RegistrationPage.errorMessages.should(
      'contain.text',
      'Turite sutikti su taisyklėmis'
    );
    cy.url().should('include', '/registruotis');
  });

  // Password length boundary: both UI and API enforce 8-128 character range.
  // 128-char limit sits at the top of OWASP recommendations. See README findings.
  it('rejects passwords longer than 128 characters', () => {
    const longPassword = 'A'.repeat(129)
    RegistrationPage.fillForm({
      firstName: 'Testeris',
      lastName: 'Testauskas',
      email: `test${Date.now()}@gmail.com`,
      phone: '+37061111111',
      password: longPassword,
      confirmPassword: longPassword,
    })
    RegistrationPage.acceptPrivacyPolicy()
    RegistrationPage.submit()

    // This assertion currently fails — the site accepts the long password.
    // When patched, this test should pass.
    RegistrationPage.errorMessages.should('be.visible')
  })
})