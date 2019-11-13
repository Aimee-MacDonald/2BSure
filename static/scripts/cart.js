var el_cart = document.getElementById("JSONCart");
var cart = JSON.parse(el_cart.value);
el_cart.parentNode.removeChild(el_cart);

for(var i = 0; i < cart.length; i++){
  console.log(cart[i]);
}
