import page from "page";
import checkConnectivity from "network-latency";
import {
  setRessources,
  setRessource,
  getRessources,
  getRessource,
} from "./idbHelper";

import { getProducts, getProduct } from "./api/products";
import { getCartProducts } from "./api/cart";

(async (root) => {
  const skeleton = root.querySelector(".skeleton");
  const main = root.querySelector("main");

  checkConnectivity({
    timeToCount: 3,
    threshold: 2000,
    interval: 3000,
  });

  let NETWORK_STATE = true;

  document.addEventListener("connection-changed", ({ detail: state }) => {
    NETWORK_STATE = state;

    if (state) {
      document.documentElement.style.setProperty("--app-bg-color", "royalblue");
    } else {
      document.documentElement.style.setProperty("--app-bg-color", "#858994");
    }
  });

  const AppHome = main.querySelector("app-home");
  const AppProduct = main.querySelector("app-product");
  const AppCart = main.querySelector("app-cart");

  page("*", (ctx, next) => {
    AppHome.active = false;
    AppProduct.active = false;
    AppCart.active = false;

    skeleton.removeAttribute("hidden");

    next();
  });

  page("/", async (ctx) => {
    await import("./views/app-home.js");

    const products = await getProducts();

    let storedProducts = [];

    if (NETWORK_STATE) {
      storedProducts = await setRessources(products);
    } else {
      storedProducts = await getRessources();
    }

    AppHome.products = storedProducts;

    AppHome.active = true;

    skeleton.setAttribute("hidden", "");
  });

  page("/product/:id", async ({ params }) => {
    await import("./views/app-product.js");

    const product = await getProduct(params.id);

    let storedProduct = {};

    if (NETWORK_STATE) {
      storedProduct = await setRessource(product);
    } else {
      storedProduct = await getRessource(params.id);
    }

    AppProduct.product = storedProduct;

    AppProduct.active = true;
    skeleton.setAttribute("hidden", "");
  });

  page("/cart", async (ctx) => {
    await import("./views/app-cart.js");

    const products = await getCartProducts();

    let storedProducts = [];

    if (NETWORK_STATE) {
      storedProducts = products;
    } else {
    }

    AppCart.products = storedProducts;
    AppCart.active = true;

    skeleton.setAttribute("hidden", "");
  });

  page();
})(document.querySelector("#app"));
