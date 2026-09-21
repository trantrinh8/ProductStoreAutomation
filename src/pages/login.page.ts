import { type Page } from "@playwright/test";
import { ButtonControl } from "../controls/buttonControl.helper.js";
import { InputControl } from "../controls/inputControl.helper.js";
import { ModalControl } from "../controls/modalControl.helper.js";
import { BasePage } from "./pageBase.page.js";

const SELECTOR = {
  MODAL_LOGIN: "//div[@id='logInModal']",
  MODAL_SIGN_UP: "//div[@id='signInModal']",
  LNK_LOGIN: "//a[@id='login2']",
  LNK_SIGN_UP: "//a[@id='signin2']",
  TXT_SIGN_UP_USERNAME: "//input[@id='sign-username']",
  TXT_SIGN_UP_PASSWORD: "//input[@id='sign-password']",
  TXT_LOGIN_USERNAME: "//input[@id='loginusername']",
  TXT_LOGIN_PASSWORD: "//input[@id='loginpassword']",
  BTN_SIGN_UP_CLOSE:
    "//div[@id='signInModal']//div[contains(concat(' ', normalize-space(@class), ' '), ' modal-footer ')]//button[normalize-space()='Close']",
  BTN_SIGN_UP_SUBMIT:
    "//div[@id='signInModal']//div[contains(concat(' ', normalize-space(@class), ' '), ' modal-footer ')]//button[normalize-space()='Sign up']",
  BTN_LOGIN_CLOSE:
    "//div[@id='logInModal']//div[contains(concat(' ', normalize-space(@class), ' '), ' modal-footer ')]//button[normalize-space()='Close']",
  BTN_LOGIN_SUBMIT:
    "//div[@id='logInModal']//div[contains(concat(' ', normalize-space(@class), ' '), ' modal-footer ')]//button[normalize-space()='Log in']",
};

export class LoginModal extends BasePage {
  private readonly loginModal: ModalControl;
  private readonly signUpModal: ModalControl;

  constructor(page: Page) {
    super(page);
    this.loginModal = new ModalControl(
      page.locator(SELECTOR.MODAL_LOGIN),
      "Log in",
    );
    this.signUpModal = new ModalControl(
      page.locator(SELECTOR.MODAL_SIGN_UP),
      "Sign up",
    );
  }

  private get loginNav(): ButtonControl {
    return new ButtonControl(
      this.page.locator(SELECTOR.LNK_LOGIN),
      "Log in navigation",
    );
  }

  private get signUpNav(): ButtonControl {
    return new ButtonControl(
      this.page.locator(SELECTOR.LNK_SIGN_UP),
      "Sign up navigation",
    );
  }

  private get signUpCloseButton(): ButtonControl {
    return new ButtonControl(
      this.page.locator(SELECTOR.BTN_SIGN_UP_CLOSE),
      "Sign up Close",
    );
  }

  private get signUpSubmitButton(): ButtonControl {
    return new ButtonControl(
      this.page.locator(SELECTOR.BTN_SIGN_UP_SUBMIT),
      "Sign up",
    );
  }

  private get loginCloseButton(): ButtonControl {
    return new ButtonControl(
      this.page.locator(SELECTOR.BTN_LOGIN_CLOSE),
      "Log in Close",
    );
  }

  private get loginSubmitButton(): ButtonControl {
    return new ButtonControl(
      this.page.locator(SELECTOR.BTN_LOGIN_SUBMIT),
      "Log in",
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
    await this.signUpCloseButton.click();
    await this.signUpModal.waitForClosed();
  }

  async openLoginModal(): Promise<void> {
    await this.openModal(this.loginNav, this.loginModal);
  }

  async closeLoginModal(): Promise<void> {
    await this.loginCloseButton.click();
    await this.loginModal.waitForClosed();
  }

  private async fillSignUp(username: string, password: string): Promise<void> {
    await new InputControl(
      this.page.locator(SELECTOR.TXT_SIGN_UP_USERNAME),
      "Sign up username",
    ).fill(username);
    await new InputControl(
      this.page.locator(SELECTOR.TXT_SIGN_UP_PASSWORD),
      "Sign up password",
    ).fill(password);
  }

  private async fillLogin(username: string, password: string): Promise<void> {
    await new InputControl(
      this.page.locator(SELECTOR.TXT_LOGIN_USERNAME),
      "Login username",
    ).fill(username);
    await new InputControl(
      this.page.locator(SELECTOR.TXT_LOGIN_PASSWORD),
      "Login password",
    ).fill(password);
  }

  async signUp(username: string, password: string): Promise<string> {
    await this.openSignUpModal();
    await this.fillSignUp(username, password);

    const message = await this.acceptAlertFrom(async () => {
      await this.signUpSubmitButton.click();
    });

    await this.signUpModal.forceClose();

    return message;
  }

  async signUpExpectingAlert(
    username: string,
    password: string,
  ): Promise<string> {
    await this.openSignUpModal();
    await this.fillSignUp(username, password);

    const message = await this.acceptAlertFrom(async () => {
      await this.signUpSubmitButton.click();
    });

    await this.signUpModal.forceClose();

    return message;
  }

  async logIn(username: string, password: string): Promise<void> {
    await this.openLoginModal();
    await this.fillLogin(username, password);
    await this.loginSubmitButton.click();
  }

  async logInExpectingAlert(
    username: string,
    password: string,
  ): Promise<string> {
    await this.openLoginModal();
    await this.fillLogin(username, password);

    const message = await this.acceptAlertFrom(async () => {
      await this.loginSubmitButton.click();
    });

    await this.loginModal.forceClose();

    return message;
  }
}
