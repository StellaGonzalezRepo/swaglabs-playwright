# Swag Labs E2E Test Automation — Playwright + TypeScript

End-to-end test automation suite for [Swag Labs](https://www.saucedemo.com/), built with **Playwright** and **TypeScript** using the **Page Object Model (POM)** pattern.

This project was built as a portfolio piece to demonstrate practical QA automation skills: test design, page object architecture, cross-browser execution, and CI integration with GitHub Actions.

## Why Swag Labs?

Swag Labs is Sauce Labs' demo e-commerce app, purpose-built for test automation practice. It ships with several seeded users that simulate real production issues (locked accounts, broken images, UI glitches), which makes it a good sandbox for writing tests that go beyond the happy path.

## Tech stack

- [Playwright](https://playwright.dev/) — cross-browser test automation (Chromium, Firefox, WebKit, mobile viewport)
- TypeScript
- Page Object Model architecture
- GitHub Actions for CI
- HTML reporter with screenshots, video, and trace on failure

## Project structure

```
swaglabs-playwright/
├── pages/                  # Page Object Model classes
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── fixtures/
│   └── users.ts            # Seeded test users & test data
├── tests/
│   ├── login.spec.ts
│   ├── inventory.spec.ts
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   └── e2e-purchase-flow.spec.ts
├── .github/workflows/
│   └── playwright.yml      # CI pipeline
└── playwright.config.ts
```

## What's covered

- **Login**: valid/invalid credentials, locked-out user, required-field validation
- **Inventory**: add/remove products, cart badge state, sorting (name & price, asc/desc)
- **Known-bug documentation**: `problem_user` scenario that asserts the app's broken product images — an example of writing a test around a *known* defect rather than only testing intended behavior
- **Cart**: item list state, removing items, continue shopping
- **Checkout**: field validation, price math (subtotal + tax = total), full order completion, cancel flow
- **End-to-end journey**: a single scenario chaining login → sort → add to cart → checkout → confirmation, using `test.step()` for clear reporting

## Getting started

```bash
git clone <your-repo-url>
cd swaglabs-playwright
npm install
npx playwright install
```

## Running the tests

```bash
npm test                # run the full suite, headless
npm run test:headed     # run with a visible browser
npm run test:ui         # open Playwright's interactive UI mode
npm run test:chromium   # run against a single browser
npm run report          # open the last HTML report
```

## Continuous Integration

Every push and pull request to `main` runs the full suite on GitHub Actions across the configured browsers, and publishes the HTML report as a build artifact.

## Possible next steps

- Add visual regression testing for the `visual_user` scenario
- Parameterize tests to run the full suite against every seeded user
- Add API-level checks alongside the UI flows
- Integrate Allure reporting

---

Built by Stella Maris Gonzalez as a hands-on Playwright/TypeScript portfolio project.
