import { LitElement, html, css } from "lit";
import { postCartProduct } from "../api/cart";
import { Base } from "../Base";
import "../components/product-card";
import { CART_STORE_NAME, setRessource } from "../idbHelper";

export class AppHome extends Base {
  constructor() {
    super();

    this.products = [];
  }

  static get properties() {
    return {
      products: { type: Array },
    };
  }

  async _handleAdd(e) {
    const { product, quantity } = e.detail;

    if (this.isOnline) {
      const cartProduct = await postCartProduct({ product, quantity });
      setRessource(CART_STORE_NAME, cartProduct);
    } else {
      setRessource(CART_STORE_NAME, {
        // Generate random ID
        id: Number(Math.random().toString().substring(2, 4)),
        product,
        quantity,
      });
    }
  }

  render() {
    return this.products.map(
      (product) =>
        html`
          <product-card .product="${product}" @added=${this._handleAdd}>
          </product-card>
        `
    );
  }
}

customElements.define("app-home", AppHome);
