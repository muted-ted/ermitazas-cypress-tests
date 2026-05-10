# Ermitazas Cypress Tests

End-to-end UI and API tests for [ermitazas.lt](https://www.ermitazas.lt) — a Lithuanian e-commerce site. Tests written in [Cypress](https://www.cypress.io/) using the Page Object Model.

## What's tested

| Area | Scenario | Status |
| --- | --- | --- |
| Registration | Happy path — new user registers and reaches their account | ✅ |
| Registration | API call verified via cy.intercept() | ✅ |
| Registration | Password and confirm password do not match | ✅ |
| Registration | Email is not in a valid format | ✅ |
| Registration | Required privacy policy checkbox not accepted | ✅ |
| Registration | UI rejects passwords longer than 128 characters | ✅ |
| Login | Happy path — valid credentials sign the user in | ✅ |
| Login | Incorrect password is rejected | ✅ |
| Login | Unknown email is rejected | ✅ |
| Login | Empty fields trigger required-field errors | ✅ |
| Cart | Product appears in cart after adding | ✅ |
| Cart | Quantity increases when + button is clicked | ✅ |
| Cart | Product is removed when delete button is clicked | ✅ |

## Project structure

```
ermitazas-cypress-tests/
├── cypress/
│   ├── e2e/
│   │   ├── cart/cart.cy.js
│   │   ├── login/login.cy.js
│   │   └── registration/
│   │       ├── registration-validation.cy.js
│   │       └── successful-registration.cy.js
│   ├── fixtures/users.json
│   └── support/
│       ├── commands.js
│       ├── e2e.js
│       └── pages/
│           ├── CartPage.js
│           ├── LoginPage.js
│           └── RegistrationPage.js
├── .github/workflows/cypress.yml
├── cypress.config.js
├── package.json
└── .gitignore
```

### Why Page Object Model?

Selectors live in `cypress/support/pages/`, not inside tests. If the site changes a selector, only the Page Object needs updating — not every test.

### Custom commands

- `cy.dismissCookieBanner()` — closes the Cookiebot consent banner
- `cy.generateTestUser()` — returns a user with a unique timestamp-based email
- `cy.login()` — logs in via UI and caches the session with `cy.session()`
- `cy.emptyCart()` — clears cart state via the API before each cart test

## Running locally

Requires Node.js 18 or newer.

```bash
git clone https://github.com/muted-ted/ermitazas-cypress-tests.git
cd ermitazas-cypress-tests
npm install
npm run cy:open   # interactive GUI
npm test          # headless
```

## CI/CD

Tests run automatically on every push to `main` via GitHub Actions.

## Findings

**User enumeration (CWE-204)**

The login endpoint returns different error messages for wrong password vs unknown email. An attacker can use this to determine which emails are registered. The secure pattern is identical errors in both cases.

**Password length boundary observation**

The registration API enforces 8-128 character passwords. 128 chars sits at the top of OWASP recommendations. Confirmed via Postman. A stricter limit (72 chars — bcrypt block size) would reduce theoretical DoS exposure.

## Roadmap

- [x] Negative registration cases
- [x] Login flow (success and failure)
- [x] Cart flow (add, update quantity, remove)
- [x] cy.intercept() for API-level assertions
- [x] GitHub Actions CI workflow
- [x] cy.session() caching for cart tests
- [ ] cy.intercept() on cart update endpoint

## About

Built as a portfolio project during my transition from logistics operations management into QA engineering. Completed CodeAcademy's 240-hour Information Systems Testing program in early 2026.
