import { expect, test } from "@playwright/test";
import { HomePage } from "../../src/pages/home.page.js";
import { LoginModal } from "../../src/pages/login.modal.js";
import { getEnv } from "../../src/utils/env.util.js";

test.describe("Demoblaze authentication", () => {
  test("sign up and log in with generated credentials", async ({ page }) => {
    const env = getEnv();
    const username = `${env.defaultUsername}_${test.info().workerIndex}`;
    const password = env.defaultPassword;
    const homePage = new HomePage(page);
    const loginModal = new LoginModal(page);

    await test.step("Open Demoblaze home page", async () => {
      await homePage.open();
    });

    await test.step("Create a new user account", async () => {
      const message = await loginModal.signUp(username, password);
      expect(message).toMatch(/Sign up successful|This user already exist/);
    });

    await test.step("Log in with the created account", async () => {
      await loginModal.logIn(username, password);
      await expect(page.locator("#nameofuser")).toContainText(username);
    });
  });
});
