/* ============================================
   core/formRenderer.js
   Renders an HTML form from a declarative field schema.
   Each tool defines fields once; this module turns that
   schema into accessible markup and back into values.

   Supported field types:
   - text        : single-line input
   - textarea    : multi-line input (with optional maxLength + live counter)
   - select      : single choice dropdown
   - chips       : multi-select chip group (checkboxes styled as chips)
   - radio-chips : single-select chip group (radios styled as chips)
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

function fieldWrapper(field) {
  const wrap = el("div", { class: "field", "data-field-id": field.id, id: `field-${field.id}` });
  const label = el("label", { class: "field__label", for: `input-${field.id}` }, [
    field.label,
    field.required ? el("span", { class: "field__required", text: "Required" }) : null,
  ]);
  wrap.appendChild(label);
  return wrap;
}

function buildTextInput(field) {
  const wrap = fieldWrapper(field);
  const input = el("input", {
    type: "text",
    class: "input",
    id: `input-${field.id}`,
    name: field.id,
    placeholder: field.placeholder || "",
    required: !!field.required,
  });
  wrap.appendChild(input);
  if (field.hint) wrap.appendChild(el("p", { class: "field__hint", text: field.hint }));
  wrap.appendChild(el("p", { class: "field__error", text: field.errorMessage || "This field is required." }));
  return wrap;
}

function buildTextarea(field) {
  const wrap = fieldWrapper(field);
  const textarea = el("textarea", {
    class: "input",
    id: `input-${field.id}`,
    name: field.id,
    placeholder: field.placeholder || "",
    rows: field.rows || 4,
    required: !!field.required,
    maxlength: field.maxLength || "",
  });
  wrap.appendChild(textarea);
  if (field.hint) wrap.appendChild(el("p", { class: "field__hint", text: field.hint }));
  if (field.maxLength) {
    const counter = el("p", { class: "char-count" }, [`0 / ${field.maxLength}`]);
    textarea.addEventListener("input", () => {
      const len = textarea.value.length;
      counter.textContent = `${len} / ${field.maxLength}`;
      counter.classList.toggle("is-over", len > field.maxLength);
    });
    wrap.appendChild(counter);
  }
  wrap.appendChild(el("p", { class: "field__error", text: field.errorMessage || "This field is required." }));
  return wrap;
}

function buildSelect(field) {
  const wrap = fieldWrapper(field);
  const select = el("select", {
    class: "input",
    id: `input-${field.id}`,
    name: field.id,
    required: !!field.required,
  });
  if (field.placeholder) {
    select.appendChild(el("option", { value: "", text: field.placeholder, disabled: !field.allowEmptySubmit }));
  }
  for (const opt of field.options) {
    select.appendChild(el("option", { value: opt.value, text: opt.label }));
  }
  if (field.defaultValue) select.value = field.defaultValue;
  wrap.appendChild(select);
  if (field.hint) wrap.appendChild(el("p", { class: "field__hint", text: field.hint }));
  wrap.appendChild(el("p", { class: "field__error", text: field.errorMessage || "Please make a selection." }));
  return wrap;
}

function buildChipGroup(field, multi) {
  const wrap = fieldWrapper(field);
  const group = el("div", { class: "chip-group", role: multi ? "group" : "radiogroup", "aria-labelledby": `field-${field.id}` });
  field.options.forEach((opt, i) => {
    const inputId = `input-${field.id}-${opt.value}`;
    const input = el("input", {
      type: multi ? "checkbox" : "radio",
      id: inputId,
      name: field.id,
      value: opt.value,
    });
    if (!multi && field.defaultValue === opt.value) input.checked = true;
    const chip = el("div", { class: "chip" }, [
      input,
      el("label", { for: inputId, text: opt.label }),
    ]);
    group.appendChild(chip);
  });
  wrap.appendChild(group);
  if (field.hint) wrap.appendChild(el("p", { class: "field__hint", text: field.hint }));
  wrap.appendChild(el("p", { class: "field__error", text: field.errorMessage || "Please choose at least one option." }));
  return wrap;
}

const BUILDERS = {
  text: buildTextInput,
  textarea: buildTextarea,
  select: buildSelect,
  chips: (f) => buildChipGroup(f, true),
  "radio-chips": (f) => buildChipGroup(f, false),
};

/**
 * Renders the full form into container based on schema (array of field defs).
 * Returns { formEl, getValues, validate }
 */
export function renderForm(container, schema) {
  container.innerHTML = "";
  const form = el("form", { novalidate: true });

  for (const field of schema) {
    const builder = BUILDERS[field.type];
    if (!builder) {
      console.warn(`Unknown field type "${field.type}" for field "${field.id}"`);
      continue;
    }
    form.appendChild(builder(field));
  }

  container.appendChild(form);

  function getValues() {
    const values = {};
    for (const field of schema) {
      if (field.type === "chips") {
        values[field.id] = [...form.querySelectorAll(`input[name="${field.id}"]:checked`)].map((i) => i.value);
      } else if (field.type === "radio-chips") {
        const checked = form.querySelector(`input[name="${field.id}"]:checked`);
        values[field.id] = checked ? checked.value : "";
      } else {
        const node = form.querySelector(`#input-${field.id}`);
        values[field.id] = node ? node.value.trim() : "";
      }
    }
    return values;
  }

  function validate() {
    const values = getValues();
    let isValid = true;
    for (const field of schema) {
      const wrap = form.querySelector(`[data-field-id="${field.id}"]`);
      if (!wrap) continue;
      let fieldValid = true;
      if (field.required) {
        const v = values[field.id];
        fieldValid = Array.isArray(v) ? v.length > 0 : !!v;
      }
      if (fieldValid && field.validate) {
        fieldValid = field.validate(values[field.id], values);
      }
      wrap.classList.toggle("has-error", !fieldValid);
      if (!fieldValid) isValid = false;
    }
    return isValid;
  }

  return { formEl: form, getValues, validate };
}
