module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {}; //initItems: items from the old cart
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = (item, id) => {
    var storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = {
        item,
        qty: 0,
        price: 0
      };
    }
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice += storedItem.item.price;
  };

  //generate cart item as array
  this.generateArray = () => {
    var arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };

  this.reduceByOne = id => {
    this.items[id].qty--;
    this.items[id].price -= this.items[id].item.price;
    this.totalPrice -= this.items[id].item.price;
    this.totalQty--;

    if (this.items[id].qty <= 0) {
      delete this.items[id];
    }
  };

  this.removeAll = id => {
    this.totalPrice -= this.items[id].price;
    this.totalQty -= this.items[id].qty;
    delete this.items[id];
  };
};
