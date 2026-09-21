import { test, type Locator } from "@playwright/test";
import { BaseControl } from "./base.control.js";

export class InputControl extends BaseControl {
  constructor(locator: Locator, name: string) {
    super(locator, name);
  }

  async fill(value: string): Promise<void> {
    await test.step(`Fill ${this.name}`, async () => {
      await this.waitForVisible();
      await this.raw.fill(value);
    });
  }

  async clear(): Promise<void> {
    await test.step(`Clear ${this.name}`, async () => {
      await this.waitForVisible();
      await this.raw.clear();
    });
  }
}
