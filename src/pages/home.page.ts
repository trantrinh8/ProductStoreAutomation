import { expect, type Page } from "@playwright/test";
import { ButtonControl } from "../controls/button.control.js";
import { BasePage } from "./base.page.js";

export type ProductCategory = "Phones" | "Laptops" | "Monitors";

const SELECTOR = {
  LNK_CATEGORY: (category: ProductCategory) =>
    `//a[normalize-space()='${category}']`,
  LNK_PRODUCT: (productName: string) =>
    `//a[normalize-space()='${productName}']`,
  CARD_PRODUCT: (productName: string) =>
    `//div[contains(concat(' ', normalize-space(@class), ' '), ' card ')][.//a[normalize-space()='${productName}']]`,
  LBL_PRODUCT_GRID: "//div[@id='tbodyid']",
  LBL_PRODUCT_CARD:
    "//div[@id='tbodyid']//div[contains(concat(' ', normalize-space(@class), ' '), ' card ')]",
  LBL_PRODUCT_NAME:
    "//*[contains(concat(' ', normalize-space(@class), ' '), ' name ')]",
};

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private category(category: ProductCategory): ButtonControl {
    return new ButtonControl(
      this.page.locator(SELECTOR.LNK_CATEGORY(category)),
      `${category} category`,
    );
  }

  productCard(productName: string) {
    return this.page.locator(SELECTOR.CARD_PRODUCT(productName));
  }

  productLink(productName: string) {
    return this.page.locator(SELECTOR.LNK_PRODUCT(productName));
  }

  async open(): Promise<void> {
    await this.goto("/");
    await expect(this.page.locator(SELECTOR.LBL_PRODUCT_GRID)).toBeVisible();
  }

  async filterByCategory(category: ProductCategory): Promise<void> {
    await this.category(category).click();
    await expect
      .poll(async () => this.page.locator(SELECTOR.LBL_PRODUCT_CARD).count())
      .toBeGreaterThan(0);
  }

  async selectProduct(productName: string): Promise<void> {
    const productLink = this.productLink(productName);
    await expect(productLink).toBeVisible();
    await productLink.click();
    await expect(this.page.locator(SELECTOR.LBL_PRODUCT_NAME)).toHaveText(
      productName,
    );
  }

  async expectProductVisible(productName: string): Promise<void> {
    await expect(this.productCard(productName)).toBeVisible();
  }

  async expectProductAbsent(productName: string): Promise<void> {
    await expect(this.productCard(productName)).toHaveCount(0);
  }
}
