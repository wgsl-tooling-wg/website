/// <reference types="wesl-plugin/suffixes" />
//
// This is client code loaded by main page template
//

import * as weslRs from "./wesl-rs-adapter";
import linkConfig from "./main.wesl?link";

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

let sideNav: HTMLElement | null;
let navMenu: HTMLDetailsElement | null;

// Wait until the navigation elements are available
window.addEventListener("DOMContentLoaded", () => {
  // Copy the contents of the side navigation to the navigation menu
  sideNav = document.getElementById("sideNav");
  navMenu = document.getElementById("navMenu") as HTMLDetailsElement | null;
  if (sideNav && navMenu) {
    const clone = sideNav.cloneNode(true) as HTMLElement;
    clone.removeAttribute("id");
    navMenu.appendChild(clone);
  }

  // The pagehide handler below should be sufficient, but on iOS at least it's
  // too slow to act and can leave the menu visible when navigating back, so we
  // also try to close the menu before the navigation occurs.
  navMenu!.addEventListener("click", (event: MouseEvent) => {
    if (event.target instanceof HTMLAnchorElement) {
      navMenu!.open = false;
    }
  });
});

// Hide the menu when navigation away
window.addEventListener("pagehide", () => {
  navMenu!.open = false;
});

// Clicking outside an open menu dismisses it
document.addEventListener("click", (event: MouseEvent) => {
  if (navMenu!.open && !navMenu!.contains(event.target as Node)) {
    navMenu!.open = false;
  }
});

const envSrc = `
  struct Uniforms {
    resolution: vec2f,
    time: f32,
    mouse: vec2f,
  }

  @group(0) @binding(0) var<uniform> u: Uniforms;
`;

interface WeslProject {
  weslSrc?: Record<string, string>;
  rootModuleName?: string;
  conditions?: Record<string, boolean>;
}

interface WgslEditElement extends HTMLElement {
  source: string;
  sources: Record<string, string>;
  _libs?: any[];
  conditions: Record<string, boolean>;
  project: WeslProject;
  link(options: { virtualLibs: Record<string, () => string> }): Promise<string>;
}

interface WgslPlayElement extends HTMLElement {
  project: WeslProject;
  rebuildPipeline(): void;
}

const homeProject: WeslProject = {
  ...linkConfig,
  conditions: { noise: true },
};

function showWgslModal(titleText: string, wgslSource: string): void {
  const backdrop = document.createElement("div");
  backdrop.className = "wgsl-modal-backdrop";

  const modal = document.createElement("div");
  modal.className = "wgsl-modal";

  const header = document.createElement("div");
  header.className = "wgsl-modal-header";
  const title = document.createElement("span");
  title.textContent = titleText;
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "\u00d7";
  closeBtn.className = "wgsl-modal-close";
  header.append(title, closeBtn);

  const viewer = document.createElement("wgsl-edit") as WgslEditElement;
  viewer.setAttribute("readonly", "");
  viewer.setAttribute("tabs", "false");
  viewer.setAttribute("lint", "off");

  modal.append(header, viewer);
  backdrop.append(modal);
  document.body.append(backdrop);

  requestAnimationFrame(() => { viewer.source = wgslSource; });

  const close = () => backdrop.remove();
  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", (e: MouseEvent) => {
    if (e.target === backdrop) close();
  });
  document.addEventListener("keydown", function onKey(e: KeyboardEvent) {
    if (e.key === "Escape") { close(); document.removeEventListener("keydown", onKey); }
  });
}

/**
 * Home page: set up noise condition toggle and WGSL viewer buttons
 */
document.addEventListener("DOMContentLoaded", () => {
  const editor = document.getElementById("home-editor") as WgslEditElement | null;
  const player = document.getElementById("home-player") as WgslPlayElement | null;
  const toggle = document.getElementById("noise-toggle") as HTMLInputElement | null;
  const wgslBtn = document.getElementById("wgsl-btn") as HTMLButtonElement | null;
  const rustBtn = document.getElementById("rust-btn") as HTMLButtonElement | null;
  if (!editor || !toggle || !wgslBtn || !rustBtn) return;

  // Initialize editor with project config (replaces inline <script type="text/wesl"> tags)
  editor.project = homeProject;

  // Noise condition toggle - update both editor and player
  const update = () => {
    const conditions = { noise: toggle.checked };
    editor.conditions = conditions;
    if (player) {
      player.project = { conditions };
    }
  };
  toggle.addEventListener("change", update);

  // JS linker button
  wgslBtn.addEventListener("click", async () => {
    let wgsl: string;
    try {
      wgsl = await editor.link({
        virtualLibs: { env: () => envSrc },
      });
    } catch (e) {
      console.error("link failed", e);
      return;
    }
    showWgslModal("Transpiled to WGSL (JS)", wgsl);
  });

  // Rust/WASM compiler button
  rustBtn.addEventListener("click", async () => {
    rustBtn.disabled = true;
    const origText = rustBtn.textContent;
    rustBtn.textContent = weslRs.isLoaded() ? "Compiling..." : "Loading WASM...";

    try {
      const wgsl = await weslRs.compile(editor, envSrc);
      showWgslModal("Transpiled to WGSL (Rust)", wgsl);
    } catch (e: unknown) {
      console.error("wesl-rs compile failed", e);
      const msg = (e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e));
      showWgslModal("Rust Compile Error", "// Error:\n// " + msg.replace(/\n/g, "\n// "));
    } finally {
      rustBtn.disabled = false;
      rustBtn.textContent = origText;
    }
  });
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
    if (anchorUrl.origin === window.location.origin) {
      const anchorPath = anchorUrl.pathname.replace(/\.html$/, "");
      if (anchorPath === currentPath) {
        anchor.setAttribute("aria-current", "page");
      }
    }
  });
});
