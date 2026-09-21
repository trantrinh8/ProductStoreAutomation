import { expect, test, type Locator } from "@playwright/test";

export class BaseControl {
  constructor(
    protected readonly locator: Locator,
    protected readonly name: string,
  ) {}

  get raw(): Locator {
    return this.locator;
  }

  async click(options?: { timeout?: number }): Promise<void> {
    await test.step(`Click ${this.name}`, async () => {
      await this.waitForVisible(options?.timeout);
      await this.locator.click({ timeout: options?.timeout });
    });
  }

  async dispatchClick(): Promise<void> {
    await test.step(`Dispatch click ${this.name}`, async () => {
      await this.waitForVisible();
      await this.locator.dispatchEvent("click");
    });
  }

  async doubleClick(options?: { timeout?: number }): Promise<void> {
    await test.step(`Double click ${this.name}`, async () => {
      await this.waitForVisible(options?.timeout);
      await this.locator.dblclick({ timeout: options?.timeout });
    });
  }

  async textContent(): Promise<string> {
    return test.step(`Get text from ${this.name}`, async () => {
      await this.waitForVisible();
      return (await this.locator.textContent())?.trim() ?? "";
    });
  }

  async waitForVisible(timeout = 10_000): Promise<void> {
    await expect(this.locator, `${this.name} should be visible`).toBeVisible({
      timeout,
    });
  }

  async waitForHidden(timeout = 10_000): Promise<void> {
    await expect(this.locator, `${this.name} should be hidden`).toBeHidden({
      timeout,
    });
  }

  async shouldContainText(expectedText: string | RegExp): Promise<void> {
    await test.step(`Verify ${this.name} contains text`, async () => {
      await expect(this.locator).toContainText(expectedText);
    });
  }

  async highlight(): Promise<void> {
    await this.locator.evaluate((element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.outline = "3px solid #ff3366";
      htmlElement.style.outlineOffset = "2px";
    });
  }
}
