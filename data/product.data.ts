import type { ProductCategory } from "../src/pages/home.page.js";

export interface ProductData {
  name: string;
  category: ProductCategory;
  price: string;
}

export interface CategoryProductSampleData {
  testCaseId: string;
  category: ProductCategory;
  productName: string;
}

export const SonyVaioI5: ProductData = {
  name: "Sony vaio i5",
  category: "Laptops",
  price: "790",
};

export const SamsungGalaxyS6: ProductData = {
  name: "Samsung galaxy s6",
  category: "Phones",
  price: "360",
};

export const AppleMonitor24: ProductData = {
  name: "Apple monitor 24",
  category: "Monitors",
  price: "400",
};

export const CategoryProductSamples: CategoryProductSampleData[] = [
  {
    testCaseId: "TC-HOME-002",
    category: SamsungGalaxyS6.category,
    productName: SamsungGalaxyS6.name,
  },
  {
    testCaseId: "TC-HOME-001",
    category: SonyVaioI5.category,
    productName: SonyVaioI5.name,
  },
  {
    testCaseId: "TC-HOME-003",
    category: AppleMonitor24.category,
    productName: AppleMonitor24.name,
  },
];

export const RapidCategorySwitchSequence: ProductCategory[] = [
  "Phones",
  "Laptops",
  "Monitors",
];

export const ProductAddedAlert = "Product added";
