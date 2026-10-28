# Pulse

Pulse is a frontend prototype of a European fintech super app. It combines a public product website with personal banking, business tools, investing, mobile connectivity, insurance, travel and marketplace experiences in one responsive interface.

The project is intentionally frontend-only. Product data, account balances and user actions are simulated locally so the flows can be explored without a backend or real financial operations.

## Product areas

- Public website with RU/EN localization, news, ecosystem, careers, contacts and privacy pages.
- Personal bank with multi-currency accounts, cards, operations, transfers, payments and cashback.
- Business workspace with invoices, drafts, team management and card limits.
- Investing, mobile, insurance, travel and marketplace service areas.
- Authentication, registration, recovery and confirmation demo flows.
- Responsive desktop and mobile layouts with loading, empty and error states.

## Stack

- React 19 and TypeScript
- Vite
- React Router
- Redux Toolkit and MobX
- i18next
- SCSS
- Vitest and Playwright-based route smoke tests

## Local development

Requirements: a current LTS version of Node.js and npm.

```bash
npm install
npm run dev
```

The development server is available at `http://localhost:3000` by default.

## Quality checks

```bash
npm run lint
npm run test
npm run build
npm run test:smoke
```

The smoke suite starts the production preview and checks the main public and product routes at desktop and mobile viewport sizes.

## Project notes

- No banking data is transmitted and no real payments are performed.
- Demo state is stored in the browser and may be reset by clearing site storage.
- Product requirements are recorded in `.design/PULSE_SUPER_APP_TZ.md`.
- The initial redesign audit is available in `docs/super-app-audit.md`.
- The repository history was established after the product had already been developed locally. See `CHANGELOG.md` for the import note and completed scope.
