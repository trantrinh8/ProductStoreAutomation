import { expect, type Page } from "@playwright/test";
import { ButtonControl } from "../controls/button.control.js";
import { BasePage } from "./base.page.js";

const SELECTOR = {
  LNK_ADD_TO_CART: "//a[normalize-space()='Add to cart']",
  LBL_PRODUCT_NAME:
    "//*[contains(concat(' ', normalize-space(@class), ' '), ' name ')]",
  LBL_PRODUCT_PRICE:
    "//*[contains(concat(' ', normalize-space(@class), ' '), ' price-container ')]",
};

export class ProductPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get addToCartButton(): ButtonControl {
    return new ButtonControl(
      this.page.locator(SELECTOR.LNK_ADD_TO_CART),
      "Add to cart",
    );
  }

  async expectProduct(
    productName: string,
    expectedPriceText?: string,
  ): Promise<void> {
    await expect(this.page.locator(SELECTOR.LBL_PRODUCT_NAME)).toHaveText(
      productName,
    );

    if (expectedPriceText) {
      await expect(this.page.locator(SELECTOR.LBL_PRODUCT_PRICE)).toContainText(
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
