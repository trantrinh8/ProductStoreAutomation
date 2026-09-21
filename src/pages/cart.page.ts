import { expect, type Page } from "@playwright/test";
import { ButtonControl } from "../controls/button.control.js";
import { InputControl } from "../controls/input.control.js";
import { ModalControl } from "../controls/modal.control.js";
import { BasePage } from "./base.page.js";

export interface OrderDetails {
  name: string;
  country: string;
  city: string;
  card: string;
  month: string;
  year: string;
}

export class CartPage extends BasePage {
  private readonly orderModal: ModalControl;

  constructor(page: Page) {
    super(page);
    this.orderModal = new ModalControl(
      page.locator("#orderModal"),
      "Place order",
    );
  }

  private get placeOrderButton(): ButtonControl {
    return new ButtonControl(
      this.page.getByRole("button", { name: "Place Order" }),
      "Place Order",
    );
  }

  private cartRow(productName: string) {
    return this.page.locator("#tbodyid tr").filter({ hasText: productName });
  }

  private get productRows() {
    return this.page.locator("#tbodyid tr");
  }

  private orderInput(id: string, name: string): InputControl {
    return new InputControl(this.page.locator(`#${id}`), name);
  }

  async expectProductInCart(
    productName: string,
    expectedPrice: string,
  ): Promise<void> {
    const row = this.cartRow(productName);
    await expect(row).toBeVisible();
    await expect(row.locator("td").nth(1)).toHaveText(productName);
    await expect(row.locator("td").nth(2)).toHaveText(expectedPrice);
  }

  async expectProductQuantity(
    productName: string,
    quantity: number,
  ): Promise<void> {
    await expect(this.cartRow(productName)).toHaveCount(quantity);
  }

  async expectCartEmpty(): Promise<void> {
    await expect(this.productRows).toHaveCount(0);
  }

  async deleteProduct(productName: string): Promise<void> {
    await this.cartRow(productName)
      .getByRole("link", { name: "Delete" })
      .click();
    await expect(this.cartRow(productName)).toBeHidden();
  }

  async openPlaceOrderModal(): Promise<void> {
    await this.placeOrderButton.click();
    await this.orderModal.waitForOpen();
  }

  async fillOrder(details: OrderDetails): Promise<void> {
    await this.orderInput("name", "Name").fill(details.name);
    await this.orderInput("country", "Country").fill(details.country);
    await this.orderInput("city", "City").fill(details.city);
    await this.orderInput("card", "Credit card").fill(details.card);
    await this.orderInput("month", "Month").fill(details.month);
    await this.orderInput("year", "Year").fill(details.year);
  }

  async purchase(): Promise<void> {
    await this.orderModal.footerButton("Purchase").click();
  }

  async purchaseExpectingAlert(expectedMessage?: string): Promise<string> {
    return this.acceptAlertFrom(
      async () => this.orderModal.footerButton("Purchase").click(),
      expectedMessage,
    );
  }

  async expectPurchaseSuccess(): Promise<void> {
    await expect(this.page.locator(".sweet-alert")).toBeVisible();
    await expect(this.page.locator(".sweet-alert h2")).toHaveText(
      "Thank you for your purchase!",
    );
    await expect(this.page.locator(".sweet-alert .lead")).toContainText(
      "Amount:",
    );
  }

  async closePurchaseConfirmation(): Promise<void> {
    await this.page
      .locator(".sweet-alert")
      .getByRole("button", { name: "OK" })
      .click();
    await expect(this.page.locator(".sweet-alert")).toBeHidden();
  }
}
