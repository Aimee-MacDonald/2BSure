var el_dbProducts = document.getElementById("dbProducts");
var products = JSON.parse(el_dbProducts.value);
el_dbProducts.parentNode.removeChild(el_dbProducts);

var el_csrfToken = document.getElementById("csrf");
var csrfToken = el_csrfToken.value;
el_csrfToken.parentNode.removeChild(el_csrfToken);

var el_cartCount = document.getElementById("cartCount");
var cartCount = parseInt(el_cartCount.value);
el_cartCount.parentNode.removeChild(el_cartCount);
var cartText = "Cart: " + cartCount;
document.getElementById("cart").innerText = cartText;

var el_products = document.getElementById("products");

for(var i = 0; i < products.length; i++){
  var el_product = document.createElement("div");
  el_product.classList = "product";

  var el_name = document.createElement("p");
  el_name.innerText = products[i].name;

  var el_addButton = document.createElement("button");
  el_addButton.setAttribute("onclick", "addToCart(" + i + ")");
  el_addButton.innerText = "Add to Cart";

  el_product.append(el_name);
  el_product.append(el_addButton);
  el_products.append(el_product);
}

function addToCart(prodID){
  var request = new XMLHttpRequest();
  request.open("POST", "/addToCart");
  request.setRequestHeader("CSRF-Token", csrfToken);
  request.setRequestHeader("Content-Type", "application/json");
  request.withCredentials = true;

  request.onload = function(){
    if(request.readyState === 4){
      if(request.status === 200){
        cartCount++;
        cartText = "Cart: " + cartCount;
        document.getElementById("cart").innerText = cartText;
      } else {
        console.log("Error adding to Cart");
      }
    }
  }

  request.onerror = function(){
    console.log("Error adding to Cart");
  }

  request.send(JSON.stringify({'id': products[prodID]._id}));
}
