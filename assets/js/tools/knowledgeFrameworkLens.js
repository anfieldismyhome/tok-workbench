/* ============================================
   tools/knowledgeFrameworkLens.js
   Module 1: Source Analysis → Knowledge Framework Lens

   Purpose: applies one or more of the four Knowledge
   Framework elements (Scope, Perspectives, Methods and
   Tools, Ethics) to any topic, AOK, or theme the student
   names — a generalist tool for whenever a student needs
   to "run the Framework" on something.
   ============================================ */

import { AOK_OPTIONS, getAokById } from "../data/aoks.js";
import { KNOWLEDGE_FRAMEWORK } from "../data/knowledgeFramework.js";
import { buildPromptSections } from "../core/toolPage.js";

export const fields = [
  {
    id: "topic",
    type: "text",
    label: "Topic, theme, or AOK to examine",
    placeholder: "e.g. The use of AI in medical diagnosis",
    hint: "Can be broad (an AOK) or specific (a real situation, theme, or debate).",
    required: true,
  },
  {
    id: "aokContext",
    type: "select",
    label: "Frame this within a specific Area of Knowledge?",
    placeholder: "No specific AOK — keep it general",
    options: AOK_OPTIONS,
    allowEmptySubmit: true,
  },
  {
    id: "elements",
    type: "chips",
    label: "Which Knowledge Framework elements to apply",
    hint: "Choose at least one. Selecting all four gives a complete framework analysis.",
    required: true,
    options: KNOWLEDGE_FRAMEWORK.map((f) => ({ value: f.id, label: f.name })),
  },
];

export function generate(values) {
  const { topic, aokContext, elements } = values;
  const aokData = aokContext ? getAokById(aokContext) : null;

  const chosenElements = KNOWLEDGE_FRAMEWORK.filter((f) => elements.includes(f.id));

  const roleSection = {
    heading: "ROLE",
    body: "You are a Theory of Knowledge tutor applying the official TOK Knowledge Framework to a topic the student has chosen. Use the Framework as an analytical tool, not a checklist to tick off — each element should generate genuine insight, not a restatement of its definition.",
  };

  const topicSection = {
    heading: "TOPIC",
    body: aokData
      ? `${topic}\n\nFrame this specifically within ${aokData.name} as the Area of Knowledge.`
      : topic,
  };

  const elementBlocks = chosenElements
    .map((el, i) => {
      const qs = el.guidingQuestions.map((q) => `   - ${q}`).join("\n");
      return `${i + 1}. ${el.name}\n${qs}`;
    })
    .join("\n\n");

  const taskSection = {
    heading: "YOUR TASK",
    body: `For the topic above, work through each Knowledge Framework element below. For each one, don't just answer the guiding questions in sequence — select the ONE or TWO that are most illuminating for this specific topic, and develop a real analytical point from them. Skip or briefly note any question that doesn't meaningfully apply rather than forcing an answer.\n\n${elementBlocks}`,
  };

  const closeSection = {
    heading: "TO CLOSE",
    body: "Identify which single Knowledge Framework element produced the most interesting insight for this topic, and explain briefly why that element matters more here than the others.",
  };

  const promptText = buildPromptSections([roleSection, topicSection, taskSection, closeSection]);

  const whyItWorks = [
    "Explicitly warns against treating the Framework as a checklist — the single most common way students flatten the Framework into mechanical, low-value writing.",
    "Asks the AI to select the most illuminating questions rather than answering all of them mechanically, producing depth over coverage.",
    "Permits skipping questions that don't apply, which models honest analytical judgement rather than forced relevance.",
    "Ends by asking which element mattered most — pushes towards a thesis-like judgement rather than a flat four-part list, useful scaffolding for both essays and exhibitions.",
  ];

  return {
    promptText,
    whyItWorks,
    meta: [
      { label: "Module: Source Analysis", variant: "module" },
      { label: "Knowledge Framework", variant: "kf" },
      aokData ? { label: aokData.name, variant: "aok" } : null,
    ].filter(Boolean),
    filename: "knowledge-framework-lens-prompt.txt",
  };
}
