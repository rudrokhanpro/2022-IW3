import { html } from "lit";
import { postCartProduct } from "../api/cart";
import { Base } from "../Base";
import "../components/add-to-cart";
import { CART_STORE_NAME, setRessource } from "../idbHelper";

export class AppProduct extends Base {
  constructor() {
    super();

    this.product = {};

    this.loaded = false;
  }

  static get properties() {
    return {
      product: { type: Object },
      loaded: { type: Boolean, state: true },
    };
  }

  firstUpdated() {
    const image = this.querySelector("img");
    image.addEventListener("load", () => {
      this.loaded = true;
    });
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
    return html`
      <section class="product">
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
        </main>
        <add-to-cart .product=${this.product} @added=${this._handleAdd} />
      </section>
    `;
  }
}
customElements.define("app-product", AppProduct);
