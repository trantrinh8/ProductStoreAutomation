import { group, sleep } from "k6";
import {
  firstProductIdFrom,
  getProductDetails,
  getProductsByCategory,
  verifyCategoryResponse,
  verifyProductDetailsResponse,
} from "../utils/demoblaze-api.js";
import { jsonHeaders } from "../utils/headers.js";

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

  group("Browse notebook category", () => {
    const byCategoryResponse = getProductsByCategory("notebook", params);
    verifyCategoryResponse(byCategoryResponse);

    const productId = firstProductIdFrom(byCategoryResponse);
    const viewResponse = getProductDetails(productId, params);
    verifyProductDetailsResponse(viewResponse);
  });

  sleep(1);
}
