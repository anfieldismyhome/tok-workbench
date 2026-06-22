/* ============================================
   core/toolPage.js
   The single glue function every tool page calls.
   A tool only needs to supply a config object:
   {
     fields: [...],          // field schema (see formRenderer.js)
     generate: (values) => ({ promptText, whyItWorks, meta, filename }),
     formContainerId, outputContainerId, generateBtnId, resetBtnId
   }
   This keeps every tool's logic declarative and isolated,
   so adding tool #17 means writing a config, not new plumbing.
   ============================================ */

import { renderForm } from "./formRenderer.js";
import { renderEmptyState, renderResult } from "./outputPanel.js";

export function initToolPage(config) {
  const {
    fields,
    generate,
    formContainerId = "tool-form",
    outputContainerId = "tool-output",
    generateBtnId = "generate-btn",
    resetBtnId = "reset-btn",
    emptyStateMessage,
    emptyStateIcon,
  } = config;

  const formContainer = document.getElementById(formContainerId);
  const outputContainer = document.getElementById(outputContainerId);
  if (!formContainer || !outputContainer) {
    console.error("toolPage.js: form or output container not found in DOM.");
    return;
  }

  const { getValues, validate } = renderForm(formContainer, fields);
  renderEmptyState(outputContainer, { icon: emptyStateIcon, message: emptyStateMessage });

  function handleGenerate() {
    if (!validate()) {
      const firstError = formContainer.querySelector(".has-error input, .has-error textarea, .has-error select");
      if (firstError) firstError.focus();
      return;
    }
    const values = getValues();
    let result;
    try {
      result = generate(values);
    } catch (err) {
      console.error("Prompt generation failed:", err);
      renderEmptyState(outputContainer, {
        icon: "⚠",
        message: "Something went wrong generating this prompt. Please check your inputs and try again.",
      });
      return;
    }
    renderResult(outputContainer, result);
    if (window.matchMedia("(max-width: 920px)").matches) {
      outputContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleReset() {
    formContainer.querySelector("form")?.reset();
    formContainer.querySelectorAll(".has-error").forEach((f) => f.classList.remove("has-error"));
    renderEmptyState(outputContainer, { icon: emptyStateIcon, message: emptyStateMessage });
  }

  const generateBtn = document.getElementById(generateBtnId);
  const resetBtn = document.getElementById(resetBtnId);
  if (generateBtn) generateBtn.addEventListener("click", handleGenerate);
  if (resetBtn) resetBtn.addEventListener("click", handleReset);

  // Allow Enter-to-submit on single-line inputs without breaking textareas.
  formContainer.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.tagName === "INPUT") {
      e.preventDefault();
      handleGenerate();
    }
  });

  return { handleGenerate, handleReset, getValues, validate };
}

/**
 * Small helper used by tool generate() functions to assemble a clean,
 * consistently-formatted prompt out of labelled sections. Keeps every
 * tool's template code readable instead of one giant string.
 */
export function buildPromptSections(sections) {
  return sections
    .filter((s) => s && s.body)
    .map((s) => (s.heading ? `${s.heading}\n${s.body}` : s.body))
    .join("\n\n");
}
