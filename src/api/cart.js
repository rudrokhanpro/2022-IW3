import { createRequest } from "./api";

const request = createRequest();

export function getCartProducts() {
  return request
    .get("/cart")
    .then(({ data }) => data)
    .catch(console.error);
}

export async function putCart(data) {
  const cartProducts = await getCartProducts();

  await Promise.all(
    cartProducts.map((cartProduct) => {
      return deleteCartProduct({ id: cartProduct.id });
    })
  );

  return Promise.all(
    data.map((cartProduct) => {
      return putCartProduct(cartProduct);
    })
  ).catch(console.error);
}

export function postCartProduct({ product, quantity }) {
  return request
    .post("/cart", { product, quantity })
    .then(({ data }) => data)
    .catch(console.error);
}

export function putCartProduct({ id, product, quantity }) {
  return request.put(`/cart/${id}`, { product, quantity }).catch(console.error);
}

export function deleteCartProduct({ id }) {
  return request.delete(`/cart/${id}`).catch(console.error);
}
