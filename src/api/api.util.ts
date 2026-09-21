import type { APIRequestContext, APIResponse } from "@playwright/test";

export type ApiRequestOptions = Parameters<APIRequestContext["post"]>[1];

export class ApiUtil {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl = "",
  ) {}

  async get(
    endpoint: string,
    options?: ApiRequestOptions,
  ): Promise<APIResponse> {
    return this.request.get(this.url(endpoint), options);
  }

  async post(
    endpoint: string,
    options?: ApiRequestOptions,
  ): Promise<APIResponse> {
    return this.request.post(this.url(endpoint), options);
  }

  async put(
    endpoint: string,
    options?: ApiRequestOptions,
  ): Promise<APIResponse> {
    return this.request.put(this.url(endpoint), options);
  }

  async patch(
    endpoint: string,
    options?: ApiRequestOptions,
  ): Promise<APIResponse> {
    return this.request.patch(this.url(endpoint), options);
  }

  async delete(
    endpoint: string,
    options?: ApiRequestOptions,
  ): Promise<APIResponse> {
    return this.request.delete(this.url(endpoint), options);
  }

  private url(endpoint: string): string {
    if (/^https?:\/\//.test(endpoint)) {
      return endpoint;
    }

    return `${this.baseUrl}${endpoint}`;
  }
}
