import { type Locator } from "@playwright/test";
import { BaseControl } from "./base.control.js";

export class ButtonControl extends BaseControl {
  constructor(locator: Locator, name: string) {
    super(locator, name);
  }

  async submit(): Promise<void> {
    await this.click();
  }
}
