import { LitElement, html, css } from "lit";
import { Base } from "../Base";
import "./add-to-cart";

export class ProductCard extends Base {
  constructor() {
    super();

    this.product = {};
    this.loaded = false;
    this.showAddToCart = true;
  }

  static get properties() {
    return {
      product: { type: Object },
      cartProduct: { type: Object },
      loaded: { type: Boolean, state: true },
      showAddToCart: { type: Boolean },
    };
  }

  firstUpdated() {
    const image = this.querySelector("img");
    image.addEventListener("load", () => {
      this.loaded = true;
    });
  }

  _handleAdd(e) {
    this.dispatchEvent(new CustomEvent("added", e));
  }

  _handleQuantityChange(e) {
    this.dispatchEvent(new CustomEvent("quantity-changed", e));
  }

  _handleRemove(e) {
    this.dispatchEvent(new CustomEvent("removed", e));
  }

  addToCartTemplate() {
    if (this.showAddToCart) {
      return html`
        <add-to-cart
          .product=${this.product}
          .cartProduct=${this.cartProduct}
          @added=${this._handleAdd}
          @quantity-changed=${this._handleQuantityChange}
          @removed=${this._handleRemove}
        />
      `;
    }

    return "";
  }

  render() {
    return html`
      <div>
        <a href="/product/${this.product.id}" class="card">
          <header>
            <figure>
              <div
                class="placeholder ${this.loaded ? "fade" : ""}"
                style="background-image: url(${this.product.image})"
              ></div>
              <img
                loading="lazy"
                src="${this.product.image}"
                alt="${this.product.description}"
                data-src="${this.product.image}"
                width="1280"
                height="720"
              />
            </figure>
          </header>
          <main>
            <h1>${this.product.title}</h1>
            <p>${this.product.description}</p>
            ${this.addToCartTemplate()}
          </main>
        </a>
      </div>
    `;
  }
}
customElements.define("product-card", ProductCard);
