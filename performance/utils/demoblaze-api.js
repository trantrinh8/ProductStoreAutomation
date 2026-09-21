import http from "k6/http";
import { check } from "k6";
import { byCategoryPayload, viewProductPayload } from "./payloads.js";

export const apiBaseUrl = "https://api.demoblaze.com";

export function getProductsByCategory(category, params) {
  return http.post(`${apiBaseUrl}/bycat`, byCategoryPayload(category), params);
}

export function getProductDetails(productId, params) {
  return http.post(`${apiBaseUrl}/view`, viewProductPayload(productId), params);
}

export function verifyCategoryResponse(response) {
  return check(response, {
    "bycat returns 200": (result) => result.status === 200,
    "bycat includes product array": (result) =>
      Array.isArray(result.json("Items")),
  });
}

export function verifyProductDetailsResponse(response) {
  return check(response, {
    "view returns 200": (result) => result.status === 200,
    "view includes product title": (result) => Boolean(result.json("title")),
    "view includes product price": (result) => Number(result.json("price")) > 0,
  });
}

export function firstProductIdFrom(categoryResponse, fallbackProductId = 8) {
  return categoryResponse.json("Items.0.id") || fallbackProductId;
}
