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

  private async openModal(
    navButton: ButtonControl,
    modal: ModalControl,
  ): Promise<void> {
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      await modal.forceClose();
      await navButton.click();

      const opened = await modal
        .waitForOpen(3_000)
        .then(() => true)
        .catch(() => false);

      if (opened) {
        return;
      }
    }

    await navButton.click();
    await modal.waitForOpen();
  }

  async openSignUpModal(): Promise<void> {
    await this.openModal(this.signUpNav, this.signUpModal);
  }

  async closeSignUpModal(): Promise<void> {
    await this.signUpModal.footerButton("Close").click();
    await this.signUpModal.waitForClosed();
  }

  async openLoginModal(): Promise<void> {
    await this.openModal(this.loginNav, this.loginModal);
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
      this.signUpModal.footerButton("Sign up").dispatchClick(),
    );

    await this.signUpModal.forceClose();

    return message;
  }

  async signUpExpectingAlert(
    username: string,
    password: string,
  ): Promise<string> {
    await this.openSignUpModal();
    await this.fillSignUp(username, password);

    const message = await this.acceptAlertFrom(async () =>
      this.signUpModal.footerButton("Sign up").dispatchClick(),
    );

    await this.signUpModal.forceClose();

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
      this.loginModal.footerButton("Log in").dispatchClick(),
    );

    await this.loginModal.forceClose();

    return message;
  }
}
