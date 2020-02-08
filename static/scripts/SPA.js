var el_body = document.getElementById("body");

// Remove all Elements from Body
for(var i = 0; i < el_body.childNodes.length; i++){
  el_body.removeChild(el_body.childNodes[i]);
}
