import { expect, test } from "@playwright/test";
import {
  ExpiredDatePurchaseOrder,
  LongTextPurchaseOrder,
  NonNumericCardPurchaseOrder,
  ProductAddedAlert,
  RequiredOrderFieldsAlert,
  SonyVaioI5,
  ValidPurchaseOrder,
} from "../../data/testData.data.js";
import { CartPage } from "../../src/pages/cart.page.js";
import { HomePage } from "../../src/pages/home.page.js";
import { ProductPage } from "../../src/pages/product.page.js";

async function addLaptopToCart(page: import("@playwright/test").Page) {
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);

  await homePage.open();
  await homePage.filterByCategory(SonyVaioI5.category);
  await homePage.selectProduct(SonyVaioI5.name);
  await productPage.addToCart();
}

test.describe("Demoblaze cart and order edge cases", () => {
  test("TC-PDP-002 TC-CART-001 TC-CART-002 adds product and verifies cart", async ({
    page,
  }) => {
    const cartPage = new CartPage(page);

    await test.step("Add Sony vaio i5 to cart", async () => {
      await addLaptopToCart(page);
    });

    await test.step("Verify cart row", async () => {
      await cartPage.gotoCart();
      await cartPage.expectProductInCart(SonyVaioI5.name, SonyVaioI5.price);
    });
  });

  test("TC-CART-003 deletes item from cart", async ({ page }) => {
    const cartPage = new CartPage(page);

    await addLaptopToCart(page);
    await cartPage.gotoCart();

    await test.step("Delete Sony vaio i5", async () => {
      await cartPage.deleteProduct(SonyVaioI5.name);
      await cartPage.expectProductQuantity(SonyVaioI5.name, 0);
    });
  });

  test("TC-PDP-EDGE-001 adds the same product twice", async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await test.step("Add Sony vaio i5 twice", async () => {
      await homePage.open();
      await homePage.filterByCategory(SonyVaioI5.category);
      await homePage.selectProduct(SonyVaioI5.name);
      await productPage.addToCart();
      await productPage.addToCart();
    });

    await test.step("Verify duplicate cart rows", async () => {
      await cartPage.gotoCart();
      await cartPage.expectProductQuantity(SonyVaioI5.name, 2);
    });
  });

  test("TC-PDP-NEG-001 Add to cart alert is accepted without freezing", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);

    await homePage.open();
    await homePage.filterByCategory(SonyVaioI5.category);
    await homePage.selectProduct(SonyVaioI5.name);

    await test.step("Click Add to cart and verify native alert handling", async () => {
      const message = await productPage.addToCart();
      expect(message).toContain(ProductAddedAlert);
    });
  });

  test("TC-CART-EDGE-001 opens an empty cart", async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);

    await homePage.open();

    await test.step("Open cart without adding products", async () => {
      await cartPage.gotoCart();
      await cartPage.expectCartEmpty();
    });
  });

  test("TC-CART-NEG-001 deleted item is not available for checkout", async ({
    page,
  }) => {
    const cartPage = new CartPage(page);

    await addLaptopToCart(page);
    await cartPage.gotoCart();

    await test.step("Delete item and verify empty cart", async () => {
      await cartPage.deleteProduct(SonyVaioI5.name);
      await cartPage.expectCartEmpty();
    });
  });

  test("TC-ORDER-001 TC-ORDER-002 TC-ORDER-003 completes and closes a valid purchase", async ({
    page,
  }) => {
    const cartPage = new CartPage(page);

    await addLaptopToCart(page);
    await cartPage.gotoCart();

    await test.step("Submit valid order", async () => {
      await cartPage.openPlaceOrderModal();
      await cartPage.fillOrder(ValidPurchaseOrder);
      await cartPage.purchase();
      await cartPage.expectPurchaseSuccess();
    });

    await test.step("Close purchase confirmation", async () => {
      await cartPage.closePurchaseConfirmation();
    });
  });

  test("TC-ORDER-NEG-001 rejects purchase with all fields blank", async ({
    page,
  }) => {
    const cartPage = new CartPage(page);

    await addLaptopToCart(page);
    await cartPage.gotoCart();
    await cartPage.openPlaceOrderModal();

    await test.step("Submit blank order form", async () => {
      const message = await cartPage.purchaseExpectingAlert(
        RequiredOrderFieldsAlert,
      );
      expect(message).toContain(RequiredOrderFieldsAlert);
    });
  });

  test("TC-ORDER-NEG-002 rejects purchase without name", async ({ page }) => {
    const cartPage = new CartPage(page);

    await addLaptopToCart(page);
    await cartPage.gotoCart();
    await cartPage.openPlaceOrderModal();

    await test.step("Submit order with missing name", async () => {
      await cartPage.fillOrder({ ...ValidPurchaseOrder, name: "" });
      const message = await cartPage.purchaseExpectingAlert(
        RequiredOrderFieldsAlert,
      );
      expect(message).toContain(RequiredOrderFieldsAlert);
    });
  });

  test("TC-ORDER-NEG-003 documents non-numeric card behavior", async ({
    page,
  }) => {
    const cartPage = new CartPage(page);
    test.info().annotations.push({
      type: "product-defect",
      description: "Demoblaze accepts non-numeric credit card values.",
    });

    await addLaptopToCart(page);
    await cartPage.gotoCart();
    await cartPage.openPlaceOrderModal();

    await test.step("Submit order with alphabetic card", async () => {
      await cartPage.fillOrder(NonNumericCardPurchaseOrder);
      await cartPage.purchase();
      await cartPage.expectPurchaseSuccess();
    });
  });

  test("TC-ORDER-EDGE-001 submits long text values", async ({ page }) => {
    const cartPage = new CartPage(page);

    await addLaptopToCart(page);
    await cartPage.gotoCart();
    await cartPage.openPlaceOrderModal();

    await test.step("Submit order with long name, country, and city", async () => {
      await cartPage.fillOrder(LongTextPurchaseOrder);
      await cartPage.purchase();
      await cartPage.expectPurchaseSuccess();
    });
  });

  test("TC-ORDER-EDGE-002 documents expired date behavior", async ({
    page,
  }) => {
    const cartPage = new CartPage(page);
    test.info().annotations.push({
      type: "product-defect",
      description: "Demoblaze accepts expired month and year values.",
    });

    await addLaptopToCart(page);
    await cartPage.gotoCart();
    await cartPage.openPlaceOrderModal();

    await test.step("Submit order with expired month/year", async () => {
      await cartPage.fillOrder(ExpiredDatePurchaseOrder);
      await cartPage.purchase();
      await cartPage.expectPurchaseSuccess();
    });
  });
});
