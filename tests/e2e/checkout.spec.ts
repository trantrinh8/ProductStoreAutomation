import { expect, test } from "@playwright/test";
import {
  ProductAddedAlert,
  SonyVaioI5,
  ValidPurchaseOrder,
} from "../../data/testData.data.js";
import { CartPage } from "../../src/pages/cart.page.js";
import { HomePage } from "../../src/pages/home.page.js";
import { ProductPage } from "../../src/pages/product.page.js";

test.describe("Demoblaze checkout", () => {
  test("browse laptop, add to cart, and complete purchase", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await test.step("Step 1: Navigate to Home and filter by Laptops", async () => {
      await homePage.open();
      await homePage.filterByCategory(SonyVaioI5.category);
      await expect(homePage.productCard(SonyVaioI5.name)).toBeVisible();
    });

    await test.step("Step 2: Select Sony vaio i5", async () => {
      await homePage.selectProduct(SonyVaioI5.name);
      await productPage.expectProduct(SonyVaioI5.name, SonyVaioI5.price);
    });

    await test.step("Step 3: Add product to cart and accept native alert", async () => {
      const alertMessage = await productPage.addToCart();
      expect(alertMessage).toContain(ProductAddedAlert);
    });

    await test.step("Step 4: Navigate to Cart and verify product details", async () => {
      await cartPage.gotoCart();
      await cartPage.expectProductInCart(SonyVaioI5.name, SonyVaioI5.price);
    });

    await test.step("Step 5: Place order and verify purchase confirmation", async () => {
      await cartPage.openPlaceOrderModal();
      await cartPage.fillOrder(ValidPurchaseOrder);
      await cartPage.purchase();
      await cartPage.expectPurchaseSuccess();
    });
  });
});
