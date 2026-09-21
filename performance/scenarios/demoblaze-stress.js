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
    { duration: "1m", target: 50 },
    { duration: "30s", target: 80 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<1200", "p(99)<2000"],
  },
};

export default function () {
  const params = jsonHeaders();

  group("Stress product browsing APIs", () => {
    const categoryResponse = getProductsByCategory("notebook", params);
    verifyCategoryResponse(categoryResponse);

    const productId = firstProductIdFrom(categoryResponse);
    verifyProductDetailsResponse(getProductDetails(productId, params));
  });

  sleep(1);
}
