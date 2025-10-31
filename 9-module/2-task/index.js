import Carousel from '../../6-module/3-task/index.js';
import slides from '../../6-module/3-task/slides.js';

import RibbonMenu from '../../7-module/1-task/index.js';
import categories from '../../7-module/1-task/categories.js';

import StepSlider from '../../7-module/4-task/index.js';
import ProductsGrid from '../../8-module/2-task/index.js';

import CartIcon from '../../8-module/1-task/index.js';
import Cart from '../../8-module/4-task/index.js';

export default class Main {

  constructor() {
  }

  async render() {
    // ... ваш код
    this.myCarousel = new Carousel(slides);
    let carouselHolder = document.body.querySelector('[data-carousel-holder]');
    carouselHolder.append(this.myCarousel.elem);

    this.myRibbonMenu = new RibbonMenu(categories);
    let myRibbonHolder = document.body.querySelector('[data-ribbon-holder]');
    myRibbonHolder.append(this.myRibbonMenu.elem);

    this.mySliderStep = new StepSlider({ steps: 5, value: 3 });
    let mySliderHolder = document.body.querySelector('[data-slider-holder]');
    mySliderHolder.append(this.mySliderStep.elem);

    this.myCarIcon = new CartIcon();
    let myDataIconHolder = document.body.querySelector('[data-cart-icon-holder]');
    myDataIconHolder.append(this.myCarIcon.elem);


    this.myCart = new Cart(this.myCarIcon);

    let myProductGridHolder = document.body.querySelector('[data-products-grid-holder]');
    myProductGridHolder.innerHTML = '';

    let requestItems = await fetch('products.json');
    this.items = await requestItems.json();



    this.myProductGrid = new ProductsGrid(this.items);

    myProductGridHolder.append(this.myProductGrid.elem);



    this.mySliderStep.elem.addEventListener('slider-change', event => {
      this.myProductGrid.updateFilter({
        maxSpiciness: event.detail,
      });
    });

    document.getElementById('nuts-checkbox').addEventListener('change', event => {
      this.myProductGrid.updateFilter({
        noNuts: document.getElementById('nuts-checkbox').checked,
      });
    });

    document.getElementById('vegeterian-checkbox').addEventListener('change', event => {
      this.myProductGrid.updateFilter({
        vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
      });
    });

    this.myRibbonMenu.elem.addEventListener('ribbon-select', event => {
      this.myProductGrid.updateFilter({ category: event.detail });
    });

    document.body.addEventListener('product-add', event => {
      
      let name = event.detail;
      if (name) {
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].id === name) {
            this.myCart.addProduct(this.items[i]);
          }
        }
      }
    });
  }
}
