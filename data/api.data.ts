export interface ApiEndpointData {
  baseUrl: string;
  endpoints: {
    byCategory: string;
    viewProduct: string;
  };
}

export interface CategoryPayloadData {
  cat: string;
}

export interface ProductViewPayloadData {
  id: number;
}

export const DemoblazeApi: ApiEndpointData = {
  baseUrl: "https://api.demoblaze.com",
  endpoints: {
    byCategory: "/bycat",
    viewProduct: "/view",
  },
};

export const BackendProductCategories = {
  Phones: "phone",
  Laptops: "notebook",
  Monitors: "monitor",
  Unknown: "unknown-category",
} as const;

export const SonyVaioI5ApiProduct: ProductViewPayloadData = {
  id: 8,
};
