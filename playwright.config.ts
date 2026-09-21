import { defineConfig, devices } from "@playwright/test";
import { getEnv } from "./src/utils/env.util.js";

const env = getEnv();

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ["line"],
    [
      "allure-playwright",
      {
        outputFolder: "allure-results",
        detail: true,
        suiteTitle: false,
      },
    ],
  ],
  use: {
    baseURL: env.baseUrl,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "on-first-retry",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: "api",
      testMatch: /api\/.*\.spec\.ts/,
    },
    {
      name: "chromium",
      testMatch: /e2e\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      testMatch: /e2e\/.*\.spec\.ts/,
      use: { ...devices["Desktop Firefox"] },
    },
  ],
  outputDir: "test-results",
});
