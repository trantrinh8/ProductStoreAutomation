# Demoblaze Automation Framework

Production-ready automation framework for `https://www.demoblaze.com` using TypeScript, Playwright, Allure Report, and K6.

## Install

```powershell
npm install
npx playwright install chromium firefox
```

K6 is a separate runtime. Install it from `https://grafana.com/docs/k6/latest/set-up/install-k6/` or with a supported package manager for your OS.

## Run E2E Tests

```powershell
npm run test
npm run test:headed
```

## Generate Allure Report

```powershell
npm run test
npm run allure:generate
npm run allure:open
```

Or run the combined command:

```powershell
npm run test:allure
```

## Run K6 Load Test

```powershell
npm run k6:load
```

## Environment Variables

Optional `.env` values:

```ini
BASE_URL=https://www.demoblaze.com
DEMOBLAZE_USERNAME=your_existing_user
DEMOBLAZE_PASSWORD=your_password
```
