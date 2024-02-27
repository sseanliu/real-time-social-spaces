let div = document.getElementById("blueBorderDiv");

function mousemovehandler(event) {
  //console.log(event);
  // div.style.left = event.clientX + "px";
  // div.style.top = event.clientY + "px";
  console.log(event.screenX);
  div.innerHTML = "Mouse Position: " + event.screenX + ", " + event.screenY;
  // this means it will be centered on the mouse
}

function scrollhandler(event) {
  console.log(div.scrollTop); // it means the scroll position of the div
  console.log('scroll:' + event);
}

console.log(div);

div.addEventListener("mousemove", mousemovehandler);
div.addEventListener("scroll", scrollhandler);