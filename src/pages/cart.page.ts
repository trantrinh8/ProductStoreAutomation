import { expect, type Page } from "@playwright/test";
import { ButtonControl } from "../controls/buttonControl.helper.js";
import { InputControl } from "../controls/inputControl.helper.js";
import { ModalControl } from "../controls/modalControl.helper.js";
import { BasePage } from "./pageBase.page.js";

const SELECTOR = {
  MODAL_ORDER: "//div[@id='orderModal']",
  BTN_PLACE_ORDER: "//button[normalize-space()='Place Order']",
  BTN_PURCHASE: "//div[@id='orderModal']//button[normalize-space()='Purchase']",
  BTN_CONFIRM_PURCHASE_OK:
    "//*[contains(concat(' ', normalize-space(@class), ' '), ' sweet-alert ')]//button[normalize-space()='OK']",
  TXT_ORDER_NAME: "//input[@id='name']",
  TXT_ORDER_COUNTRY: "//input[@id='country']",
  TXT_ORDER_CITY: "//input[@id='city']",
  TXT_ORDER_CARD: "//input[@id='card']",
  TXT_ORDER_MONTH: "//input[@id='month']",
  TXT_ORDER_YEAR: "//input[@id='year']",
  ROW_CART_PRODUCT: (productName: string) =>
    `//tbody[@id='tbodyid']//tr[td[normalize-space()='${productName}']]`,
  ROW_CART_PRODUCT_ALL: "//tbody[@id='tbodyid']//tr",
  COL_PRODUCT_NAME: "xpath=.//td[2]",
  COL_PRODUCT_PRICE: "xpath=.//td[3]",
  LNK_DELETE: "xpath=.//a[normalize-space()='Delete']",
  MSG_PURCHASE_SUCCESS:
    "//*[contains(concat(' ', normalize-space(@class), ' '), ' sweet-alert ')]",
  MSG_PURCHASE_SUCCESS_TITLE:
    "//*[contains(concat(' ', normalize-space(@class), ' '), ' sweet-alert ')]//h2",
  MSG_PURCHASE_SUCCESS_DETAILS:
    "//*[contains(concat(' ', normalize-space(@class), ' '), ' sweet-alert ')]//*[contains(concat(' ', normalize-space(@class), ' '), ' lead ')]",
};

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
      page.locator(SELECTOR.MODAL_ORDER),
      "Place order",
    );
  }

  private get placeOrderButton(): ButtonControl {
    return new ButtonControl(
      this.page.locator(SELECTOR.BTN_PLACE_ORDER),
      "Place Order",
    );
  }

  private get purchaseButton(): ButtonControl {
    return new ButtonControl(
      this.page.locator(SELECTOR.BTN_PURCHASE),
      "Purchase",
    );
  }

  private cartRow(productName: string) {
    return this.page.locator(SELECTOR.ROW_CART_PRODUCT(productName));
  }

  private get productRows() {
    return this.page.locator(SELECTOR.ROW_CART_PRODUCT_ALL);
  }

  async expectProductInCart(
    productName: string,
    expectedPrice: string,
  ): Promise<void> {
    const row = this.cartRow(productName);
    await expect(row).toBeVisible();
    await expect(row.locator(SELECTOR.COL_PRODUCT_NAME)).toHaveText(
      productName,
    );
    await expect(row.locator(SELECTOR.COL_PRODUCT_PRICE)).toHaveText(
      expectedPrice,
    );
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
    await this.cartRow(productName).locator(SELECTOR.LNK_DELETE).click();
    await expect(this.cartRow(productName)).toBeHidden();
  }

  async openPlaceOrderModal(): Promise<void> {
    await this.placeOrderButton.click();
    await this.orderModal.waitForOpen();
  }

  async fillOrder(details: OrderDetails): Promise<void> {
    await new InputControl(
      this.page.locator(SELECTOR.TXT_ORDER_NAME),
      "Name",
    ).fill(details.name);
    await new InputControl(
      this.page.locator(SELECTOR.TXT_ORDER_COUNTRY),
      "Country",
    ).fill(details.country);
    await new InputControl(
      this.page.locator(SELECTOR.TXT_ORDER_CITY),
      "City",
    ).fill(details.city);
    await new InputControl(
      this.page.locator(SELECTOR.TXT_ORDER_CARD),
      "Credit card",
    ).fill(details.card);
    await new InputControl(
      this.page.locator(SELECTOR.TXT_ORDER_MONTH),
      "Month",
    ).fill(details.month);
    await new InputControl(
      this.page.locator(SELECTOR.TXT_ORDER_YEAR),
      "Year",
    ).fill(details.year);
  }

  async purchase(): Promise<void> {
    await this.purchaseButton.click();
  }

  async purchaseExpectingAlert(expectedMessage?: string): Promise<string> {
    return this.acceptAlertFrom(
      async () => this.purchaseButton.click(),
      expectedMessage,
    );
  }

  async expectPurchaseSuccess(): Promise<void> {
    await expect(
      this.page.locator(SELECTOR.MSG_PURCHASE_SUCCESS),
    ).toBeVisible();
    await expect(
      this.page.locator(SELECTOR.MSG_PURCHASE_SUCCESS_TITLE),
    ).toHaveText("Thank you for your purchase!");
    await expect(
      this.page.locator(SELECTOR.MSG_PURCHASE_SUCCESS_DETAILS),
    ).toContainText("Amount:");
  }

  async closePurchaseConfirmation(): Promise<void> {
    await this.page.locator(SELECTOR.BTN_CONFIRM_PURCHASE_OK).click();
    await expect(this.page.locator(SELECTOR.MSG_PURCHASE_SUCCESS)).toBeHidden();
  }
}
