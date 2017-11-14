var mongoose = require("mongoose");

var { Product } = require("../models/product");

mongoose.connect("localhost:27017/shopping");

var products = [
  new Product({
    imagePath:
      "https://i.pinimg.com/736x/35/09/96/3509966fbcc98784e47c53854fbadb58--art-movies-alternative-movie-posters.jpg",
    title: "Kill Bill",
    description: "Awesome movie",
    price: 12
  }),
  new Product({
    imagePath:
      "https://images-na.ssl-images-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_UX182_CR0,0,182,268_AL_.jpg",
    title: "Blade Runner",
    description: "Awesome movie",
    price: 12
  }),
  new Product({
    imagePath:
      "https://images-na.ssl-images-amazon.com/images/M/MV5BYzVmYzVkMmUtOGRhMi00MTNmLThlMmUtZTljYjlkMjNkMjJkXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_UX182_CR0,0,182,268_AL_.jpg",
    title: "Oceans Eleven",
    description: "Awesome movie",
    price: 12
  })
];

var done = 0;
for (let i = 0; i < products.length; i++) {
  done++;
  products[i].save((err, result) => {
    if (done === products.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
