import type { APIRequestContext, APIResponse } from "@playwright/test";
import { DemoblazeApi } from "../../data/testData.data.js";
import { ApiUtil } from "./api.util.js";

export interface LoginApiPayload {
  username: string;
  password: string;
}

export class AuthApi {
  private readonly api: ApiUtil;

  constructor(request: APIRequestContext) {
    this.api = new ApiUtil(request, DemoblazeApi.baseUrl);
  }

  async login(payload: LoginApiPayload): Promise<APIResponse> {
    return this.api.post("/login", { data: payload });
  }
}
