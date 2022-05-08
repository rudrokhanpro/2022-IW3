import { LitElement, html, css } from "lit";
import { Base } from "../Base";
import { putCartProduct, deleteCartProduct } from "../api/cart";
import "../components/product-card";

export class AppCart extends Base {
  constructor() {
    super();

    this.products = [];
  }

  static get properties() {
    return {
      products: { type: Array },
    };
  }

  get _total() {
    const total = this.products.reduce((sum, cartProduct) => {
      const { product, quantity } = cartProduct;

      return sum + product.price * quantity;
    }, 0);

    return total.toFixed(2);
  }

  async _handleQuantityChange(e) {
    const { cartProduct, value } = e.detail;
    this._updateCartProduct(cartProduct.id, value);
  }

  async _handleRemove(e) {
    const { cartProduct } = e.detail;
    this._deleteCartProduct(cartProduct.id);
  }

  _updateCartProduct(id, quantity) {
    this.products = this.products.map((cartProduct) => {
      if (cartProduct.id === id) {
        return { ...cartProduct, quantity };
      }

      return cartProduct;
    });
  }

  _deleteCartProduct(id) {
    this.products = this.products.filter((cartProduct) => {
      return cartProduct.id !== id;
    });
  }

  productsTemplate() {
    const products = this.products.map(
      /**
       *
       * @param {Array} cartProduct.products List of products
       * @param {Number} cartProduct.quantity Quantity
       * @returns Product list template
       */
      (cartProduct) =>
        html`
          <product-card
            .product=${cartProduct.product}
            .cartProduct=${cartProduct}
            @quantity-changed=${this._handleQuantityChange}
            @removed=${this._handleRemove}
          />
        `
    );

    return html`<div>${products}</div> `;
  }

  totalTemplate() {
    return html`
      <div>
        <span>Total: ${this._total}</span>
      </div>
    `;
  }

  render() {
    return html`
      <h1>My Cart</Cart>

      ${this.productsTemplate()}
      ${this.totalTemplate()}
    `;
  }
}

customElements.define("app-cart", AppCart);
