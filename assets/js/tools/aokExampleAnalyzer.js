/* ============================================
   tools/aokExampleAnalyzer.js
   Module 1: Source Analysis → AoK Example Analyzer

   Purpose: tests how well a chosen real-world example
   actually fits the Area of Knowledge a student wants to
   use it for — a very common point of failure where students
   pick an example that sounds relevant but doesn't hold up
   under the Knowledge Framework.
   ============================================ */

import { AOK_OPTIONS, getAokById } from "../data/aoks.js";
import { KF_OPTIONS } from "../data/knowledgeFramework.js";
import { buildPromptSections } from "../core/toolPage.js";

export const fields = [
  {
    id: "example",
    type: "textarea",
    label: "Describe the real-world example",
    placeholder: "e.g. The retraction of a major psychology study after a failed replication attempt...",
    hint: "Be specific: name, date, or context, if known. A vague example produces a vague analysis.",
    required: true,
    rows: 5,
    maxLength: 1500,
  },
  {
    id: "aok",
    type: "select",
    label: "Which Area of Knowledge are you testing this example against?",
    placeholder: "Select an AOK",
    required: true,
    options: AOK_OPTIONS,
  },
  {
    id: "kfFocus",
    type: "chips",
    label: "Which Knowledge Framework elements should the test focus on?",
    hint: "Leave blank to cover all four (Scope, Perspectives, Methods and Tools, Ethics).",
    options: KF_OPTIONS,
  },
  {
    id: "intendedUse",
    type: "radio-chips",
    label: "What will you use this example for?",
    defaultValue: "essay",
    options: [
      { value: "essay", label: "TOK essay" },
      { value: "exhibition", label: "TOK exhibition" },
      { value: "class-discussion", label: "Class discussion" },
    ],
  },
];

export function generate(values) {
  const { example, aok, kfFocus, intendedUse } = values;
  const aokData = getAokById(aok);
  const aokLabel = aokData?.name || aok;

  const kfLabels = kfFocus.length
    ? kfFocus.map((id) => KF_OPTIONS.find((o) => o.value === id)?.label).filter(Boolean)
    : KF_OPTIONS.map((o) => o.label);

  const useLabel = {
    essay: "a TOK essay, where the example needs to bear real analytical weight, not just illustrate a point in passing",
    exhibition: "a TOK exhibition, where the example must be a specific real-world object connected precisely to the IA prompt",
    "class-discussion": "class discussion, where the bar for precision is lower but the example should still hold up to scrutiny",
  }[intendedUse];

  const roleSection = {
    heading: "ROLE",
    body: `You are a Theory of Knowledge examiner-style critical reader. A student wants to use the following example to illustrate something about ${aokLabel} as an Area of Knowledge. Your job is to rigorously test whether this example actually fits — not to be agreeable.`,
  };

  const exampleSection = {
    heading: "THE EXAMPLE",
    body: example,
  };

  const aokContextSection = {
    heading: "AREA OF KNOWLEDGE BEING TESTED",
    body: `${aokLabel}. Typical methods in this AOK include: ${aokData?.methods?.join(", ") || "—"}. Common points of tension in this AOK include: ${aokData?.sampleTensions?.[0] || "—"}.`,
  };

  const taskSection = {
    heading: "YOUR TASK",
    body: [
      `1. State plainly: does this example genuinely belong to ${aokLabel}, or is it being stretched to fit? Give a direct verdict before explaining it.`,
      `2. Test the example against each of the following Knowledge Framework element(s): ${kfLabels.join(", ")}. For each one, explain specifically what the example reveals — and flag if an element doesn't apply cleanly, rather than forcing a fit.`,
      "3. Identify one way this example could be misused or oversimplified by a student under exam pressure (e.g. turned into a vague generalisation, or used as 'proof' rather than illustration).",
      "4. Suggest one sharper, more specific version of this example (same general topic, but more precisely scoped) that would hold up better under examiner scrutiny.",
      "5. Note any other AOK this example might fit just as well, or better — useful for spotting when an example is being forced into the wrong category.",
    ].join("\n"),
  };

  const styleSection = {
    heading: "STYLE",
    body: `This is being prepared for ${useLabel}. Be direct and specific rather than diplomatic — the goal is to stress-test the example before it's relied on, not to validate it.`,
  };

  const promptText = buildPromptSections([roleSection, exampleSection, aokContextSection, taskSection, styleSection]);

  const whyItWorks = [
    "Demands a direct verdict before explanation — prevents the AI from hedging into vague 'it depends' territory that doesn't help the student decide.",
    "Tests the example against named Knowledge Framework elements individually, rather than asking for generic commentary.",
    "Explicitly invites the AI to say an element 'doesn't apply' — guards against forced, artificial connections that examiners notice immediately.",
    "Asks for a sharper version of the example, turning critique into something immediately usable rather than just identifying a problem.",
    "Checks for AOK misclassification, a frequent and often invisible error in TOK work.",
  ];

  return {
    promptText,
    whyItWorks,
    meta: [
      { label: "Module: Source Analysis", variant: "module" },
      { label: aokLabel, variant: "aok" },
    ],
    filename: "aok-example-analyzer-prompt.txt",
  };
}
