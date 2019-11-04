var el_dbProducts = document.getElementById("dbProducts");
var products = JSON.parse(el_dbProducts.value);

el_dbProducts.parentNode.removeChild(el_dbProducts);

var el_products = document.getElementById("products");

for(var i = 0; i < products.length; i++){
  var el_product = document.createElement("div");
  el_product.classList = "product";

  var el_name = document.createElement("p");
  el_name.innerText = products[i].name;

  var el_addButton = document.createElement("button");
  el_addButton.innerText = "Add to Cart";

  el_product.append(el_name);
  el_product.append(el_addButton);
  el_products.append(el_product);
}
