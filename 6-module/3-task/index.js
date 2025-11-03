import createElement from "../../assets/lib/create-element.js";

export default class Carousel {
  constructor(slides) {
    this.slides = slides;
    this.index = 0;
  }
  render() {
    this._elem = createElement(`<div class="carousel">
    <!--Кнопки переключения-->
    <div class="carousel__arrow carousel__arrow_right">
      <img src="/assets/images/icons/angle-icon.svg" alt="icon">
    </div>
    <div class="carousel__arrow carousel__arrow_left">
      <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
    </div>
  </div>`);

    this.arrowLeft = this._elem.querySelector('.carousel__arrow_left');
    this.arrowRight = this._elem.querySelector('.carousel__arrow_right');
    this.arrowLeft.style.display = 'none';

    this._elem.append(this.cretateCarouselInner());

    this.onClick();
  }

  cretateCarouselInner() {
    let carouselInner = createElement(`<div class="carousel__inner">
      </div>`);
    for (let slideData of this.slides) {
      let slide = createElement(`<div class="carousel__slide" data-id="${
        slideData.id
      }">
  <img src="/assets/images/carousel/${
  slideData.image
}" class="carousel__img" alt="slide">
  <div class="carousel__caption">
    <span class="carousel__price">€${slideData.price.toFixed(2)}</span>
    <div class="carousel__title">${slideData.name}</div>
    <button type="button" class="carousel__button">
      <img src="/assets/images/icons/plus-icon.svg" alt="icon">
    </button>
  </div>
</div>`);
      carouselInner.append(slide);
    }

    this.finalSlide = this.slides.length;
    return carouselInner;
  }
  onClick() {
    this._elem.addEventListener('click', ({target}) =>{
      
      if (target.classList.contains('carousel__arrow_right')) {
        this.goRigth(target);
      }
      if (target.classList.contains('carousel__arrow_left')) {
        this.goLeft(target);
      }

        
      if (target.closest('.carousel__button')) {
        let slide = target.closest('.carousel__slide');
        let event = new CustomEvent("product-add", { // имя события должно быть именно "product-add"
          detail: slide.dataset.id, // Уникальный идентификатора товара из объекта слайда
          bubbles: true // это событие всплывает - это понадобится в дальнейшем
        });
        this._elem.dispatchEvent(event);
      } 
    });}
  goRigth() {
    this.index++; 
    this.transform();
    // eslint-disable-next-line no-unused-expressions
    this.index === this.finalSlide - 1 ? this.arrowRight.style.display = "none" : this.arrowLeft.style.display = "";
  } 
  goLeft() {
    this.index--;
    this.transform();

    if (this.index === 0) {
      this.arrowLeft.style.display = "none";
      this.arrowRight.style.display = "";
    }
  }
  transform() {
    let mainDiv = this._elem.querySelector('.carousel__slide');
    this._elem.querySelector('.carousel__inner').style.transform = `translateX(-${mainDiv.offsetWidth * this.index}px)`;
  }

  get elem() {
    if (!this._elem) {
      this.render();
    }
    return this._elem;
  }
}
