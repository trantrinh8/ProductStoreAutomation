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

  async signUp(username: string, password: string): Promise<string> {
    await this.signUpNav.click();
    await this.signUpModal.waitForOpen();
    await new InputControl(
      this.page.locator("#sign-username"),
      "Sign up username",
    ).fill(username);
    await new InputControl(
      this.page.locator("#sign-password"),
      "Sign up password",
    ).fill(password);

    const message = await this.acceptAlertFrom(async () =>
      this.signUpModal.footerButton("Sign up").click(),
    );

    if (await this.signUpModal.raw.isVisible()) {
      await this.signUpModal.footerButton("Close").click();
      await this.signUpModal.waitForClosed();
    }

    return message;
  }

  async logIn(username: string, password: string): Promise<void> {
    await this.loginNav.click();
    await this.loginModal.waitForOpen();
    await new InputControl(
      this.page.locator("#loginusername"),
      "Login username",
    ).fill(username);
    await new InputControl(
      this.page.locator("#loginpassword"),
      "Login password",
    ).fill(password);
    await this.loginModal.footerButton("Log in").click();
  }
}
