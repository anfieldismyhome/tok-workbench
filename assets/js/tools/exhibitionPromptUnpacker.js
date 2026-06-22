/* ============================================
   tools/exhibitionPromptUnpacker.js
   Module 4: Exhibition Development → Exhibition Prompt Unpacker

   Purpose: takes one of the 35 official IA prompts and
   generates a prompt that unpacks it into a working plan —
   key terms, what it's really asking, and which themes it
   connects to — before any object selection happens.
   ============================================ */

import { IA_PROMPT_OPTIONS } from "../data/iaPrompts.js";
import { ADVANCED_THEME_OPTIONS, getThemeById } from "../data/advancedThemes.js";
import { buildPromptSections } from "../core/toolPage.js";

export const fields = [
  {
    id: "iaPrompt",
    type: "select",
    label: "Select your IA prompt",
    placeholder: "Choose one of the 35 IA prompts",
    required: true,
    options: IA_PROMPT_OPTIONS,
  },
  {
    id: "theme",
    type: "select",
    label: "Optional theme you're working within (if your school uses one)",
    placeholder: "Core theme only (Knowledge and the Knower)",
    options: ADVANCED_THEME_OPTIONS,
    allowEmptySubmit: true,
    hint: "Leave blank if you're working from the core theme rather than an optional theme.",
  },
  {
    id: "stuckPoint",
    type: "radio-chips",
    label: "Where do you need the most help?",
    defaultValue: "understanding",
    options: [
      { value: "understanding", label: "Understanding what it's really asking" },
      { value: "narrowing", label: "Narrowing it down to a workable angle" },
      { value: "both", label: "Both" },
    ],
  },
];

export function generate(values) {
  const { iaPrompt, theme, stuckPoint } = values;
  const themeData = theme ? getThemeById(theme) : null;

  const roleSection = {
    heading: "ROLE",
    body: "You are a Theory of Knowledge teacher helping a student unpack their chosen IA prompt before they select objects for their Exhibition. The prompt must be used exactly as worded in the final exhibition — your job now is purely to help the student understand and narrow it, not to reword it.",
  };

  const promptSection = { heading: "CHOSEN IA PROMPT (use exactly as worded)", body: iaPrompt };

  const themeSection = themeData
    ? { heading: "OPTIONAL THEME", body: `${themeData.name}: ${themeData.shortDesc}` }
    : { heading: "THEME", body: "Working from the TOK core theme, Knowledge and the Knower (no optional theme specified)." };

  const taskLines = [];

  if (stuckPoint === "understanding" || stuckPoint === "both") {
    taskLines.push(
      "1. Identify the key term(s) in this prompt that need a working definition before it can be answered — explain why each is doing real work in the question, not just decoration.",
      "2. Rephrase the prompt in plain language to confirm what it's really asking, without losing its precision.",
      "3. Identify what kind of answer this prompt is fishing for — is it asking for a YES/NO judgement with nuance, an exploration of a relationship, a description of constraints, or something else? Be specific."
    );
  }

  if (stuckPoint === "narrowing" || stuckPoint === "both") {
    taskLines.push(
      `${taskLines.length + 1}. Suggest 3 distinct, narrower ANGLES on this prompt — specific ways into it that would each lead to a different kind of exhibition, so the student isn't trying to cover the whole abstract question at once.`,
      `${taskLines.length + 2}. For each angle, suggest the KIND of real-world object (not a specific object yet) that would naturally fit — e.g. a personal artefact, a media example, a tool or instrument, a document.`
    );
  }

  taskLines.push(
    `${taskLines.length + 1}. Flag the most common way students misjudge this particular prompt — e.g. answering a different, easier question than the one actually asked, or picking objects that only loosely connect.`
  );

  const taskSection = { heading: "YOUR TASK", body: taskLines.join("\n") };

  const guardrailSection = {
    heading: "IMPORTANT",
    body: "Do not suggest specific real-world objects yet — that comes later. This step is about understanding and narrowing the prompt itself. Do not suggest rewording the prompt; it must be used exactly as given.",
  };

  const promptText = buildPromptSections([roleSection, promptSection, themeSection, taskSection, guardrailSection]);

  const whyItWorks = [
    "Explicitly protects the prompt's exact wording — a hard IB requirement — by instructing the AI not to suggest rewording it.",
    "Separates prompt-understanding from object-selection, preventing the common rush to objects before the prompt itself is properly understood.",
    "Asks for distinct narrower angles rather than one generic interpretation, giving the student real choices rather than a single forced direction.",
    "Names the most common misjudgement for the specific prompt chosen, functioning as an early warning rather than feedback after work is already done.",
  ];

  return {
    promptText,
    whyItWorks,
    meta: [
      { label: "Module: Exhibition Development", variant: "module" },
      themeData ? { label: themeData.name, variant: "module" } : null,
    ].filter(Boolean),
    filename: "exhibition-prompt-unpacker-prompt.txt",
  };
}
