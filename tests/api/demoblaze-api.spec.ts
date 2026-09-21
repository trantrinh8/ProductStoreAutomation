import { expect, test } from "@playwright/test";
import {
  BackendProductCategories,
  DemoblazeApi,
  SonyVaioI5,
  SonyVaioI5ApiProduct,
} from "../../data/index.js";

interface ProductSummaryResponse {
  id: number;
  title: string;
  price: number;
}

interface CategoryResponse {
  Items: ProductSummaryResponse[];
}

interface ProductDetailResponse {
  id: number;
  title: string;
  price: number;
  desc: string;
  img: string;
}

test.describe("Demoblaze backend API", () => {
  test("TC-API-001 returns laptop products by category", async ({ request }) => {
    const response = await request.post(
      `${DemoblazeApi.baseUrl}${DemoblazeApi.endpoints.byCategory}`,
      {
        data: { cat: BackendProductCategories.Laptops },
      },
    );

    expect(response.ok()).toBeTruthy();

    const body = (await response.json()) as CategoryResponse;
    expect(Array.isArray(body.Items)).toBeTruthy();
    expect(body.Items.length).toBeGreaterThan(0);
    expect(body.Items.map((item) => item.title)).toContain(SonyVaioI5.name);
  });

  test("TC-API-002 returns product details by product id", async ({ request }) => {
    const response = await request.post(
      `${DemoblazeApi.baseUrl}${DemoblazeApi.endpoints.viewProduct}`,
      {
        data: SonyVaioI5ApiProduct,
      },
    );

    expect(response.ok()).toBeTruthy();

    const body = (await response.json()) as ProductDetailResponse;
    expect(body.id).toBe(SonyVaioI5ApiProduct.id);
    expect(body.title).toBe(SonyVaioI5.name);
    expect(String(body.price)).toBe(SonyVaioI5.price);
    expect(body.desc).toBeTruthy();
    expect(body.img).toBeTruthy();
  });

  test("TC-API-003 returns an empty product list for an unknown category", async ({
    request,
  }) => {
    const response = await request.post(
      `${DemoblazeApi.baseUrl}${DemoblazeApi.endpoints.byCategory}`,
      {
        data: { cat: BackendProductCategories.Unknown },
      },
    );

    expect(response.ok()).toBeTruthy();

    const body = (await response.json()) as CategoryResponse;
    expect(body.Items).toEqual([]);
  });
});