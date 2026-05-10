# Ermitazas Cypress Tests

End-to-end UI tests for [ermitazas.lt](https://www.ermitazas.lt) — a Lithuanian e-commerce site selling home appliances and electronics. Tests are written in [Cypress](https://www.cypress.io/) using the Page Object Model.

## What's tested

| Area         | Scenario                                                  | Status |
| ------------ | --------------------------------------------------------- | ------ |
| Registration | Happy path — new user registers and reaches their account | ✅     |
| Registration | Password and confirm password do not match                | ✅     |
| Registration | Email is not in a valid format                            | ✅     |
| Registration | Required privacy policy checkbox not accepted             | ✅     |
| Login        | Happy path — valid credentials sign the user in           | ✅     |
| Login        | Incorrect password is rejected                            | ✅     |
| Login        | Unknown email is rejected                                 | ✅     |
| Login        | Empty fields trigger required-field errors                | ✅     |
| Cart         | Product appears in cart after adding              | ✅     |
| Cart         | Quantity increases when + button is clicked        | ✅     |
| Cart         | Product is removed when delete button is clicked   | ✅     |

## Findings

While building login coverage, I noticed that Ermitazas distinguishes between "wrong password" and "email not registered" in its error messages. This is a [user-enumeration weakness (CWE-204)](https://cwe.mitre.org/data/definitions/204.html) — an attacker can determine which emails are registered by attempting to log in. The secure pattern is to show identical errors in both cases. The login spec documents the current behavior; if the site changes to a generic error, the relevant test will fail and should be updated.

More test scenarios are in progress — see the Roadmap below.

## Project structure

```
ermitazas-cypress-tests/
├── cypress/
│   ├── e2e/
│   │   ├── cart/
│   │   │   └── cart.cy.js
│   │   ├── login/
│   │   │   └── login.cy.js
│   │   └── registration/
│   │       ├── registration-validation.cy.js
│   │       └── successful-registration.cy.js
│   ├── fixtures/
│   │   └── users.json
│   └── support/
│       ├── commands.js
│       ├── e2e.js
│       └── pages/
│           ├── CartPage.js
│           ├── LoginPage.js
│           └── RegistrationPage.js
├── cypress.config.js
├── package.json
└── .gitignore
```

### Why a Page Object Model?

Selectors and page-specific logic live in `cypress/support/pages/`, not inside the tests. If the site updates a CSS id or rearranges a form, only the Page Object needs to change — every test that uses it keeps working. Tests read closer to plain English:

```javascript
RegistrationPage.visit();
RegistrationPage.fillForm(user);
RegistrationPage.acceptPrivacyPolicy();
RegistrationPage.submit();
```

### Custom commands

Two reusable commands live in `cypress/support/commands.js`:

- `cy.dismissCookieBanner()` — closes the Cookiebot consent banner that appears on first visit
- `cy.generateTestUser()` — returns a user object with a unique timestamp-based email so registration tests can run repeatedly without colliding

## Running locally

Requires Node.js 18 or newer.

```bash
git clone https://github.com/muted-ted/ermitazas-cypress-tests.git
cd ermitazas-cypress-tests
npm install
```

Open the Cypress GUI (interactive, with browser):

```bash
npm run cy:open
```

Run all tests headless (terminal only):

```bash
npm test
```

## Roadmap

- [x] Negative registration cases (invalid email, password mismatch, missing required fields)
- [x] Login flow (success and failure)
- [x] Cart flow (add to cart, update quantity, remove item)
- [x] cy.intercept() for API-level assertions on the registration endpoint
- [x] GitHub Actions workflow to run tests on every push

## Previously fixed findings

While testing the registration API with Postman, I discovered that passwords of 100+ characters were accepted with no server-side length validation — a potential bcrypt DoS vector (CWE-400). The endpoint has since been patched and now enforces a maximum password length.

## Additional findings

**Password length boundary observation**

API testing confirmed the registration endpoint enforces a minimum of 8 and maximum of 128 characters. The 128-character upper limit sits at the top of OWASP recommendations (64-128 chars). While not a confirmed vulnerability, passwords at this length increase bcrypt computation time. A stricter limit (e.g. 72 characters — bcrypt native block size) would reduce theoretical DoS exposure.

## About

This project is part of my portfolio as I transition from logistics operations management into QA engineering. After completing CodeAcademy's 240-hour Information Systems Testing program in early 2026, I built this repo to demonstrate practical Cypress skills against a real production site.
