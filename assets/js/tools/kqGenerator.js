/* ============================================
   tools/kqGenerator.js
   Module 2: KQ Development → KQ Generator

   Purpose: generates MULTIPLE candidate Knowledge Questions
   from a topic, situation, or claim — used early in the
   process when a student doesn't yet know which KQ to pursue.
   Distinct from KQ Builder, which refines ONE KQ from a
   specific starting idea.
   ============================================ */

import { AOKS, AOK_OPTIONS } from "../data/aoks.js";
import { TOK_CONCEPT_OPTIONS } from "../data/tokConcepts.js";
import { buildPromptSections } from "../core/toolPage.js";

export const fields = [
  {
    id: "topic",
    type: "textarea",
    label: "What's the topic, situation, or real-world claim?",
    placeholder: "e.g. The use of lie detector tests in criminal trials",
    required: true,
    rows: 4,
    maxLength: 600,
  },
  {
    id: "aoks",
    type: "chips",
    label: "Generate questions relevant to which AOK(s)?",
    hint: "Choose 1–3. Leave blank to let the AI choose the most relevant AOKs itself.",
    options: AOK_OPTIONS,
  },
  {
    id: "quantity",
    type: "radio-chips",
    label: "How many candidate KQs?",
    defaultValue: "5",
    options: [
      { value: "3", label: "3" },
      { value: "5", label: "5" },
      { value: "8", label: "8" },
    ],
  },
  {
    id: "varietyMode",
    type: "radio-chips",
    label: "Variety style",
    defaultValue: "concept-varied",
    options: [
      { value: "concept-varied", label: "Vary by TOK concept" },
      { value: "aok-varied", label: "Vary by AOK" },
      { value: "difficulty-varied", label: "Vary by difficulty/depth" },
    ],
  },
];

export function generate(values) {
  const { topic, aoks, quantity, varietyMode } = values;

  const aokLabels = aoks.length
    ? aoks.map((id) => AOK_OPTIONS.find((o) => o.value === id)?.label).filter(Boolean)
    : null;

  const varietyInstruction = {
    "concept-varied": `Make sure the ${quantity} questions are NOT just rephrasings of each other — each one should foreground a genuinely different TOK concept (for example: drawing from evidence, certainty, perspective, objectivity, power, interpretation — choose whichever fit best, don't force all of them in).`,
    "aok-varied": `Make sure the ${quantity} questions draw on different Areas of Knowledge from each other where possible, so the set shows how the same topic looks different depending on which AOK frames it.`,
    "difficulty-varied": `Order the ${quantity} questions from most accessible/concrete to most abstract/challenging, so the set works as a progression rather than a flat list of equals.`,
  }[varietyMode];

  const roleSection = {
    heading: "ROLE",
    body: "You are a Theory of Knowledge tutor helping a student discover possible Knowledge Questions (KQs) hidden inside a real-world topic. A genuine KQ is a question about knowledge — how something is known, what justifies it, who gets to know it — not a first-order factual or ethical question about the topic itself.",
  };

  const topicSection = {
    heading: "TOPIC",
    body: topic,
  };

  const scopeSection = aokLabels
    ? { heading: "AREAS OF KNOWLEDGE TO DRAW FROM", body: aokLabels.join(", ") }
    : null;

  const taskSection = {
    heading: "YOUR TASK",
    body: [
      `1. Generate exactly ${quantity} candidate Knowledge Questions arising from this topic.`,
      "2. For EACH question, add a one-line note explaining which TOK concept or AOK it draws on most strongly, and why it counts as a genuine KQ rather than a first-order question in disguise.",
      `3. ${varietyInstruction}`,
      "4. After the list, identify which ONE of the questions has the most potential for sustained, interesting analysis — and briefly say why, naming what makes a KQ 'rich' versus merely acceptable.",
    ].join("\n"),
  };

  const formatSection = {
    heading: "FORMAT",
    body: "Present the questions as a numbered list. Keep each KQ to a single sentence. Keep the one-line notes genuinely brief — a phrase, not a paragraph.",
  };

  const promptText = buildPromptSections([roleSection, topicSection, scopeSection, taskSection, formatSection].filter(Boolean));

  const whyItWorks = [
    "Requests a SET of questions with deliberate variety rather than one safe answer, which is what generative exploration actually needs at this early stage.",
    "Forces a one-line justification per question, which doubles as a built-in quality check against disguised first-order questions slipping through.",
    "Asks the AI to rank for analytical richness, not just correctness, surfacing the question most worth pursuing rather than leaving that judgement to chance.",
    "Keeps formatting tight and scannable, so the output is genuinely usable as a working list rather than dense prose to wade through.",
  ];

  return {
    promptText,
    whyItWorks,
    meta: [
      { label: "Module: KQ Development", variant: "module" },
      ...(aokLabels ? aokLabels.slice(0, 2).map((l) => ({ label: l, variant: "aok" })) : []),
    ],
    filename: "kq-generator-prompt.txt",
  };
}
