import LoginPage from '../../support/pages/LoginPage'

describe('User login', () => {
  beforeEach(() => {
    // Each test starts logged out so navigating to /prisijungti actually
    // shows the login page (logged-in users get redirected away from it).
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('/')
    cy.dismissCookieBanner()
    LoginPage.visit()
  })

  it('logs in successfully with valid credentials', () => {
    cy.fixture('users').then(({ loginUser }) => {
      LoginPage.loginAs(loginUser)

      // After successful login, the user button switches from
      // "Prisijungti" (Log in) to "Mano paskyra" (My account).
      cy.get('[aria-label="Naudotojo mygtukas"]')
        .first()
        .should('have.text', 'Mano paskyra')
    })
  })

  it('shows an error when the password is incorrect', () => {
    cy.fixture('users').then(({ loginUser }) => {
      LoginPage.loginAs({
        email: loginUser.email,
        password: 'WrongPassword123!',
      })

      LoginPage.errorBanner.should('be.visible')
      LoginPage.fieldErrors.should('contain.text', 'Neteisingas slaptažodis')
      cy.url().should('include', '/prisijungti')
    })
  })

  // NOTE: Ermitazas currently distinguishes between "wrong password" and
  // "email not registered" in its error messages. This is a user-enumeration
  // vulnerability (CWE-204) — an attacker can determine which emails are
  // registered by trying to log in. The secure pattern is to show identical
  // errors in both cases. This test documents the current behavior; if the
  // site is patched to use a generic error, this test will fail and should
  // be updated to assert on the new generic message.
  it('shows a "user not found" error when the email is not registered', () => {
    LoginPage.loginAs({
      email: 'nonexistent99999@example.com',
      password: 'AnyPassword123!',
    })

    LoginPage.errorBanner.should('be.visible')
    LoginPage.fieldErrors.should('contain.text', 'El. paštas sistemoje nerastas')
    cy.url().should('include', '/prisijungti')
  })

  it('shows required-field errors when both fields are empty', () => {
    LoginPage.submit()

    // Empty-field validation is handled client-side, so the server-side
    // "Prisijungimas nepavyko" banner does NOT appear here — only the
    // inline per-field errors do.
    LoginPage.fieldErrors
      .filter(':contains("Laukas būtinas")')
      .should('have.length', 2)
    cy.url().should('include', '/prisijungti')
  })
})
