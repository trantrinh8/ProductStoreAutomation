import { type Page } from "@playwright/test";
import { ButtonControl } from "../controls/button.control.js";
import { InputControl } from "../controls/input.control.js";
import { ModalControl } from "../controls/modal.control.js";
import { BasePage } from "./base.page.js";

export class LoginModal extends BasePage {
  private readonly loginModal: ModalControl;
  private readonly signUpModal: ModalControl;

  constructor(page: Page) {
    super(page);
    this.loginModal = new ModalControl(page.locator("#logInModal"), "Log in");
    this.signUpModal = new ModalControl(
      page.locator("#signInModal"),
      "Sign up",
    );
  }

  private get loginNav(): ButtonControl {
    return new ButtonControl(this.page.locator("#login2"), "Log in navigation");
  }

  private get signUpNav(): ButtonControl {
    return new ButtonControl(
      this.page.locator("#signin2"),
      "Sign up navigation",
    );
  }

  async openSignUpModal(): Promise<void> {
    await this.signUpNav.click();
    await this.signUpModal.waitForOpen();
  }

  async closeSignUpModal(): Promise<void> {
    await this.signUpModal.footerButton("Close").click();
    await this.signUpModal.waitForClosed();
  }

  async openLoginModal(): Promise<void> {
    await this.loginNav.click();
    await this.loginModal.waitForOpen();
  }

  async closeLoginModal(): Promise<void> {
    await this.loginModal.footerButton("Close").click();
    await this.loginModal.waitForClosed();
  }

  private async fillSignUp(username: string, password: string): Promise<void> {
    await new InputControl(
      this.page.locator("#sign-username"),
      "Sign up username",
    ).fill(username);
    await new InputControl(
      this.page.locator("#sign-password"),
      "Sign up password",
    ).fill(password);
  }

  private async fillLogin(username: string, password: string): Promise<void> {
    await new InputControl(
      this.page.locator("#loginusername"),
      "Login username",
    ).fill(username);
    await new InputControl(
      this.page.locator("#loginpassword"),
      "Login password",
    ).fill(password);
  }

  async signUp(username: string, password: string): Promise<string> {
    await this.openSignUpModal();
    await this.fillSignUp(username, password);

    const message = await this.acceptAlertFrom(async () =>
      this.signUpModal.footerButton("Sign up").click(),
    );

    const closedAutomatically = await this.signUpModal.raw
      .waitFor({ state: "hidden", timeout: 2_000 })
      .then(() => true)
      .catch(() => false);

    if (!closedAutomatically) {
      await this.signUpModal.footerButton("Close").click();
      await this.signUpModal.waitForClosed();
    }

    return message;
  }

  async signUpExpectingAlert(
    username: string,
    password: string,
  ): Promise<string> {
    await this.openSignUpModal();
    await this.fillSignUp(username, password);

    const message = await this.acceptAlertFrom(async () =>
      this.signUpModal.footerButton("Sign up").click(),
    );

    if (await this.signUpModal.raw.isVisible()) {
      await this.closeSignUpModal();
    }

    return message;
  }

  async logIn(username: string, password: string): Promise<void> {
    await this.openLoginModal();
    await this.fillLogin(username, password);
    await this.loginModal.footerButton("Log in").click();
  }

  async logInExpectingAlert(
    username: string,
    password: string,
  ): Promise<string> {
    await this.openLoginModal();
    await this.fillLogin(username, password);

    const message = await this.acceptAlertFrom(async () =>
      this.loginModal.footerButton("Log in").click(),
    );

    if (await this.loginModal.raw.isVisible()) {
      await this.closeLoginModal();
    }

    return message;
  }
}
