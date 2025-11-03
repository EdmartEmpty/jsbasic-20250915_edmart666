import createElement from "../../assets/lib/create-element.js";
import escapeHtml from "../../assets/lib/escape-html.js";

import Modal from "../../7-module/2-task/index.js";

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    // СКОПИРУЙТЕ СЮДЯ СВОЙ КОД
    if (!product) {
      return;
    }

    let cartItem = this.cartItems.find(
      (item) => item.product.id === product.id
    );

    if (cartItem) {
      cartItem.count++;
    } else {
      cartItem = { product, count: 1 };
      this.cartItems.push(cartItem);
    }

    this.onProductUpdate(cartItem);
  }

  updateProductCount(productId, amount) {
    // СКОПИРУЙТЕ СЮДЯ СВОЙ КОД
    let item = this.cartItems.find((el) => el.product.id === productId);
    if (!item) {
      return;
    }

    item.count += amount;

    if (item.count <= 0) {
      this.cartItems = this.cartItems.filter(
        (el) => el.product.id !== productId
      );
    }
    this.onProductUpdate(item);
  }

  isEmpty() {
    // СКОПИРУЙТЕ СЮДЯ СВОЙ КОД
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    // СКОПИРУЙТЕ СЮДЯ СВОЙ КОД
    return this.cartItems.reduce((acc, el) => acc + el.count, 0);
  }

  getTotalPrice() {
    // СКОПИРУЙТЕ СЮДЯ СВОЙ КОД
    return this.cartItems.reduce(
      (acc, el) => acc + el.product.price * el.count,
      0
    );
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    // ...ваш код
    this.modalWindow = new Modal();
    this.modalWindow.setTitle('Your order');
    let contaner = document.createElement("div");
    for (let i = 0; i < this.cartItems.length; i++) {
      let { product, count } = this.cartItems[i];

      let elem = this.renderProduct(product, count);
      contaner.append(elem);
    }
    contaner.append(this.renderOrderForm());
    this.modalWindow.setBody(contaner);
    this.modalWindow.open();

    this.modalWindow._modalRoot.addEventListener("click", (event) => {
      let cartProduct = event.target.closest(".cart-product");

      let buttonPlus = event.target.closest(".cart-counter__button_plus");

      if (buttonPlus) {
        this.updateProductCount(cartProduct.dataset.productId, 1);
      }

      let buttonMinus = event.target.closest(".cart-counter__button_minus");
      if (buttonMinus) {
        this.updateProductCount(cartProduct.dataset.productId, -1);
      }
    });

    const form = this.modalWindow._modalRoot.querySelector('.cart-form');

    form.addEventListener("submit", (event) =>
      this.onSubmit(event)
    );
  }

  onProductUpdate(cartItem) {
    // ...ваш код
    this.cartIcon.update(this);
    if (this.isEmpty()) {
      this.modalWindow.close();
      return;
    }
    if (document.body.classList.contains("is-modal-open")) {
      let productId = cartItem.product.id;
      let modalBody = document.body.querySelector(".modal");

      if (!modalBody) {
        return;
      }

      let item = this.cartItems.find((el) => el.product.id === productId);
      if (!item) {
        let productElement = modalBody.querySelector(
          `[data-product-id="${productId}"]`
        );
        if (productElement) {
          productElement.remove();
        }
      } else {
        let productCount = modalBody.querySelector(
          `[data-product-id="${productId}"] .cart-counter__count`
        );
        let productPrice = modalBody.querySelector(
          `[data-product-id="${productId}"] .cart-product__price`
        );

        productCount.innerHTML = item.count;
        productPrice.innerHTML = `€${(item.count * item.product.price).toFixed(2)}`;
      }

      let infoPrice = modalBody.querySelector(`.cart-buttons__info-price`);
      infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
    }
  }
  async onSubmit(event) {
    // ...ваш код
    event.preventDefault();
    let button = event.target.querySelector(".cart-buttons__button");
    button.classList.add("is-loading");
    let dataForm = new FormData(event.target);
 
    let response = await fetch("https://httpbin.org/post", {
      method: "POST",
      body: dataForm,
    });
    if (response.ok) {
      this.cartItems = [];
     

      this.modalWindow.setTitle("Success!");
      this.modalWindow.setBody(
        createElement(`<div class="modal__body-inner">
  <p>
    Order successful! Your order is being cooked :) <br>
    We’ll notify you about delivery time shortly.<br>
    <img src="/assets/images/delivery.gif">
  </p>
</div>`)
      );
      this.cartIcon.update(this);
      button.classList.remove("is-loading");
    }
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}
