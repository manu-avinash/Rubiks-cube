// Navigation

var tabs = document.querySelectorAll(".tab");
tabs[0].firstElementChild.addEventListener("click", () => {
  open("/app/html/test.html", "_self");
});
tabs[1].firstElementChild.addEventListener("click", () => {
  open("/app/html/about.html", "_self");
});
tabs[2].firstElementChild.addEventListener("click", () => {
  open("/app/html/contact.html", "_self");
});
