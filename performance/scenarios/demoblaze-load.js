import http from "k6/http";
import { check, sleep } from "k6";
import { jsonHeaders } from "../utils/headers.js";
import { byCategoryPayload, viewProductPayload } from "../utils/payloads.js";

const apiBaseUrl = "https://api.demoblaze.com";

export const options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "1m", target: 20 },
    { duration: "20s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<800", "p(99)<1200"],
  },
};

export default function () {
  const params = jsonHeaders();

  const byCategoryResponse = http.post(
    `${apiBaseUrl}/bycat`,
    byCategoryPayload("notebook"),
    params,
  );
  check(byCategoryResponse, {
    "bycat returns 200": (response) => response.status === 200,
    "bycat includes products": (response) =>
      Array.isArray(response.json("Items")),
  });

  const productId = byCategoryResponse.json("Items.0.id") || 8;
  const viewResponse = http.post(
    `${apiBaseUrl}/view`,
    viewProductPayload(productId),
    params,
  );
  check(viewResponse, {
    "view returns 200": (response) => response.status === 200,
    "view includes product title": (response) =>
      Boolean(response.json("title")),
  });

  sleep(1);
}
