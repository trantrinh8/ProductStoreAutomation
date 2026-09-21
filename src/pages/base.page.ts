import { expect, type Page } from "@playwright/test";
import { ButtonControl } from "../controls/button.control.js";
import { AlertUtil } from "../utils/alert.util.js";

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  protected navLink(name: string): ButtonControl {
    return new ButtonControl(
      this.page.getByRole("link", { name }),
      `${name} navigation link`,
    );
  }

  async goto(path = "/"): Promise<void> {
    await this.page.goto(path, { waitUntil: "domcontentloaded" });
  }

  async gotoHome(): Promise<void> {
    await this.navLink("Home").click();
    await expect(this.page.locator("#tbodyid")).toBeVisible();
  }

  async gotoCart(): Promise<void> {
    await this.navLink("Cart").click();
    await expect(this.page.locator("#page-wrapper")).toContainText("Products");
  }

  async acceptAlertFrom(
    trigger: () => Promise<void>,
    expectedMessage?: string,
  ): Promise<string> {
    return AlertUtil.acceptNextDialog(this.page, trigger, expectedMessage);
  }
}
