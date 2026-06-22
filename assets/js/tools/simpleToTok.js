/* ============================================
   tools/simpleToTok.js
   Module 6: TOK Language → Simple Language to TOK

   Purpose: the inverse of TOK to Simple Language — takes an
   everyday observation or argument a student has in plain
   English and generates a prompt that upgrades it into
   precise TOK register, suitable for essay or exhibition use.
   ============================================ */

import { buildPromptSections } from "../core/toolPage.js";

export const fields = [
  {
    id: "simpleIdea",
    type: "textarea",
    label: "Write your idea in plain, everyday language",
    placeholder: "e.g. I think people believe stuff more if a scientist says it, even if a regular person says the exact same thing.",
    hint: "Don't worry about sounding academic here — write it the way you'd actually say it out loud.",
    required: true,
    rows: 5,
    maxLength: 1000,
  },
  {
    id: "targetUse",
    type: "radio-chips",
    label: "What's this for?",
    defaultValue: "essay-sentence",
    options: [
      { value: "essay-sentence", label: "A sentence in my essay" },
      { value: "exhibition-commentary", label: "Exhibition commentary" },
      { value: "discussion-comment", label: "A point to raise in class discussion" },
    ],
  },
];

export function generate(values) {
  const { simpleIdea, targetUse } = values;

  const roleSection = {
    heading: "ROLE",
    body: "You are a Theory of Knowledge tutor helping a student upgrade a plain-language idea into precise TOK register — without making it sound inflated, vague, or like AI-generated filler. The upgraded version should say MORE precisely what the student means, not just sound fancier.",
  };

  const ideaSection = { heading: "STUDENT'S IDEA, IN PLAIN LANGUAGE", body: simpleIdea };

  const taskSection = {
    heading: "YOUR TASK",
    body: [
      "1. Identify the TOK concept(s) this idea is actually about, even though the student hasn't named them (e.g. authority as a form of justification, the role of expertise, objectivity).",
      "2. Rewrite the idea in precise TOK register — using accurate technical vocabulary, but keeping every word doing real work. No padding, no inflated phrasing that doesn't add meaning.",
      "3. Provide TWO versions at different levels of formality: one as a single strong sentence, and one as a short developed paragraph (2-3 sentences) that could be inserted directly into written work.",
      "4. Check the upgraded version against the original: confirm nothing has been added that the student didn't actually mean, and nothing essential has been lost.",
      "5. Suggest one way to make the point even sharper by connecting it to a specific Area of Knowledge or a real-world example.",
    ].join("\n"),
  };

  const targetInstruction = {
    "essay-sentence": "This will be used as a sentence within a formal TOK essay — match that register: precise, third-person or reflective first-person as appropriate, no contractions.",
    "exhibition-commentary": "This will be used in exhibition commentary — register should be analytical and precise but can be slightly more direct/personal than essay prose, since exhibition commentary often connects to a specific chosen object.",
    "discussion-comment": "This will be spoken aloud in class discussion — keep it natural to say out loud while still using accurate TOK vocabulary; avoid anything that would sound stilted if spoken.",
  }[targetUse];

  const contextSection = { heading: "REGISTER TARGET", body: targetInstruction };

  const guardSection = {
    heading: "AVOID",
    body: "Avoid inflated academic-sounding phrases that don't add precision (e.g. replacing 'people believe scientists more' with something like 'epistemic authority structures inform credibility assessments' — that's worse, not better, unless every added word is actually doing analytical work).",
  };

  const promptText = buildPromptSections([roleSection, ideaSection, contextSection, taskSection, guardSection]);

  const whyItWorks = [
    "Defines the actual goal correctly: more precise, not more impressive-sounding — directly heading off the common failure where 'upgrading' just means adding syllables.",
    "Provides two formality levels, giving the student flexibility to use the sentence directly or expand it depending on where it's going.",
    "Includes a meaning-check step, guarding against the upgrade drifting from what the student actually meant.",
    "Gives a concrete example of what NOT to do — inflated jargon — which is far more effective than an abstract instruction to 'keep it natural'.",
  ];

  return {
    promptText,
    whyItWorks,
    meta: [{ label: "Module: TOK Language", variant: "module" }],
    filename: "simple-to-tok-prompt.txt",
  };
}
