# Ermitazas Cypress Tests

End-to-end UI tests for [ermitazas.lt](https://www.ermitazas.lt) — a Lithuanian e-commerce site selling home appliances and electronics. Tests are written in [Cypress](https://www.cypress.io/) using the Page Object Model.

## What's tested

| Area         | Scenario                                                  | Status |
| ------------ | --------------------------------------------------------- | ------ |
| Registration | Happy path — new user registers and reaches their account | ✅     |
| Registration | Password and confirm password do not match                | ✅     |
| Registration | Email is not in a valid format                            | ✅     |
| Registration | Required privacy policy checkbox not accepted             | ✅     |

More test scenarios are in progress — see the Roadmap below.

## Project structure

```
ermitazas-cypress-tests/
├── cypress/
│   ├── e2e/
│   │   └── registration/
│   │       └── successful-registration.cy.js
│   ├── fixtures/
│   │   └── users.json
│   └── support/
│       ├── commands.js
│       ├── e2e.js
│       └── pages/
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
- [ ] Login flow (success and failure)
- [ ] Cart flow (add to cart, update quantity, remove item)
- [ ] cy.intercept() for API-level assertions on the registration endpoint
- [ ] GitHub Actions workflow to run tests on every push

## About

This project is part of my portfolio as I transition from logistics operations management into QA engineering. After completing CodeAcademy's 240-hour Information Systems Testing program in early 2026, I built this repo to demonstrate practical Cypress skills against a real production site.
