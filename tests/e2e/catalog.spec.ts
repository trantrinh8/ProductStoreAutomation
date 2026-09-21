import { expect, test } from "@playwright/test";
import {
  AppleMonitor24,
  CategoryProductSamples,
  RapidCategorySwitchSequence,
  SamsungGalaxyS6,
  SonyVaioI5,
} from "../../data/testData.data.js";
import { HomePage } from "../../src/pages/home.page.js";
import { ProductPage } from "../../src/pages/product.page.js";
import { CartPage } from "../../src/pages/cart.page.js";

test.describe("Demoblaze catalog and navigation", () => {
  for (const { testCaseId, category, productName } of CategoryProductSamples) {
    test(`${testCaseId} filters products by ${category}`, async ({ page }) => {
      const homePage = new HomePage(page);

      await test.step("Open home page", async () => {
        await homePage.open();
      });

      await test.step(`Filter by ${category}`, async () => {
        await homePage.filterByCategory(category);
        await homePage.expectProductVisible(productName);
      });
    });
  }

  test("TC-HOME-004 TC-PDP-001 selects a product and verifies detail", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);

    await test.step("Open Laptops category", async () => {
      await homePage.open();
      await homePage.filterByCategory(SonyVaioI5.category);
    });

    await test.step("Open Sony vaio i5 detail page", async () => {
      await homePage.selectProduct(SonyVaioI5.name);
      await productPage.expectProduct(SonyVaioI5.name, SonyVaioI5.price);
    });
  });

  test("TC-HOME-EDGE-001 rapidly switches between product categories", async ({
    page,
  }) => {
    const homePage = new HomePage(page);

    await homePage.open();

    await test.step("Switch Phones, Laptops, then Monitors", async () => {
      for (const category of RapidCategorySwitchSequence) {
        await homePage.filterByCategory(category);
      }
      await homePage.expectProductVisible(AppleMonitor24.name);
    });
  });

  test("TC-HOME-NEG-001 verifies product absent from unrelated category", async ({
    page,
  }) => {
    const homePage = new HomePage(page);

    await homePage.open();

    await test.step("Sony vaio i5 is not listed under Phones", async () => {
      await homePage.filterByCategory(SamsungGalaxyS6.category);
      await homePage.expectProductAbsent(SonyVaioI5.name);
    });
  });

  test("TC-NAV-001 TC-NAV-NEG-001 Cart nav uses exact link matching", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);

    await test.step("Open a PDP where both Cart and Add to cart links exist", async () => {
      await homePage.open();
      await homePage.filterByCategory(SonyVaioI5.category);
      await homePage.selectProduct(SonyVaioI5.name);
      await expect(
        page.getByRole("link", { name: "Add to cart" }),
      ).toBeVisible();
    });

    await test.step("Click the navbar Cart link only", async () => {
      await cartPage.gotoCart();
      await expect(page).toHaveURL(/cart\.html/);
    });
  });
});
