/* ============================================
   core/siteShell.js
   Renders the shared header/footer into placeholder
   elements so nav stays consistent across all pages
   without copy-pasting markup into every HTML file.

   Usage: each page includes <div id="site-header"></div>
   and <div id="site-footer"></div>, then calls initSiteShell()
   with the correct relative path prefix ("" for root, "../" for /tools/).
   ============================================ */

import { MODULES } from "../data/toolRegistry.js";

export function initSiteShell({ prefix = "", activeModuleId = null } = {}) {
  renderHeader(prefix, activeModuleId);
  renderFooter(prefix);
  wireMobileNav();
}

function renderHeader(prefix, activeModuleId) {
  const host = document.getElementById("site-header");
  if (!host) return;

  const navLinks = MODULES.map((m) => {
    const isActive = m.id === activeModuleId;
    return `<a href="${prefix}index.html#${m.id}" class="${isActive ? "is-active" : ""}">${m.name}</a>`;
  }).join("");

  host.innerHTML = `
    <div class="site-header__inner container">
      <a class="brand" href="${prefix}index.html">
        <span class="brand__mark" aria-hidden="true">T</span>
        <span>TOK Thinking Workbench<span class="brand__sub"> &nbsp;·&nbsp; Prompt generator, not an AI</span></span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" id="nav-toggle">
        Menu
      </button>
      <nav class="site-nav" id="site-nav" aria-label="Main">
        ${navLinks}
      </nav>
    </div>
  `;
}

function renderFooter(prefix) {
  const host = document.getElementById("site-footer");
  if (!host) return;
  const year = new Date().getFullYear();
  host.innerHTML = `
    <div class="site-footer__inner container">
      <span>© ${year} TOK Thinking Workbench. Generates prompts only — no AI calls are made by this site.</span>
      <span><a href="${prefix}index.html">All tools</a></span>
    </div>
  `;
}

function wireMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}
