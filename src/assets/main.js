//
// This is client code loaded by main page template
//

/**
 * Manage the side navigation and the navigation menu.
 *
 * At larger window sizes, we display the navigation on the side of the page,
 * but on mobile we use a <details> element to show a menu instead.
 *
 * In theory those could both use the same navigation content, but one issue is
 * that the `open` state of a details element can't be controlled through a CSS
 * media query. We tried having code that would keep these in sync, but this
 * resulted in flicker.
 *
 * Instead, we copy the contents of the side navigation to the navigation menu
 * when the page loads. We then rely on media queries to show the correct form
 * of navigation.
 *
 * Code is also required to close the menu.
 */

let sideNav;
let navMenu;

// Wait until the navigation elements are available
window.addEventListener("DOMContentLoaded", () => {
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

// Hide the menu when navigation away
window.addEventListener("pagehide", () => {
  navMenu.open = false;
});

// Clicking outside an open menu dismisses it
document.addEventListener("click", (event) => {
  if (navMenu.open && !navMenu.contains(event.target)) {
    navMenu.open = false;
  }
});

/**
 * Add `aria-current` to links that point to the current page
 */
document.addEventListener("DOMContentLoaded", () => {
  // Remove any extension from the current pathname
  const currentPath = window.location.pathname.replace(/\.html$/, "");
  document.querySelectorAll("a").forEach((anchor) => {
    // Get link destination without the extension
    const anchorUrl = new URL(anchor.href, window.location.origin);
    const anchorPath = anchorUrl.pathname.replace(/\.html$/, "");
    if (anchorPath === currentPath) {
      anchor.setAttribute("aria-current", "page");
    }
  });
});
