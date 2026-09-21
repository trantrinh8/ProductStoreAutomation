import { expect, test } from "@playwright/test";
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
    const productName = "Sony vaio i5";
    const expectedPrice = "790";

    await test.step("Step 1: Navigate to Home and filter by Laptops", async () => {
      await homePage.open();
      await homePage.filterByCategory("Laptops");
      await expect(homePage.productCard(productName)).toBeVisible();
    });

    await test.step("Step 2: Select Sony vaio i5", async () => {
      await homePage.selectProduct(productName);
      await productPage.expectProduct(productName, expectedPrice);
    });

    await test.step("Step 3: Add product to cart and accept native alert", async () => {
      const alertMessage = await productPage.addToCart();
      expect(alertMessage).toContain("Product added");
    });

    await test.step("Step 4: Navigate to Cart and verify product details", async () => {
      await cartPage.gotoCart();
      await cartPage.expectProductInCart(productName, expectedPrice);
    });

    await test.step("Step 5: Place order and verify purchase confirmation", async () => {
      await cartPage.openPlaceOrderModal();
      await cartPage.fillOrder({
        name: "Automation Architect",
        country: "Vietnam",
        city: "Ho Chi Minh City",
        card: "4111111111111111",
        month: "09",
        year: "2026",
      });
      await cartPage.purchase();
      await cartPage.expectPurchaseSuccess();
    });
  });
});
