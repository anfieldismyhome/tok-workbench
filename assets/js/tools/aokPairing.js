/* ============================================
   tools/aokPairing.js
   Module 3: Essay Development → AoK Pairing Analysis

   Purpose: once two AOKs are already chosen, this tool
   generates a prompt that explores the productive tension
   between them specifically for the prescribed title —
   distinct from AoK Compatibility Analysis, which helps
   CHOOSE the AOKs in the first place.
   ============================================ */

import { AOK_OPTIONS, getAokById } from "../data/aoks.js";
import { buildPromptSections } from "../core/toolPage.js";

export const fields = [
  {
    id: "title",
    type: "textarea",
    label: "Prescribed title (or its core claim/question)",
    placeholder: "e.g. \"Disagreement is a weakness in the production of knowledge.\" Discuss.",
    required: true,
    rows: 4,
    maxLength: 500,
  },
  {
    id: "aokOne",
    type: "select",
    label: "First Area of Knowledge",
    placeholder: "Select an AOK",
    required: true,
    options: AOK_OPTIONS,
  },
  {
    id: "aokTwo",
    type: "select",
    label: "Second Area of Knowledge",
    placeholder: "Select an AOK",
    required: true,
    options: AOK_OPTIONS,
  },
  {
    id: "relationshipFocus",
    type: "radio-chips",
    label: "What kind of relationship are you hoping to explore?",
    defaultValue: "unsure",
    options: [
      { value: "contrast", label: "Sharp contrast / disagreement" },
      { value: "convergence", label: "Surprising convergence" },
      { value: "unsure", label: "Not sure yet — explore both" },
    ],
  },
];

export function generate(values) {
  const { title, aokOne, aokTwo, relationshipFocus } = values;
  const aokAData = getAokById(aokOne);
  const aokBData = getAokById(aokTwo);

  if (aokOne === aokTwo) {
    return {
      promptText: "Please select two different Areas of Knowledge to compare — this tool is built specifically for exploring the relationship between two distinct AOKs.",
      whyItWorks: [],
      meta: [{ label: "Module: Essay Development", variant: "module" }],
      filename: "aok-pairing-prompt.txt",
    };
  }

  const roleSection = {
    heading: "ROLE",
    body: "You are a Theory of Knowledge essay supervisor helping a student develop a genuine, specific comparison between two Areas of Knowledge for a prescribed title — not two separate mini-essays placed side by side.",
  };

  const titleSection = { heading: "PRESCRIBED TITLE", body: `"${title}"` };

  const aokSection = {
    heading: "AREAS OF KNOWLEDGE BEING PAIRED",
    body: `A. ${aokAData.name} — typical methods: ${aokAData.methods.join(", ")}\nB. ${aokBData.name} — typical methods: ${aokBData.methods.join(", ")}`,
  };

  const focusInstruction = {
    contrast: `Focus primarily on where ${aokAData.name} and ${aokBData.name} genuinely DISAGREE or pull in different directions on this title — push for a sharp, specific contrast rather than a soft 'both have value' conclusion.`,
    convergence: `Focus primarily on where ${aokAData.name} and ${aokBData.name} unexpectedly CONVERGE or support a similar conclusion on this title, even though they use very different methods to get there.`,
    unsure: `Explore both directions: identify at least one point of genuine convergence and one point of genuine, sharp disagreement between ${aokAData.name} and ${aokBData.name} on this title.`,
  }[relationshipFocus];

  const taskSection = {
    heading: "YOUR TASK",
    body: [
      `1. ${focusInstruction}`,
      "2. For each point of comparison, ground it in a SPECIFIC method, standard of justification, or real example from each AOK — not a generic statement like 'science uses evidence and the arts use interpretation'.",
      "3. Explain what the comparison itself reveals about the title's underlying claim — the point of pairing two AOKs is to generate insight neither one produces alone. State that insight directly.",
      "4. Identify the strongest objection a reader might raise against your comparison (e.g. 'these AOKs aren't really comparable on this point'), and respond to it.",
      "5. Suggest one sentence that could function as a thesis statement, capturing what this AOK pairing shows about the title overall.",
    ].join("\n"),
  };

  const promptText = buildPromptSections([roleSection, titleSection, aokSection, taskSection]);

  const whyItWorks = [
    "Names the exact failure mode this tool exists to prevent — two parallel mini-essays instead of a real comparison — directly in the role instruction.",
    "Forces grounding in specific methods or examples per AOK, preventing comparisons that stay at the level of vague AOK stereotypes.",
    "Explicitly asks what the COMPARISON reveals, not just what each AOK says — this is the actual analytical payoff examiners look for in paired-AOK essays.",
    "Includes a self-objection step, modelling the kind of counter-consideration that strengthens an essay's argument rather than leaving it one-sided.",
    "Ends with a thesis-sentence draft, giving the student something concrete to build the essay's argument around.",
  ];

  return {
    promptText,
    whyItWorks,
    meta: [
      { label: "Module: Essay Development", variant: "module" },
      { label: aokAData.name, variant: "aok" },
      { label: aokBData.name, variant: "aok" },
    ],
    filename: "aok-pairing-prompt.txt",
  };
}
