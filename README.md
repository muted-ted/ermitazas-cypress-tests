# Ermitazas Cypress Tests

End-to-end UI and API test suite for [ermitazas.lt](https://ermitazas.lt) built with Cypress and JavaScript.

This was my final exam project for the CodeAcademy QA program, completed with a score of 10/10.

## Test Coverage

- **Registration** - Successful registration and validation edge cases
- **Login** - Valid login and error handling
- **Cart** - Add to cart and checkout flow

## Security Findings

During API and UI testing, two security vulnerabilities were identified:

### 1. No Password Length Validation (CWE-400)

The registration endpoint accepts passwords of unlimited length with no server-side validation. Submitting passwords exceeding 100 characters is accepted without error - a potential bcrypt DoS vector. OWASP recommends enforcing a maximum of 64-128 characters; a stricter limit of 72 characters (bcrypt native block size) would eliminate this exposure entirely.

### 2. User Enumeration via Login Error Messages (CWE-204)

The login endpoint returns distinct error messages depending on whether the email address exists or the password is incorrect. This allows an attacker to enumerate valid email addresses, narrowing the attack surface for credential stuffing or targeted attacks.

## Tech Stack

- [Cypress](https://www.cypress.io/)
- JavaScript
- Page Object Model pattern

## How to Run

Install dependencies:



Open Cypress test runner:



Run all tests headlessly:


