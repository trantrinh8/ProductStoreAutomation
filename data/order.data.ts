import type { OrderDetails } from "../src/pages/cart.page.js";

export const ValidPurchaseOrder: OrderDetails = {
  name: "Automation Architect",
  country: "Vietnam",
  city: "Ho Chi Minh City",
  card: "4111111111111111",
  month: "09",
  year: "2026",
};

export const BlankRequiredPurchaseOrder: OrderDetails = {
  name: "",
  country: "",
  city: "",
  card: "",
  month: "",
  year: "",
};

export const NonNumericCardPurchaseOrder: OrderDetails = {
  ...ValidPurchaseOrder,
  card: "ABCDEF",
};

export const LongTextPurchaseOrder: OrderDetails = {
  ...ValidPurchaseOrder,
  name: "A".repeat(128),
  country: "A".repeat(128),
  city: "A".repeat(128),
};

export const ExpiredDatePurchaseOrder: OrderDetails = {
  ...ValidPurchaseOrder,
  month: "01",
  year: "2000",
};

export const RequiredOrderFieldsAlert = "Please fill out Name and Creditcard";
