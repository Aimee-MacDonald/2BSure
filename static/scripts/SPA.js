resetSPA();

// Restore the SPA to it's Original State
function resetSPA(){
  clearBody();
  addStyle();
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
