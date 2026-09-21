import type { APIRequestContext, APIResponse } from "@playwright/test";
import { DemoblazeApi } from "../../data/testData.data.js";
import { ApiUtil } from "./api.util.js";

export interface CreateOrderApiPayload {
  name: string;
  country: string;
  city: string;
  card: string;
  month: string;
  year: string;
}

export class OrderApi {
  private readonly api: ApiUtil;

  constructor(request: APIRequestContext) {
    this.api = new ApiUtil(request, DemoblazeApi.baseUrl);
  }

  async createOrder(payload: CreateOrderApiPayload): Promise<APIResponse> {
    return this.api.post("/purchase", { data: payload });
  }
}
