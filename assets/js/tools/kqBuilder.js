/* ============================================
   tools/kqBuilder.js
   Module 2: KQ Development → KQ Builder

   Purpose: takes a rough idea/topic + an AOK/concept pairing
   the student already has in mind, and generates a prompt
   that builds ONE well-formed Knowledge Question from it —
   contrasted with the KQ Generator, which produces MANY
   candidates from a looser starting point.
   ============================================ */

import { AOK_OPTIONS, getAokById } from "../data/aoks.js";
import { TOK_CONCEPT_OPTIONS } from "../data/tokConcepts.js";
import { buildPromptSections } from "../core/toolPage.js";

export const fields = [
  {
    id: "roughIdea",
    type: "textarea",
    label: "What's the rough idea or observation you're starting from?",
    placeholder: "e.g. I noticed that historians often disagree about the same evidence...",
    hint: "Doesn't need to be a question yet — a hunch, an observation, or a half-formed thought is fine.",
    required: true,
    rows: 4,
    maxLength: 600,
  },
  {
    id: "aok",
    type: "select",
    label: "Anchor AOK (optional)",
    placeholder: "No specific AOK",
    options: AOK_OPTIONS,
    allowEmptySubmit: true,
  },
  {
    id: "concept",
    type: "select",
    label: "Anchor TOK concept (optional)",
    placeholder: "No specific concept",
    options: TOK_CONCEPT_OPTIONS,
    allowEmptySubmit: true,
  },
  {
    id: "generality",
    type: "radio-chips",
    label: "How general should the final KQ be?",
    defaultValue: "balanced",
    options: [
      { value: "general", label: "Very general (applies across many AOKs)" },
      { value: "balanced", label: "Balanced" },
      { value: "specific", label: "Closer to the original topic" },
    ],
  },
];

function generalityInstruction(generality) {
  switch (generality) {
    case "general":
      return "Push hard for generality: the final KQ should be phrased so abstractly that it could plausibly apply to several different Areas of Knowledge, not just the one it was inspired by.";
    case "specific":
      return "Keep the KQ closer to its origin: it should still be a genuine Knowledge Question (about knowledge, not about the world directly), but it doesn't need to be maximally abstract.";
    default:
      return "Aim for a balanced level of generality: abstract enough to be a real Knowledge Question, but not so abstract that it loses connection to the original idea.";
  }
}

export function generate(values) {
  const { roughIdea, aok, concept, generality } = values;
  const aokData = aok ? getAokById(aok) : null;
  const conceptLabel = concept ? TOK_CONCEPT_OPTIONS.find((o) => o.value === concept)?.label : null;

  const roleSection = {
    heading: "ROLE",
    body: "You are a Theory of Knowledge tutor helping a student turn a rough idea into one well-formed Knowledge Question (KQ). A genuine KQ is a question ABOUT KNOWLEDGE — about how we know, what justifies a claim, the role of a knower — not a first-order question about the world itself.",
  };

  const ideaSection = {
    heading: "STARTING IDEA",
    body: roughIdea,
  };

  const constraints = [];
  if (aokData) constraints.push(`Anchor the KQ in ${aokData.name} as the Area of Knowledge.`);
  if (conceptLabel) constraints.push(`The KQ should explicitly engage with the TOK concept of ${conceptLabel}.`);
  constraints.push(generalityInstruction(generality));

  const constraintsSection = {
    heading: "CONSTRAINTS",
    body: constraints.map((c) => `- ${c}`).join("\n"),
  };

  const taskSection = {
    heading: "YOUR TASK",
    body: [
      "1. First, rewrite the starting idea as a first-order question about the world (this is NOT yet a Knowledge Question — it's the everyday question the idea suggests).",
      "2. Then show the conversion step explicitly: explain what has to change for that first-order question to become a genuine Knowledge Question.",
      "3. Produce ONE final, polished Knowledge Question that meets the constraints above.",
      "4. Test your own KQ: explain briefly why it qualifies as a real KQ (open, about knowledge, not answerable with a simple yes/no or a fact-lookup) rather than a disguised first-order question.",
      "5. Suggest one way the KQ could be made even sharper or more provocative, without changing its core focus.",
    ].join("\n"),
  };

  const promptText = buildPromptSections([roleSection, ideaSection, constraintsSection, taskSection]);

  const whyItWorks = [
    "Makes the first-order-to-Knowledge-Question conversion explicit and visible, which is exactly the step students skip when KQs come out sounding like regular questions.",
    "Requires the AI to test its own output against the definition of a real KQ, catching the common failure mode of producing a fact-question dressed up in TOK vocabulary.",
    "Builds in a generality dial so the KQ's abstraction level matches what the student actually needs for an essay versus an exhibition versus discussion.",
    "Ends with a sharpening step rather than stopping at 'good enough', pushing toward the kind of provocative KQ that produces strong analysis.",
  ];

  return {
    promptText,
    whyItWorks,
    meta: [
      { label: "Module: KQ Development", variant: "module" },
      aokData ? { label: aokData.name, variant: "aok" } : null,
    ].filter(Boolean),
    filename: "kq-builder-prompt.txt",
  };
}
