export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
  }

  addProduct(product = null) {
    // ваш код
    if (!product) {return;}

    let cartItem = this.cartItems.find(item => item.product.id === product.id);

    if (cartItem) {
      cartItem.count++;
    } else {
      cartItem = { product, count: 1 };
      this.cartItems.push(cartItem);
    }

    this.onProductUpdate(cartItem);
  }

  updateProductCount(productId, amount) {
    // ваш код
    let item = this.cartItems.find(el => el.product.id === productId);
    if (!item) {return;}
    item.count += amount;

    if (item.count === 0) {
      this.cartItems = this.cartItems.filter(el => el.product.id !== productId);
    }

    this.onProductUpdate(item);
  }

  isEmpty() {
    // ваш код
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    // ваш код
    return this.cartItems.reduce((acc, el)=> acc + el.count, 0);
  }

  getTotalPrice() {
    // ваш код
    return this.cartItems.reduce((acc, el)=> acc + (el.product.price * el.count), 0);
    
  }

  onProductUpdate(cartItem) {
    // реализуем в следующей задаче

    this.cartIcon.update(this);
  }
}
