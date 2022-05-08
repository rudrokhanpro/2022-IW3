import { createRequest } from "./api";

const request = createRequest({
  headers: {
    "Content-Type": "application/json",
  },
});

export function getCartProducts() {
  return request
    .get("/cart")
    .then(({ data }) => data)
    .catch(console.error);
}

export function postCartProduct({ product, quantity }) {
  return request.post("/cart", { product, quantity }).catch(console.error);
}

export function putCartProduct({ id, product, quantity }) {
  return request.put(`/cart/${id}`, { product, quantity }).catch(console.error);
}

export function deleteCartProduct({ id }) {
  return request.delete(`/cart/${id}`).catch(console.error);
}
