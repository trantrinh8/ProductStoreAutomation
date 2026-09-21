import type { APIRequestContext, APIResponse } from "@playwright/test";
import { DemoblazeApi } from "../../data/index.js";
import { ApiUtil } from "./api.util.js";

export interface SignupApiPayload {
  username: string;
  password: string;
}

export class UserApi {
  private readonly api: ApiUtil;

  constructor(request: APIRequestContext) {
    this.api = new ApiUtil(request, DemoblazeApi.baseUrl);
  }

  async signUp(payload: SignupApiPayload): Promise<APIResponse> {
    return this.api.post("/signup", { data: payload });
  }
}
