//
// This is client code loaded by main page template
//

// Toggle the table of contents menu based on the current value of the
// --show-table-of-contents custom property, which in turn is set by a CSS media
// query.
function toggleTableOfContents() {
  const menu = document.getElementById("menu");
  // Should be "0" or "1"
  const propertyValue = getComputedStyle(menu).getPropertyValue(
    "--show-table-of-contents"
  );
  menu.open = parseInt(propertyValue) === 1;
}

// Open menu on desktop
window.addEventListener("load", () => {
  toggleTableOfContents();
});
window.addEventListener("pagehide", () => {
  menu.open = false;
});
window.addEventListener("resize", () => {
  toggleTableOfContents();
});
