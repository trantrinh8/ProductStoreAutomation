# ProductStoreAutomation

Production-ready automation framework for `https://www.demoblaze.com` using TypeScript, Playwright, Allure Report, and K6.

This task is designed to evaluate your capability in handling test case documentation, architecting a scalable end-to-end automation framework, and showcasing hands-on automation proficiency.

## Framework Structure

```text
.
|-- .github/workflows/
|   |-- api.yml              # API-only CI workflow
|   |-- e2e.yml              # Browser E2E-only CI workflow
|   |-- performance.yml      # k6 performance-only CI workflow
|   `-- run-all.yml          # Combined API + E2E + performance workflow
|-- data/                    # Centralized test data objects
|-- docs/                    # Manual test case documentation
|-- performance/
|   |-- scenarios/           # k6 smoke, load, stress, spike scenarios
|   `-- utils/               # Shared k6 API helpers and payload builders
|-- scripts/                 # Report conversion helpers
|-- src/
|   |-- api/                 # Centralized API utility and domain API clients
|   |-- controls/            # Reusable Playwright control wrappers
|   |-- pages/               # Page Object Model classes
|   `-- utils/               # Shared utilities for alerts, env, Allure
`-- tests/
    |-- api/                 # Playwright API specs
    `-- e2e/                 # Playwright browser E2E specs
```

## Design Rationale

- **Page Object Model + custom controls**: page classes keep business actions readable, while control wrappers centralize click/fill/wait behavior and Allure `test.step()` logging.
- **Centralized selectors**: Page Object files keep XPath selectors in top-level `SELECTOR` objects with uppercase names, so methods contain business logic instead of selector strings.
- **Centralized test data**: data objects live under `data/`, keeping credentials, products, orders, messages, API payloads, and expected values out of specs.
- **API utility layer**: all Playwright API calls go through `ApiUtil` and domain clients such as `ProductApi`, preventing direct `request.post()` usage in specs.
- **Separate test types**: API, E2E, and performance tests have dedicated folders, npm scripts, and GitHub Actions workflows.
- **Allure reporting**: Playwright writes Allure results natively. k6 smoke performance results are converted into Allure-compatible result files so performance checks appear in reports.
- **Naming convention**: TypeScript files follow `<camelCase>.<fileType>.ts`, such as `pageBase.page.ts`, `product.api.ts`, `testData.data.ts`, and `demoblazeApi.spec.ts`.

## Test Case Documentation

Detailed functional, edge-case, negative-path, performance, test-data, and traceability coverage is documented in `docs/Demoblaze_Test_Cases.xlsx`.

## Prerequisites

- Node.js 22 or later
- npm
- k6 for performance scripts
- Java runtime for Allure CLI, if opening reports locally

## Install Dependencies

```powershell
npm install
npx playwright install chromium firefox
```

k6 is a separate runtime. Install it from `https://grafana.com/docs/k6/latest/set-up/install-k6/` or with a supported package manager for your OS.

## Execute Demo Scripts

### Run All Playwright Tests

Runs API tests once and E2E tests across Chromium and Firefox.

```powershell
npm run test
```

### Run API Tests Only

```powershell
npm run test:api
```

Equivalent direct command:

```powershell
npx playwright test tests/api --project=api
```

### Run E2E Tests Only

```powershell
npm run test:e2e
npm run test:headed
```

Equivalent direct command:

```powershell
npx playwright test tests/e2e --project=chromium --project=firefox
```

### Run k6 Performance Tests

```powershell
npm run k6:smoke
npm run k6:load
npm run k6:stress
npm run k6:spike
```

For a quick demo, start with `npm run k6:smoke`.

### Generate Allure Report For Playwright

```powershell
npm run test
npm run allure:generate
npm run allure:open
```

Or run the combined command:

```powershell
npm run test:allure
```

### Generate Allure Report With k6 Performance Result

```powershell
k6 run --summary-export performance-summary.json performance/scenarios/demoblaze-smoke.js
npm run allure:performance
npm run allure:generate
npm run allure:open
```

### Validate k6 Scenario Configuration Without Running Load

```powershell
k6 inspect performance/scenarios/demoblaze-smoke.js
k6 inspect performance/scenarios/demoblaze-load.js
k6 inspect performance/scenarios/demoblaze-stress.js
k6 inspect performance/scenarios/demoblaze-spike.js
```

## CI Workflows

```text
.github/workflows/api.yml          # npx playwright test tests/api --project=api
.github/workflows/e2e.yml          # npx playwright test tests/e2e --project=chromium --project=firefox
.github/workflows/performance.yml  # k6 smoke + inspect load/stress/spike + Allure deployment
.github/workflows/run-all.yml      # API + E2E + k6 smoke in one combined workflow
```

All workflows can be started manually with `workflow_dispatch` from GitHub Actions.

## Environment Variables

Optional `.env` values:

```ini
BASE_URL=https://www.demoblaze.com
DEMOBLAZE_USERNAME=your_existing_user
DEMOBLAZE_PASSWORD=your_password
```
