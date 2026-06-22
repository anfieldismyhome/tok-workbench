/* ============================================
   tools/objectAnalysisTool.js
   Module 4: Exhibition Development → Object Analysis Tool

   Purpose: once a student has a SPECIFIC real-world object
   and their IA prompt, this generates a prompt that produces
   rigorous, specific commentary connecting the two — the
   core writing task of the exhibition commentary itself.
   ============================================ */

import { IA_PROMPT_OPTIONS } from "../data/iaPrompts.js";
import { buildPromptSections } from "../core/toolPage.js";

export const fields = [
  {
    id: "iaPrompt",
    type: "select",
    label: "Your IA prompt",
    placeholder: "Choose your IA prompt",
    required: true,
    options: IA_PROMPT_OPTIONS,
  },
  {
    id: "objectDescription",
    type: "textarea",
    label: "Describe your specific real-world object",
    placeholder: "e.g. My grandfather's 1962 medical textbook, with his handwritten annotations in the margins disagreeing with some of the now-outdated treatments described.",
    hint: "Be as specific as possible — a real, particular object, not a generic category. 'A textbook' is generic; 'my grandfather's annotated 1962 textbook' is specific.",
    required: true,
    rows: 5,
    maxLength: 1200,
  },
  {
    id: "personalConnection",
    type: "textarea",
    label: "Why did you choose this object? (optional, but strengthens the commentary)",
    placeholder: "e.g. I found it while clearing out his study after he passed, and noticed how confidently wrong some of his certainties turned out to be.",
    rows: 3,
    maxLength: 600,
  },
  {
    id: "wordTarget",
    type: "radio-chips",
    label: "Approximate length for this object's commentary",
    defaultValue: "300",
    options: [
      { value: "250", label: "~250 words" },
      { value: "300", label: "~300 words (typical for 1 of 3 objects)" },
      { value: "350", label: "~350 words" },
    ],
  },
];

export function generate(values) {
  const { iaPrompt, objectDescription, personalConnection, wordTarget } = values;

  const roleSection = {
    heading: "ROLE",
    body: "You are a Theory of Knowledge teacher helping a student draft commentary for ONE object in their TOK Exhibition. The commentary must make a specific, well-justified link between this exact object and the IA prompt — generic or vague gestures toward the topic will not meet the standard required.",
  };

  const promptSection = { heading: "IA PROMPT (must be used exactly as worded)", body: iaPrompt };
  const objectSection = { heading: "THE OBJECT", body: objectDescription };
  const connectionSection = personalConnection
    ? { heading: "WHY THIS OBJECT WAS CHOSEN", body: personalConnection }
    : null;

  const taskSection = {
    heading: "YOUR TASK",
    body: [
      "1. State the real-world context of this object precisely: what it is, where it comes from, and why that specific context matters (not just what kind of thing it is in general).",
      `2. Explain explicitly HOW this object connects to the IA prompt above. The connection must be load-bearing — show the prompt's actual key terms doing work in your explanation, not just a loose thematic gesture.`,
      "3. Make one TOK-specific point this object illustrates — referencing a relevant TOK concept, Area of Knowledge, or element of the Knowledge Framework where appropriate, grounded in this object's specific features.",
      "4. Anticipate the most obvious objection an examiner might raise about this object-prompt link (e.g. 'this connection feels generic' or 'this could apply to almost any object') and address it directly by pointing to something irreducibly specific about this object.",
      `5. Draft the commentary itself at approximately ${wordTarget} words — descriptive but analytical throughout; avoid spending words on storytelling that doesn't serve the argument.`,
    ].join("\n"),
  };

  const constraintsSection = {
    heading: "CONSTRAINTS",
    body: "This commentary is one of three objects in a 950-word exhibition total, so do not let it run long. Avoid introduction/conclusion framing — examiners have noted the exhibition is not a mini-essay and does not need one. Get directly into the object and its connection to the prompt.",
  };

  const promptText = buildPromptSections([roleSection, promptSection, objectSection, connectionSection, taskSection, constraintsSection].filter(Boolean));

  const whyItWorks = [
    "Demands the connection be 'load-bearing', explicitly naming the failure mode examiners penalise most — vague, generic links between object and prompt.",
    "Requires anticipating the 'this is too generic' objection directly, forcing specificity to be defended rather than assumed.",
    "Sets a concrete word target reflecting the exhibition's tight 950-word total across three objects, so the draft is usable as-is rather than needing heavy cutting.",
    "Explicitly removes introduction/conclusion framing, matching official guidance that the exhibition is not structured like a mini-essay.",
  ];

  return {
    promptText,
    whyItWorks,
    meta: [{ label: "Module: Exhibition Development", variant: "module" }],
    filename: "object-analysis-prompt.txt",
  };
}
