import { expect, type Page } from "@playwright/test";
import { ButtonControl } from "../controls/button.control.js";
import { BasePage } from "./base.page.js";

export type ProductCategory = "Phones" | "Laptops" | "Monitors";

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private category(category: ProductCategory): ButtonControl {
    return new ButtonControl(
      this.page.getByRole("link", { name: category }),
      `${category} category`,
    );
  }

  productCard(productName: string) {
    return this.page
      .locator(".card")
      .filter({ has: this.page.getByRole("link", { name: productName }) });
  }

  async open(): Promise<void> {
    await this.goto("/");
    await expect(this.page.locator("#tbodyid")).toBeVisible();
  }

  async filterByCategory(category: ProductCategory): Promise<void> {
    await this.category(category).click();
    await expect
      .poll(async () => this.page.locator("#tbodyid .card").count())
      .toBeGreaterThan(0);
  }

  async selectProduct(productName: string): Promise<void> {
    const productLink = this.page.getByRole("link", { name: productName });
    await expect(productLink).toBeVisible();
    await productLink.click();
    await expect(this.page.locator(".name")).toHaveText(productName);
  }
}
