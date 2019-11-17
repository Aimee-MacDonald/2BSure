var el_cart = document.getElementById("JSONCart");
var cart = JSON.parse(el_cart.value);
el_cart.parentNode.removeChild(el_cart);

el_cartList = document.getElementById("cartList");

for(var i = 0; i < cart.length; i++){
  var el_item = document.createElement("li");
  el_item.innerText = cart[i];
  el_cartList.append(el_item);
}
