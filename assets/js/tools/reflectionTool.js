/* ============================================
   tools/reflectionTool.js
   Module 5: Reflection and Metacognition → Reflection Tool

   Purpose: generates a prompt that helps a student reflect
   on themselves AS A KNOWER — their own assumptions, how
   their thinking changed, what they'd do differently —
   distinct from analysing an external source or topic.
   ============================================ */

import { TOK_CONCEPT_OPTIONS } from "../data/tokConcepts.js";
import { buildPromptSections } from "../core/toolPage.js";

export const fields = [
  {
    id: "context",
    type: "select",
    label: "What are you reflecting on?",
    placeholder: "Select a context",
    required: true,
    options: [
      { value: "essay", label: "My TOK essay process" },
      { value: "exhibition", label: "My TOK exhibition process" },
      { value: "class-unit", label: "A specific unit or topic studied in class" },
      { value: "personal-knowledge", label: "A personal knowledge experience (e.g. changing my mind about something)" },
    ],
  },
  {
    id: "details",
    type: "textarea",
    label: "Briefly describe what happened",
    placeholder: "e.g. I started my essay convinced that scientific knowledge was more reliable than historical knowledge, but researching primary source corroboration in History made me reconsider...",
    required: true,
    rows: 6,
    maxLength: 1500,
  },
  {
    id: "focusConcept",
    type: "select",
    label: "Focus the reflection on a TOK concept? (optional)",
    placeholder: "No specific concept",
    options: TOK_CONCEPT_OPTIONS,
    allowEmptySubmit: true,
  },
  {
    id: "tone",
    type: "radio-chips",
    label: "Reflection tone",
    defaultValue: "analytical",
    options: [
      { value: "analytical", label: "Analytical and structured" },
      { value: "personal", label: "Personal and exploratory" },
    ],
  },
];

const CONTEXT_FRAMING = {
  essay: "their process of researching and writing a TOK essay",
  exhibition: "their process of selecting objects and writing commentary for a TOK exhibition",
  "class-unit": "a unit or topic they studied in their TOK class",
  "personal-knowledge": "a personal experience of acquiring, questioning, or changing their knowledge about something",
};

export function generate(values) {
  const { context, details, focusConcept, tone } = values;
  const conceptLabel = focusConcept ? TOK_CONCEPT_OPTIONS.find((o) => o.value === focusConcept)?.label : null;

  const roleSection = {
    heading: "ROLE",
    body: `You are a Theory of Knowledge tutor helping a student reflect metacognitively on ${CONTEXT_FRAMING[context]}. The goal is genuine reflection on themselves AS A KNOWER — not a summary of what they did, but an honest account of how their thinking actually moved.`,
  };

  const detailsSection = { heading: "WHAT HAPPENED", body: details };

  const taskLines = [
    "1. Identify the assumption(s) the student started with, stated as precisely as possible — not 'I thought X was true' in general, but the specific, almost-unnoticed assumption underneath that belief.",
    "2. Identify the specific moment, encounter, or piece of evidence that put pressure on that assumption — what exactly challenged it, and how.",
    "3. Describe how the student's thinking actually changed — be precise about what shifted (a belief, a method of judging evidence, a sense of which AOK's standards apply) rather than a vague 'I learned a lot'.",
    "4. Identify one thing that DIDN'T change — a belief or assumption that was tested but held up, or that the student deliberately chose not to revise, and why.",
    "5. Connect this specific experience to a general insight about knowledge or knowing — the kind of insight that would transfer to a different situation entirely.",
  ];

  if (conceptLabel) {
    taskLines.push(`6. Throughout, use the TOK concept of ${conceptLabel} as a lens — show specifically how this concept illuminates what happened in this reflection.`);
  }

  const taskSection = { heading: "YOUR TASK", body: taskLines.join("\n") };

  const styleSection = {
    heading: "STYLE",
    body:
      tone === "personal"
        ? "Write in a personal, exploratory register, as if thinking on the page — first person, willing to sit with uncertainty rather than resolving everything neatly. Avoid sounding like a formal essay."
        : "Write in a clear, structured, analytical register — first person is fine, but each point should be precise and well-organised rather than meandering.",
  };

  const guardSection = {
    heading: "AVOID",
    body: "Avoid generic reflection language like 'this taught me to think outside the box' or 'I now see things from multiple perspectives' unless backed by the specific, concrete detail of what actually happened. Reflection that could apply to any topic is not yet real reflection.",
  };

  const promptText = buildPromptSections([roleSection, detailsSection, taskSection, styleSection, guardSection]);

  const whyItWorks = [
    "Targets the precise underlying assumption, not the general belief — this is what separates genuine metacognition from a restated opinion.",
    "Requires naming what DIDN'T change as well as what did, since real reflection includes deliberate retention, not only revision.",
    "Pushes the specific experience toward a transferable insight, which is exactly the move TOK reflection is meant to develop.",
    "Explicitly bans generic reflection clichés, a near-universal weak pattern in both student and AI-generated reflective writing.",
  ];

  return {
    promptText,
    whyItWorks,
    meta: [
      { label: "Module: Reflection", variant: "module" },
      conceptLabel ? { label: conceptLabel, variant: "kf" } : null,
    ].filter(Boolean),
    filename: "reflection-tool-prompt.txt",
  };
}
