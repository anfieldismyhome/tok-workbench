/* ============================================
   tools/jargonDetector.js
   Module 6: TOK Language → TOK Jargon Detector

   Purpose: takes a piece of student writing and generates
   a prompt that detects empty, misused, or "TOK-sounding but
   meaningless" jargon — a common problem where students learn
   vocabulary without learning what the words actually do.
   ============================================ */

import { buildPromptSections } from "../core/toolPage.js";

export const fields = [
  {
    id: "writingSample",
    type: "textarea",
    label: "Paste your TOK writing",
    placeholder: "Paste a paragraph or section from your essay, exhibition commentary, or notes...",
    required: true,
    rows: 8,
    maxLength: 3000,
  },
  {
    id: "severity",
    type: "radio-chips",
    label: "How strict should the check be?",
    defaultValue: "strict",
    options: [
      { value: "strict", label: "Strict — flag anything even slightly vague" },
      { value: "moderate", label: "Moderate — flag clear problems only" },
    ],
  },
];

export function generate(values) {
  const { writingSample, severity } = values;

  const roleSection = {
    heading: "ROLE",
    body: "You are a Theory of Knowledge examiner-style critical reader whose specific job is to detect TOK jargon that SOUNDS sophisticated but isn't actually doing any analytical work — phrases that could be deleted without losing meaning, or that are technically misused.",
  };

  const sampleSection = { heading: "STUDENT WRITING", body: writingSample };

  const taskSection = {
    heading: "YOUR TASK",
    body: [
      "1. Go through the writing and identify every instance of TOK vocabulary (e.g. terms like 'perspective', 'objectivity', 'paradigm', 'epistemology', 'subjective truth', 'ways of knowing') being used.",
      "2. For EACH instance, classify it as: (a) PRECISE — the term is doing real analytical work and is used correctly, (b) VAGUE — the term is technically appropriate but used so generally it adds nothing specific, or (c) MISUSED — the term is being used incorrectly or doesn't actually mean what the sentence needs it to mean.",
      "3. For every VAGUE or MISUSED instance, rewrite that specific sentence to either use the term precisely or replace it with plainer language that says something more specific.",
      "4. Identify any sentence that COULD be deleted entirely without losing any actual content — a sign of jargon functioning as padding rather than argument.",
      "5. Give an overall verdict: is this writing using TOK vocabulary to think, or to perform the appearance of thinking? Be honest, not diplomatic.",
    ].join("\n"),
  };

  const styleSection = {
    heading: "STYLE",
    body:
      severity === "strict"
        ? "Be strict: flag anything that is even slightly vague or generic, including phrases that would pass a casual read but don't hold up to scrutiny. Err on the side of flagging too much rather than too little."
        : "Focus on clear, significant problems rather than minor stylistic quibbles — flag what would actually cost marks or weaken the argument, not every imperfect phrase.",
  };

  const promptText = buildPromptSections([roleSection, sampleSection, taskSection, styleSection]);

  const whyItWorks = [
    "Uses a three-way classification (precise/vague/misused) instead of a binary good/bad judgement, which produces much more actionable, specific feedback.",
    "Demands an actual rewrite for every flagged instance, turning critique directly into a fix rather than leaving the student to guess at one.",
    "Tests for deletable sentences specifically — a sharp, concrete test for padding that's hard to dodge with surface-level polish.",
    "Asks for a direct, undiplomatic verdict rather than a softened one — this is where AI feedback tends to default to reassurance, and an explicit instruction is needed to counter that.",
  ];

  return {
    promptText,
    whyItWorks,
    meta: [{ label: "Module: TOK Language", variant: "module" }],
    filename: "jargon-detector-prompt.txt",
  };
}
