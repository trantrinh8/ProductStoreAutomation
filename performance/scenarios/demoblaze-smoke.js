import { group, sleep } from "k6";
import {
  getProductDetails,
  getProductsByCategory,
  verifyCategoryContainsProduct,
  verifyCategoryResponse,
  verifyEmptyCategoryResponse,
  verifyProductDetailsMatch,
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
    const notebookResponse = getProductsByCategory("notebook", params);
    verifyCategoryResponse(notebookResponse);
    verifyCategoryContainsProduct(notebookResponse, "Sony vaio i5");

    const phoneResponse = getProductsByCategory("phone", params);
    verifyCategoryResponse(phoneResponse);
    verifyCategoryContainsProduct(phoneResponse, "Samsung galaxy s6");

    const monitorResponse = getProductsByCategory("monitor", params);
    verifyCategoryResponse(monitorResponse);
    verifyCategoryContainsProduct(monitorResponse, "Apple monitor 24");

    const productDetailsResponse = getProductDetails(8, params);
    verifyProductDetailsResponse(productDetailsResponse);
    verifyProductDetailsMatch(productDetailsResponse, "Sony vaio i5", 8);

    verifyEmptyCategoryResponse(
      getProductsByCategory("unknown-category", params),
    );
  });

  sleep(1);
}
