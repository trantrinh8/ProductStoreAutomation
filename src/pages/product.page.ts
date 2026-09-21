import { expect, type Page } from "@playwright/test";
import { ButtonControl } from "../controls/button.control.js";
import { BasePage } from "./base.page.js";

export class ProductPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get addToCartButton(): ButtonControl {
    return new ButtonControl(
      this.page.getByRole("link", { name: "Add to cart" }),
      "Add to cart",
    );
  }

  async expectProduct(
    productName: string,
    expectedPriceText?: string,
  ): Promise<void> {
    await expect(this.page.locator(".name")).toHaveText(productName);

    if (expectedPriceText) {
      await expect(this.page.locator(".price-container")).toContainText(
        expectedPriceText,
      );
    }
  }

  async addToCart(): Promise<string> {
    return this.acceptAlertFrom(
      async () => this.addToCartButton.click(),
      "Product added",
    );
  }
}
