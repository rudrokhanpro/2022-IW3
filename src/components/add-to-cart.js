import { LitElement, html, css } from "lit";
import {
  postCartProduct,
  putCartProduct,
  deleteCartProduct,
} from "../api/cart";

export class AddToCart extends LitElement {
  constructor() {
    super();

    this.product = {};
    this.quantity = 1;
    this.minQuantity = 1;
    this.maxQuantity = 10;
  }

  static get properties() {
    return {
      product: { type: Object },
      cartProduct: { type: Object },
      quantity: { type: Number, state: true },
      minQuantity: { type: Number },
      maxQuantity: { type: Number },
      added: { type: Boolean, state: true },
    };
  }

  get _cartProduct() {
    return {
      product: this.product,
      quantity: this.quantity,
    };
  }

  _handleClick(e) {
    e.preventDefault();
  }

  async _handleQuantityChange(e) {
    const quantity = Number(e.target.value);

    this.quantity = quantity;

    if (this.cartProduct) {
      await putCartProduct({
        ...this.cartProduct,
        quantity,
      });
    }

    this.dispatchEvent(
      new CustomEvent("quantity-changed", {
        detail: {
          cartProduct: this.cartProduct,
          value: quantity,
        },
      })
    );
  }

  async _handleAdd(e) {
    await postCartProduct(this._cartProduct);
    this.added = true;
  }

  async _handleRemove(e) {
    await deleteCartProduct({ id: this.cartProduct.id });
    this.dispatchEvent(
      new CustomEvent("removed", {
        detail: {
          cartProduct: this.cartProduct,
        },
      })
    );
  }

  quantitySelectorTemplate() {
    const id = `quantity-selector-${this.product.id}`;

    const quantity = this.cartProduct
      ? this.cartProduct.quantity
      : this.quantity;

    const options = new Array(this.maxQuantity + 1 - this.minQuantity)
      .fill(null)
      .map(
        (_, index) =>
          html`
            <option value=${index + 1} .selected=${quantity === index + 1}>
              ${index + 1}
            </option>
          `
      );

    return html`
      <label for=${id}>Quantity: </label>
      <select name=${id} id=${id} @change=${this._handleQuantityChange}>
        ${options};
      </select>
    `;
  }

  addButtonTemplate() {
    if (this.cartProduct) return "";

    return html`
      <button @click=${this._handleAdd}>Add to cart</button>
      ${this.added ? "Added!" : ""}
    `;
  }

  removeButtonTemplate() {
    if (this.cartProduct) {
      return html`<button @click=${this._handleRemove}>Remove</button>`;
    }

    return "";
  }

  render() {
    return html`
      <div class="add-to-cart" @click=${this._handleClick}>
        ${this.quantitySelectorTemplate()} ${this.addButtonTemplate()}
        ${this.removeButtonTemplate()}
      </div>
    `;
  }
}

customElements.define("add-to-cart", AddToCart);
