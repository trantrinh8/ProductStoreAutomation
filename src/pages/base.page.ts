import { expect, type Page } from "@playwright/test";
import { ButtonControl } from "../controls/button.control.js";
import { AlertUtil } from "../utils/alert.util.js";

const SELECTOR = {
  LNK_NAV_ITEM: (name: string) => `//a[normalize-space()='${name}']`,
  LBL_PRODUCT_GRID: "//div[@id='tbodyid']",
  LBL_PAGE_WRAPPER: "//div[@id='page-wrapper']",
};

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  protected navLink(name: string): ButtonControl {
    return new ButtonControl(
      this.page.locator(SELECTOR.LNK_NAV_ITEM(name)),
      `${name} navigation link`,
    );
  }

  async goto(path = "/"): Promise<void> {
    await this.page.goto(path, { waitUntil: "domcontentloaded" });
  }

  async gotoHome(): Promise<void> {
    await this.navLink("Home").click();
    await expect(this.page.locator(SELECTOR.LBL_PRODUCT_GRID)).toBeVisible();
  }

  async gotoCart(): Promise<void> {
    await this.navLink("Cart").click();
    await expect(this.page.locator(SELECTOR.LBL_PAGE_WRAPPER)).toContainText(
      "Products",
    );
  }

  async acceptAlertFrom(
    trigger: () => Promise<void>,
    expectedMessage?: string,
  ): Promise<string> {
    return AlertUtil.acceptNextDialog(this.page, trigger, expectedMessage);
  }
}
