# Test suite

This directory contains the end-to-end tests for the Swag Labs application.

- `Login/`: login scenarios SC-LOGIN-01 through SC-LOGIN-05.
- `inventory.spec.ts`: product listing, sorting, cart badge, and logout.
- `cart.spec.ts`: cart contents, removal, and navigation.
- `checkout.spec.ts`: checkout validation, totals, and order completion.
- `e2e-purchase-flow.spec.ts`: complete purchase journey.

Run the Chromium suite with:

```bash
npx playwright test --project=chromium
```
