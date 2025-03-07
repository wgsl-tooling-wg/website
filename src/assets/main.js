//
// This is client code loaded by main page template
//

// Manage the display of the menu with the table of contents

window.addEventListener("load", () => {
  // The pagehide handler below should be sufficient, but on iOS at least it's
  // too slow to act and can leave the menu visible when navigating back, so we
  // also try to close the menu before the navigation occurs.
  document.getElementById("menu").addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menu.open = false;
    }
  });
});
window.addEventListener("pagehide", () => {
  document.getElementById("menu").open = false;
});
window.addEventListener("pageshow", () => {
  toggleTocMenu();
});
window.addEventListener("resize", () => {
  toggleTocMenu();
});
