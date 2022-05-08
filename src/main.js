import page from "page";
import checkConnectivity from "network-latency";
import {
  setRessources,
  setRessource,
  getRessources,
  getRessource,
  PRODUCTS_STORE_NAME,
  CART_STORE_NAME,
} from "./idbHelper";
import { getProducts, getProduct } from "./api/products";
import { getCartProducts } from "./api/cart";
import "./views/app-home.js";
import "./views/app-product.js";
import "./views/app-cart.js";

(async (root) => {
  const skeleton = root.querySelector(".skeleton");
  const main = root.querySelector("main");

  checkConnectivity({
    timeToCount: 3,
    threshold: 2000,
    interval: 3000,
  });

  const AppHome = main.querySelector("app-home");
  const AppProduct = main.querySelector("app-product");
  const AppCart = main.querySelector("app-cart");

  const components = [AppHome, AppProduct, AppCart];
  const updateIsOnline = (status) =>
    components.forEach((c) => (c.isOnline = status));

  let NETWORK_STATE = true;

  document.addEventListener("connection-changed", ({ detail: state }) => {
    NETWORK_STATE = state;
    updateIsOnline(NETWORK_STATE);

    if (state) {
      document.documentElement.style.setProperty("--app-bg-color", "royalblue");
    } else {
      document.documentElement.style.setProperty("--app-bg-color", "#858994");
    }
  });

  page("*", (ctx, next) => {
    AppHome.active = false;
    AppProduct.active = false;
    AppCart.active = false;

    skeleton.removeAttribute("hidden");

    next();
  });

  page("/", async (ctx) => {
    let storedProducts = [];
    let storedCartProducts = [];

    if (NETWORK_STATE) {
      const products = await getProducts();
      storedProducts = await setRessources(PRODUCTS_STORE_NAME, products);

      const cartProducts = await getCartProducts();
      storedCartProducts = await setRessources(CART_STORE_NAME, cartProducts);
    } else {
      storedProducts = await getRessources(PRODUCTS_STORE_NAME);
      storedCartProducts = await getRessources(CART_STORE_NAME);
    }

    AppHome.products = storedProducts;
    AppCart.products = storedCartProducts;
    AppHome.active = true;

    skeleton.setAttribute("hidden", "");
  });

  page("/product/:id", async ({ params }) => {
    let storedProduct = {};

    if (NETWORK_STATE) {
      const product = await getProduct(params.id);
      storedProduct = await setRessource(PRODUCTS_STORE_NAME, product);
    } else {
      storedProduct = await getRessource(
        PRODUCTS_STORE_NAME,
        Number(params.id)
      );
    }

    AppProduct.product = storedProduct;
    AppProduct.active = true;

    skeleton.setAttribute("hidden", "");
  });

  page("/cart", async (ctx) => {
    let storedProducts = [];
    AppCart.isOnline = NETWORK_STATE;

    if (NETWORK_STATE) {
      const products = await getCartProducts();
      storedProducts = await setRessources(CART_STORE_NAME, products);
    } else {
      storedProducts = await getRessources(CART_STORE_NAME);
    }

    AppCart.products = storedProducts;
    AppCart.active = true;

    skeleton.setAttribute("hidden", "");
  });

  page();
})(document.querySelector("#app"));
