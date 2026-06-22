/* ============================================
   tools/counterclaimBuilder.js
   Module 3: Essay Development → Counterclaim Builder

   Purpose: takes a claim or line of argument a student has
   already developed and generates a prompt that produces a
   genuinely strong counterclaim (not a strawman) plus the
   student's response to it — central to TOK's emphasis on
   balanced, examined argument.
   ============================================ */

import { buildPromptSections } from "../core/toolPage.js";

export const fields = [
  {
    id: "claim",
    type: "textarea",
    label: "What claim or line of argument have you developed?",
    placeholder: "e.g. I'm arguing that peer review makes scientific knowledge more reliable than knowledge in the arts, because...",
    hint: "Paste your actual argument, even in rough form — the more specific, the stronger the counterclaim will be.",
    required: true,
    rows: 5,
    maxLength: 1200,
  },
  {
    id: "essayContext",
    type: "text",
    label: "What's the essay title or topic this claim belongs to?",
    placeholder: "e.g. \"Areas of knowledge can be distinguished by the methods they use to verify claims.\"",
    required: true,
  },
  {
    id: "counterStrength",
    type: "radio-chips",
    label: "How should the counterclaim be calibrated?",
    defaultValue: "strongest",
    options: [
      { value: "strongest", label: "The strongest possible objection" },
      { value: "alternative-aok", label: "From a different AOK's standards" },
      { value: "both", label: "Both" },
    ],
  },
];

export function generate(values) {
  const { claim, essayContext, counterStrength } = values;

  const roleSection = {
    heading: "ROLE",
    body: "You are a Theory of Knowledge essay supervisor whose job here is specifically to argue AGAINST the student's claim — playing devil's advocate with genuine intellectual force, not a token objection that's easy to dismiss.",
  };

  const contextSection = { heading: "ESSAY TITLE / TOPIC", body: essayContext };
  const claimSection = { heading: "THE STUDENT'S CLAIM", body: claim };

  const counterInstruction = {
    strongest: "Construct the STRONGEST possible counterclaim to this argument — the version a genuinely smart critic would make, not a weakened version that's easy to knock down. If the claim has a real weak point, find it.",
    "alternative-aok": "Construct the counterclaim specifically by applying the standards, methods, or values of a DIFFERENT Area of Knowledge than the one the student's claim relies on — show how the claim looks different, or weaker, when judged by another AOK's criteria.",
    both: "First construct the strongest possible counterclaim in general terms. Then construct a second counterclaim specifically grounded in a different Area of Knowledge's standards or methods.",
  }[counterStrength];

  const taskSection = {
    heading: "YOUR TASK",
    body: [
      `1. ${counterInstruction}`,
      "2. State the counterclaim as a clear, standalone claim — not just a list of doubts or questions.",
      "3. Identify what evidence, example, or reasoning would make this counterclaim convincing on its own terms.",
      "4. Now switch roles: write a response from the student's original position that takes the counterclaim seriously (don't dismiss it) but explains why the original claim still holds, or how it should be modified in light of the counterclaim.",
      "5. Suggest one sentence that could be added to the essay to show the examiner this counterclaim was considered — TOK essays are rewarded for showing awareness of counterarguments, not just having a strong original claim.",
    ].join("\n"),
  };

  const styleSection = {
    heading: "STYLE",
    body: "Do not produce a strawman. If, honestly, the counterclaim is more convincing than the original claim, say so directly rather than softening it to protect the student's original position.",
  };

  const promptText = buildPromptSections([roleSection, contextSection, claimSection, taskSection, styleSection]);

  const whyItWorks = [
    "Explicitly instructs against strawmanning, which is the single most common way AI-assisted counterclaims fail to be useful.",
    "When using the alternative-AOK mode, grounds the counterclaim in a different AOK's actual standards rather than generic scepticism — a more sophisticated and assessable move.",
    "Requires a genuine response from the original position, not just the objection alone — this is what produces an examinable, dialectical paragraph rather than a dead end.",
    "Gives explicit permission for the counterclaim to win, protecting against an AI's tendency to be agreeable and quietly favour the student's original position regardless of merit.",
  ];

  return {
    promptText,
    whyItWorks,
    meta: [{ label: "Module: Essay Development", variant: "module" }],
    filename: "counterclaim-builder-prompt.txt",
  };
}
