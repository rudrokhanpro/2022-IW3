import { html } from "lit";
import { Base } from "../Base";
import "../components/add-to-cart";

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
        <add-to-cart .product=${this.product} />
      </section>
    `;
  }
}
customElements.define("app-product", AppProduct);
