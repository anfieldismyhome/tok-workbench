/* ============================================
   core/outputPanel.js
   Renders the generated prompt + actions + the
   "why this prompt works" pedagogical explainer.
   ============================================ */

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else if (v !== undefined && v !== null && v !== false) node.setAttribute(k, v === true ? "" : v);
  }
  for (const child of [].concat(children)) {
    if (child) node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

let toastTimer = null;
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = el("div", { class: "toast" });
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

export function renderEmptyState(container, { icon = "✦", message = "Fill in the form and generate a prompt to see it here." } = {}) {
  container.innerHTML = "";
  container.appendChild(
    el("div", { class: "output-empty" }, [
      el("div", { class: "output-empty__icon", text: icon, "aria-hidden": "true" }),
      el("p", { text: message }),
    ])
  );
}

/**
 * Renders the generated prompt plus copy/download controls and an optional
 * "why this prompt works" list explaining the pedagogy behind the prompt.
 *
 * @param {HTMLElement} container
 * @param {Object} result - { promptText, whyItWorks: string[], meta: {label,variant}[], filename }
 */
export function renderResult(container, result) {
  const { promptText, whyItWorks = [], meta = [], filename = "tok-prompt.txt" } = result;
  container.innerHTML = "";

  const head = el("div", { class: "output-panel__head" }, [
    el("h3", { class: "output-panel__title", text: "Your generated prompt" }),
    el("div", { class: "output-panel__actions" }, [
      el("button", { type: "button", class: "btn btn--secondary btn--sm", text: "Copy", onclick: () => copyPrompt(promptText) }),
      el("button", { type: "button", class: "btn btn--ghost btn--sm", text: "Download .txt", onclick: () => downloadPrompt(promptText, filename) }),
    ]),
  ]);
  container.appendChild(head);

  const pre = el("div", { class: "prompt-output", tabindex: "0" });
  pre.textContent = promptText;
  container.appendChild(pre);

  if (meta.length) {
    const metaRow = el("div", { class: "output-meta" });
    meta.forEach((m) => metaRow.appendChild(el("span", { class: `badge badge--${m.variant || "module"}`, text: m.label })));
    container.appendChild(metaRow);
  }

  if (whyItWorks.length) {
    const detailsId = "why-this-works-content";
    const why = el("details", { class: "why-this-works" }, [
      el("summary", { class: "why-this-works__toggle", "aria-controls": detailsId }, [
        el("span", { text: "Why this prompt works" }),
        el("span", { class: "why-this-works__chevron", "aria-hidden": "true", text: "▾" }),
      ]),
      el(
        "ul",
        { id: detailsId },
        whyItWorks.map((point) => el("li", { text: point }))
      ),
    ]);
    container.appendChild(why);
  }
}

function copyPrompt(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => showToast("Prompt copied to clipboard"))
      .catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    showToast("Prompt copied to clipboard");
  } catch {
    showToast("Couldn't copy — please select and copy manually");
  }
  document.body.removeChild(ta);
}

function downloadPrompt(text, filename) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Download started");
}

export { showToast };
