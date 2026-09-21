import { expect, test } from "@playwright/test";
import { HomePage } from "../../src/pages/home.page.js";
import { LoginModal } from "../../src/pages/login.modal.js";
import { getEnv } from "../../src/utils/env.util.js";

function uniqueUsername(prefix: string, workerIndex: number): string {
  return `${prefix}_${workerIndex}_${Date.now()}`;
}

test.describe("Demoblaze authentication", () => {
  test("TC-AUTH-001 TC-AUTH-002 sign up and log in with valid credentials", async ({
    page,
  }, testInfo) => {
    const env = getEnv();
    const username = uniqueUsername(
      `${env.defaultUsername}_${testInfo.project.name}`,
      testInfo.workerIndex,
    );
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

  test("TC-AUTH-003 opens and closes the Sign up modal", async ({ page }) => {
    const homePage = new HomePage(page);
    const loginModal = new LoginModal(page);

    await test.step("Open home page", async () => {
      await homePage.open();
    });

    await test.step("Open and close Sign up modal", async () => {
      await loginModal.openSignUpModal();
      await loginModal.closeSignUpModal();
    });
  });

  test("TC-AUTH-004 opens and closes the Log in modal", async ({ page }) => {
    const homePage = new HomePage(page);
    const loginModal = new LoginModal(page);

    await test.step("Open home page", async () => {
      await homePage.open();
    });

    await test.step("Open and close Log in modal", async () => {
      await loginModal.openLoginModal();
      await loginModal.closeLoginModal();
    });
  });

  test("TC-AUTH-NEG-001 rejects duplicate username sign up", async ({
    page,
  }, testInfo) => {
    const env = getEnv();
    const username = uniqueUsername(
      `duplicate_${testInfo.project.name}`,
      testInfo.workerIndex,
    );
    const homePage = new HomePage(page);
    const loginModal = new LoginModal(page);

    await homePage.open();

    await test.step("Create user first time", async () => {
      const message = await loginModal.signUp(username, env.defaultPassword);
      expect(message).toMatch(/Sign up successful|This user already exist/);
    });

    await test.step("Attempt to create same user again", async () => {
      const message = await loginModal.signUpExpectingAlert(
        username,
        env.defaultPassword,
      );
      expect(message).toContain("This user already exist");
    });
  });

  test("TC-AUTH-NEG-002 rejects login with invalid password", async ({
    page,
  }, testInfo) => {
    const env = getEnv();
    const username = uniqueUsername(
      `wrong_password_${testInfo.project.name}`,
      testInfo.workerIndex,
    );
    const homePage = new HomePage(page);
    const loginModal = new LoginModal(page);

    await homePage.open();
    await loginModal.signUp(username, env.defaultPassword);

    await test.step("Log in with wrong password", async () => {
      const message = await loginModal.logInExpectingAlert(
        username,
        "wrong-password",
      );
      expect(message).toContain("Wrong password");
      await expect(page.locator("#nameofuser")).toBeHidden();
    });
  });

  test("TC-AUTH-NEG-003 rejects login with unknown username", async ({
    page,
  }, testInfo) => {
    const homePage = new HomePage(page);
    const loginModal = new LoginModal(page);
    const username = uniqueUsername(
      `unknown_${testInfo.project.name}`,
      testInfo.workerIndex,
    );

    await homePage.open();

    await test.step("Log in with unknown username", async () => {
      const message = await loginModal.logInExpectingAlert(
        username,
        "any-password",
      );
      expect(message).toContain("User does not exist");
    });
  });

  test("TC-AUTH-NEG-004 rejects sign up with blank username", async ({
    page,
  }) => {
    const env = getEnv();
    const homePage = new HomePage(page);
    const loginModal = new LoginModal(page);

    await homePage.open();

    await test.step("Submit sign up with blank username", async () => {
      const message = await loginModal.signUpExpectingAlert(
        "",
        env.defaultPassword,
      );
      expect(message).toContain("Please fill out Username and Password");
    });
  });

  test("TC-AUTH-NEG-005 rejects sign up with blank password", async ({
    page,
  }, testInfo) => {
    const homePage = new HomePage(page);
    const loginModal = new LoginModal(page);
    const username = uniqueUsername(
      `blank_password_${testInfo.project.name}`,
      testInfo.workerIndex,
    );

    await homePage.open();

    await test.step("Submit sign up with blank password", async () => {
      const message = await loginModal.signUpExpectingAlert(username, "");
      expect(message).toContain("Please fill out Username and Password");
    });
  });

  test("TC-AUTH-EDGE-001 handles very long username sign up deterministically", async ({
    page,
  }, testInfo) => {
    const env = getEnv();
    const homePage = new HomePage(page);
    const loginModal = new LoginModal(page);
    const username = uniqueUsername(
      `long_${testInfo.project.name}`,
      testInfo.workerIndex,
    ).padEnd(128, "x");

    await homePage.open();

    await test.step("Sign up with 128-character username", async () => {
      const message = await loginModal.signUp(username, env.defaultPassword);
      expect(message).toMatch(/Sign up successful|This user already exist/);
    });
  });

  test("TC-AUTH-EDGE-002 handles special characters in username", async ({
    page,
  }, testInfo) => {
    const env = getEnv();
    const homePage = new HomePage(page);
    const loginModal = new LoginModal(page);
    const username = uniqueUsername(
      `special_${testInfo.project.name}_!@$`,
      testInfo.workerIndex,
    );

    await homePage.open();

    await test.step("Sign up with special-character username", async () => {
      const message = await loginModal.signUp(username, env.defaultPassword);
      expect(message).toMatch(/Sign up successful|This user already exist/);
    });
  });
});
