export function byCategoryPayload(category = "notebook") {
  return JSON.stringify({ cat: category });
}

export function viewProductPayload(productId = 8) {
  return JSON.stringify({ id: productId });
}
