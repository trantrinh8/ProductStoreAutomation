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

export function verifyCategoryContainsProduct(response, productName) {
  return check(response, {
    [`bycat includes ${productName}`]: (result) =>
      result.json("Items").some((item) => item.title === productName),
  });
}

export function verifyEmptyCategoryResponse(response) {
  return check(response, {
    "bycat unknown category returns 200": (result) => result.status === 200,
    "bycat unknown category returns empty product array": (result) =>
      Array.isArray(result.json("Items")) && result.json("Items").length === 0,
  });
}

export function verifyProductDetailsResponse(response) {
  return check(response, {
    "view returns 200": (result) => result.status === 200,
    "view includes product title": (result) => Boolean(result.json("title")),
    "view includes product price": (result) => Number(result.json("price")) > 0,
  });
}

export function verifyProductDetailsMatch(response, productName, productId) {
  return check(response, {
    [`view title is ${productName}`]: (result) =>
      result.json("title") === productName,
    [`view id is ${productId}`]: (result) => result.json("id") === productId,
  });
}

export function firstProductIdFrom(categoryResponse, fallbackProductId = 8) {
  return categoryResponse.json("Items.0.id") || fallbackProductId;
}
