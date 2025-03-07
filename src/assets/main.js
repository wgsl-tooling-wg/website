//
// This is client code loaded by main page template
//

let sideNav;
let navMenu;

window.addEventListener("load", () => {
  // Copy the contents of the side navigation to the navigation menu
  sideNav = document.getElementById("sideNav");
  navMenu = document.getElementById("navMenu");
  if (sideNav && navMenu) {
    const clone = sideNav.cloneNode(true);
    clone.removeAttribute("id");
    navMenu.appendChild(clone);
  }

  // The pagehide handler below should be sufficient, but on iOS at least it's
  // too slow to act and can leave the menu visible when navigating back, so we
  // also try to close the menu before the navigation occurs.
  navMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navMenu.open = false;
    }
  });
});

window.addEventListener("pagehide", () => {
  navMenu.open = false;
});

document.addEventListener("click", (event) => {
  if (navMenu.open && !navMenu.contains(event.target)) {
    navMenu.open = false;
  }
});
