import { expect, test, type Locator } from "@playwright/test";
import { BaseControl } from "./baseControl.helper.js";
import { ButtonControl } from "./buttonControl.helper.js";
import { InputControl } from "./inputControl.helper.js";

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

  async waitForOpen(timeout = 10_000): Promise<void> {
    await test.step(`Wait for ${this.name} modal to open`, async () => {
      await expect(this.raw).toBeVisible({ timeout });
      await expect(this.raw).toHaveClass(/show/, { timeout });
    });
  }

  async waitForClosed(timeout = 10_000): Promise<void> {
    await test.step(`Wait for ${this.name} modal to close`, async () => {
      await expect(this.raw).toBeHidden({ timeout });
    });
  }

  async forceClose(): Promise<void> {
    await test.step(`Force close ${this.name} modal`, async () => {
      await this.raw.evaluate((modal) => {
        const element = modal as HTMLElement;
        element.classList.remove("show");
        element.style.display = "none";
        element.setAttribute("aria-hidden", "true");
        element.ownerDocument.body.classList.remove("modal-open");
        element.ownerDocument
          .querySelectorAll(".modal-backdrop")
          .forEach((backdrop) => backdrop.remove());
      });
    });
  }
}
