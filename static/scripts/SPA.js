resetSPA();

// Restore the SPA to it's Original State
function resetSPA(){
  clearBody();
  addStyle();
  addElements();
}

// Remove all Elements from Body
function clearBody(){
  var el_body = document.getElementById("body");
  for(var i = 0; i < el_body.childNodes.length; i++){
    el_body.removeChild(el_body.childNodes[i]);
  }
}

// Create and add Style Element
function addStyle(){
  var el_head = document.getElementById("head");
  var el_style = document.getElementById("style");
  el_head.removeChild(el_style);
  el_style = document.createElement("link");
  el_style.setAttribute("rel", "stylesheet");
  el_style.setAttribute("href", "/styles/spa.css");
  el_head.append(el_style);
}

function addElements(){
  var el_body = document.getElementById("body");

  var el_splash = document.createElement("img");
  el_splash.setAttribute("src", "/images/ketomojo.svg");
  el_splash.setAttribute("alt", "2BSure");
  el_splash.setAttribute("id", "splash");

  var el_p = document.createElement("p");
  el_p.innerText = "Short descriptive paragraph explaining the purpose and importance of ketomojo";

  var el_info_link = document.createElement("a");
  el_info_link.setAttribute("href", "#info");
  el_info_link.innerText = "Learn More";

  var el_products_link = document.createElement("a");
  el_products_link.setAttribute("href", "#products");
  el_products_link.innerText = "Order Now";

  el_body.append(el_splash);
  el_body.append(el_p);
  el_body.append(el_info_link);
  el_body.append(el_products_link);
}
