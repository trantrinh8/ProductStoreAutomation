import { expect, test, type Locator } from "@playwright/test";
import { BaseControl } from "./base.control.js";
import { ButtonControl } from "./button.control.js";
import { InputControl } from "./input.control.js";

export class ModalControl extends BaseControl {
  constructor(locator: Locator, name: string) {
    super(locator, name);
  }

  input(selector: string, name: string): InputControl {
    return new InputControl(this.raw.locator(selector), `${this.name} ${name}`);
  }

  buttonByRole(name: string | RegExp): ButtonControl {
    return new ButtonControl(
      this.raw.getByRole("button", { name }),
      `${this.name} button ${String(name)}`,
    );
  }

  footerButton(name: string | RegExp): ButtonControl {
    return new ButtonControl(
      this.raw.locator(".modal-footer").getByRole("button", { name }),
      `${this.name} footer button ${String(name)}`,
    );
  }

  async waitForOpen(): Promise<void> {
    await test.step(`Wait for ${this.name} modal to open`, async () => {
      await expect(this.raw).toBeVisible();
      await expect(this.raw).toHaveClass(/show/);
    });
  }

  async waitForClosed(): Promise<void> {
    await test.step(`Wait for ${this.name} modal to close`, async () => {
      await expect(this.raw).toBeHidden();
    });
  }
}
