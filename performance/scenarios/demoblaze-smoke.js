import { group, sleep } from "k6";
import {
  getProductDetails,
  getProductsByCategory,
  verifyCategoryResponse,
  verifyProductDetailsResponse,
} from "../utils/demoblaze-api.js";
import { jsonHeaders } from "../utils/headers.js";

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<1000"],
  },
};

export default function () {
  const params = jsonHeaders();

  group("Smoke check core product APIs", () => {
    verifyCategoryResponse(getProductsByCategory("notebook", params));
    verifyProductDetailsResponse(getProductDetails(8, params));
  });

  sleep(1);
}
