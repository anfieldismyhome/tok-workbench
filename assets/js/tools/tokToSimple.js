/* ============================================
   tools/tokToSimple.js
   Module 6: TOK Language → TOK to Simple Language

   Purpose: takes dense TOK writing (the student's own, or
   a textbook/Guide excerpt they're struggling with) and
   generates a prompt that explains it in plain English
   without losing the actual meaning — a comprehension aid,
   not a dumbing-down.
   ============================================ */

import { buildPromptSections } from "../core/toolPage.js";

export const fields = [
  {
    id: "denseText",
    type: "textarea",
    label: "Paste the dense TOK text you want explained simply",
    placeholder: "Paste a sentence, paragraph, or definition you're struggling to fully understand...",
    required: true,
    rows: 6,
    maxLength: 2000,
  },
  {
    id: "audienceLevel",
    type: "radio-chips",
    label: "Explain it for...",
    defaultValue: "peer",
    options: [
      { value: "younger", label: "A younger student (e.g. Grade 9)" },
      { value: "peer", label: "A TOK classmate who's a bit lost" },
      { value: "non-ib", label: "Someone outside the IB entirely" },
    ],
  },
];

const AUDIENCE_INSTRUCTION = {
  younger: "Explain this as if to a capable Grade 9 student who has never taken TOK — use concrete, everyday examples and avoid assuming any prior TOK vocabulary.",
  peer: "Explain this as if to a TOK classmate who has heard the vocabulary in class but hasn't fully grasped what it means yet — you can assume basic familiarity with terms like 'knowledge question' but not much more.",
  "non-ib": "Explain this as if to an intelligent adult who has never heard of the IB or TOK — avoid IB-specific jargon entirely and use only general, everyday language and examples.",
};

export function generate(values) {
  const { denseText, audienceLevel } = values;

  const roleSection = {
    heading: "ROLE",
    body: "You are a Theory of Knowledge tutor whose specific skill is explaining dense academic language clearly WITHOUT losing precision or accuracy. Simplifying is not the same as dumbing down — the explanation must still be correct.",
  };

  const textSection = { heading: "DENSE TEXT TO EXPLAIN", body: denseText };

  const taskSection = {
    heading: "YOUR TASK",
    body: [
      `1. ${AUDIENCE_INSTRUCTION[audienceLevel]}`,
      "2. Use a concrete, everyday example or analogy to make the abstract idea tangible — something the reader could picture, not just another abstract restatement.",
      "3. Identify which word(s) in the original text are doing the most technical work, and explain specifically what they mean — don't just substitute a simpler synonym; show what's actually being claimed.",
      "4. After the plain-language explanation, give the ORIGINAL technical sentence again, so the reader can see exactly how the simple explanation maps back onto the precise TOK language.",
      "5. Flag if anything is genuinely lost or simplified away in translation — be honest about where the plain version is slightly less precise than the original.",
    ].join("\n"),
  };

  const styleSection = {
    heading: "STYLE",
    body: "Short sentences. No jargon introduced without immediate explanation. Prioritise being understood over sounding sophisticated.",
  };

  const promptText = buildPromptSections([roleSection, textSection, taskSection, styleSection]);

  const whyItWorks = [
    "Explicitly separates simplifying from dumbing down — the instruction protects accuracy while still demanding real clarity.",
    "Requires a concrete example, not just a plainer restatement, which is what actually builds understanding rather than substituting one abstraction for another.",
    "Maps the simple explanation back onto the original technical sentence, helping the student eventually use the precise language themselves instead of staying dependent on the simplified version.",
    "Asks the AI to admit what's lost in translation, modelling honest epistemic humility rather than presenting the simplification as a perfect equivalent.",
  ];

  return {
    promptText,
    whyItWorks,
    meta: [{ label: "Module: TOK Language", variant: "module" }],
    filename: "tok-to-simple-prompt.txt",
  };
}
