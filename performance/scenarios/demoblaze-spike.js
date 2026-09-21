import { group, sleep } from "k6";
import {
  getProductDetails,
  getProductsByCategory,
  verifyCategoryResponse,
  verifyProductDetailsResponse,
} from "../utils/demoblaze-api.js";
import { jsonHeaders } from "../utils/headers.js";

export const options = {
  stages: [
    { duration: "10s", target: 100 },
    { duration: "30s", target: 100 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.1"],
    http_req_duration: ["p(95)<1500", "p(99)<2500"],
  },
};

export default function () {
  const params = jsonHeaders();

  group("Spike core product APIs", () => {
    verifyCategoryResponse(getProductsByCategory("notebook", params));
    verifyProductDetailsResponse(getProductDetails(8, params));
  });

  sleep(1);
}
