import createElement from "../../assets/lib/create-element.js";

export default class Modal {
  constructor() {
    this._modalRoot = null;
    this._title = null;
    this._node = null;
    this.escFunc = this.escFunc.bind(this);
  }

  open() {
    if (!this._modalRoot) {
      this.createRoot();
    }

    const titleElement = this._modalRoot.querySelector(".modal__title");
    titleElement.textContent = this._title;

    const bodyElement = this._modalRoot.querySelector(".modal__body");
    bodyElement.innerHTML = "";

    if (this._node) {
      bodyElement.append(this._node);
    }

    this._modalRoot.addEventListener("click", ({ target }) => {
      if (target.closest(".modal__close")) {
        this.close();
      }
    });

    document.addEventListener("keydown", this.escFunc);

    document.body.classList.add("is-modal-open");
    document.body.append(this._modalRoot);
  }

  escFunc(event) {
    if (event.code === "Escape") {
      this.close();
    }
  }

  createRoot() {
    this._modalRoot = createElement(`<div class="modal">
       
      <div class="modal__overlay"></div>
  
      <div class="modal__inner">
        <div class="modal__header">
          
          <button type="button" class="modal__close">
            <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
          </button>
  
          <h3 class="modal__title">
          ${this._title}
          </h3>
        </div>
  
        <div class="modal__body">
         
        </div>
      </div>
    </div>`);
  }

  setTitle(title) {
    this._title = title;
    if (this._modalRoot) {
      const titleElement = this._modalRoot.querySelector(".modal__title");
      titleElement.textContent = this._title;
    }
  }

  setBody(node) {
    this._node = node;
    if (this._modalRoot) {
      const bodyElement = this._modalRoot.querySelector(".modal__body");
      bodyElement.innerHTML = "";
      bodyElement.append(this._node);
    }
  }
  close() {
    document.body.classList.remove("is-modal-open");
    this._modalRoot.remove();
    document.removeEventListener("keydown", this.escFunc);
  }
}
