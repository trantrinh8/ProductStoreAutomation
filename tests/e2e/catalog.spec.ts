import { expect, test } from "@playwright/test";
import { HomePage, type ProductCategory } from "../../src/pages/home.page.js";
import { ProductPage } from "../../src/pages/product.page.js";
import { CartPage } from "../../src/pages/cart.page.js";

const categorySamples: Array<{
  testCaseId: string;
  category: ProductCategory;
  productName: string;
}> = [
  {
    testCaseId: "TC-HOME-002",
    category: "Phones",
    productName: "Samsung galaxy s6",
  },
  {
    testCaseId: "TC-HOME-001",
    category: "Laptops",
    productName: "Sony vaio i5",
  },
  {
    testCaseId: "TC-HOME-003",
    category: "Monitors",
    productName: "Apple monitor 24",
  },
];

test.describe("Demoblaze catalog and navigation", () => {
  for (const { testCaseId, category, productName } of categorySamples) {
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
      await homePage.filterByCategory("Laptops");
    });

    await test.step("Open Sony vaio i5 detail page", async () => {
      await homePage.selectProduct("Sony vaio i5");
      await productPage.expectProduct("Sony vaio i5", "790");
    });
  });

  test("TC-HOME-EDGE-001 rapidly switches between product categories", async ({
    page,
  }) => {
    const homePage = new HomePage(page);

    await homePage.open();

    await test.step("Switch Phones, Laptops, then Monitors", async () => {
      await homePage.filterByCategory("Phones");
      await homePage.filterByCategory("Laptops");
      await homePage.filterByCategory("Monitors");
      await homePage.expectProductVisible("Apple monitor 24");
    });
  });

  test("TC-HOME-NEG-001 verifies product absent from unrelated category", async ({
    page,
  }) => {
    const homePage = new HomePage(page);

    await homePage.open();

    await test.step("Sony vaio i5 is not listed under Phones", async () => {
      await homePage.filterByCategory("Phones");
      await homePage.expectProductAbsent("Sony vaio i5");
    });
  });

  test("TC-NAV-001 TC-NAV-NEG-001 Cart nav uses exact link matching", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);

    await test.step("Open a PDP where both Cart and Add to cart links exist", async () => {
      await homePage.open();
      await homePage.filterByCategory("Laptops");
      await homePage.selectProduct("Sony vaio i5");
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
