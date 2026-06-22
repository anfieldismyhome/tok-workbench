/* ============================================
   app.js — Landing page bootstrap.
   Renders the module/tool grid from the registry
   and initialises the shared header/footer.
   ============================================ */

import { initSiteShell } from "./core/siteShell.js";
import { MODULES } from "./data/toolRegistry.js";

initSiteShell({ prefix: "" });

function renderModuleGrid() {
  const host = document.getElementById("module-grid");
  if (!host) return;

  const html = MODULES.map(
    (mod, i) => `
    <section class="module-section" id="${mod.id}">
      <div class="module-section__head">
        <span class="module-section__index">0${i + 1}</span>
        <h2 class="mt-0">${mod.name}</h2>
      </div>
      <p class="module-section__desc">${mod.desc}</p>
      <div class="tool-grid">
        ${mod.tools
          .map(
            (tool) => `
          <a class="tool-card" href="${tool.href}">
            <span class="tool-card__icon" aria-hidden="true">${tool.icon}</span>
            <h3>${tool.name}</h3>
            <p>${tool.desc}</p>
          </a>`
          )
          .join("")}
      </div>
    </section>`
  ).join("");

  host.innerHTML = html;
}

renderModuleGrid();
