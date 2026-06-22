/* ============================================
   tools/vocabularyTranslator.js
   Module 6: TOK Language → TOK Vocabulary Translator

   Purpose: takes an everyday idea a student wants to express
   and generates a prompt that finds the precise TOK term(s)
   for it, with usage guidance — moving from "what I mean" to
   "the word TOK actually uses for this".
   ============================================ */

import { buildPromptSections } from "../core/toolPage.js";

export const fields = [
  {
    id: "everydayIdea",
    type: "textarea",
    label: "What's the everyday idea you're trying to express?",
    placeholder: "e.g. The idea that what counts as 'normal' depends on where you grew up",
    required: true,
    rows: 4,
    maxLength: 600,
  },
  {
    id: "context",
    type: "text",
    label: "What are you writing? (optional, helps calibrate precision)",
    placeholder: "e.g. A paragraph in my TOK essay about Human Sciences",
  },
];

export function generate(values) {
  const { everydayIdea, context } = values;

  const roleSection = {
    heading: "ROLE",
    body: "You are a Theory of Knowledge tutor helping a student find the precise TOK vocabulary for an idea they already understand intuitively but can't yet name with the course's technical language.",
  };

  const ideaSection = { heading: "THE IDEA, IN EVERYDAY WORDS", body: everydayIdea };
  const contextSection = context ? { heading: "WHERE THIS WILL BE USED", body: context } : null;

  const taskSection = {
    heading: "YOUR TASK",
    body: [
      "1. Identify the precise TOK term(s) or concept(s) that best capture this idea (e.g. from the TOK concepts list: perspective, culture, objectivity, justification, and so on, or relevant Knowledge Framework language).",
      "2. For each term suggested, explain in one sentence why it fits better than a more obvious but less precise word choice.",
      "3. Write ONE example sentence using the term correctly in a TOK-appropriate register, directly adapted from the student's original idea.",
      "4. Note any term that might seem to fit but is actually a common MISUSE for this idea, so the student can avoid the trap.",
    ].join("\n"),
  };

  const styleSection = {
    heading: "STYLE",
    body: "Be concise — this is a vocabulary lookup, not an essay. Prioritise precision and correct usage over exhaustive coverage.",
  };

  const promptText = buildPromptSections([roleSection, ideaSection, contextSection, taskSection, styleSection].filter(Boolean));

  const whyItWorks = [
    "Asks WHY a term fits, not just which term to use — building the student's own judgement rather than creating dependency on lookups.",
    "Requires one example sentence directly adapted from the student's own idea, so the output is immediately usable rather than abstract definition-reciting.",
    "Flags common misuse explicitly, preventing the frequent error of grabbing a TOK-sounding word that's technically wrong for the context.",
    "Keeps the output short and scannable, matching the actual task of a quick vocabulary check mid-writing.",
  ];

  return {
    promptText,
    whyItWorks,
    meta: [{ label: "Module: TOK Language", variant: "module" }],
    filename: "vocabulary-translator-prompt.txt",
  };
}
