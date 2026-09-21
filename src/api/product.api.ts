import type { APIRequestContext, APIResponse } from "@playwright/test";
import {
  DemoblazeApi,
  type CategoryPayloadData,
  type ProductViewPayloadData,
} from "../../data/testData.data.js";
import { ApiUtil } from "./api.util.js";

export interface ProductSummaryResponse {
  id: number;
  title: string;
  price: number;
}

export interface CategoryResponse {
  Items: ProductSummaryResponse[];
}

export interface ProductDetailResponse {
  id: number;
  title: string;
  price: number;
  desc: string;
  img: string;
}

export class ProductApi {
  private readonly api: ApiUtil;

  constructor(request: APIRequestContext) {
    this.api = new ApiUtil(request, DemoblazeApi.baseUrl);
  }

  async getProductsByCategory(
    payload: CategoryPayloadData,
  ): Promise<APIResponse> {
    return this.api.post(DemoblazeApi.endpoints.byCategory, { data: payload });
  }

  async getProductDetails(
    payload: ProductViewPayloadData,
  ): Promise<APIResponse> {
    return this.api.post(DemoblazeApi.endpoints.viewProduct, { data: payload });
  }
}
