/* ============================================
   tools/aokCompatibility.js
   Module 3: Essay Development → AoK Compatibility Analysis

   Purpose: tests which AOKs genuinely have something
   substantive to say about a given prescribed title,
   versus which would feel forced — preventing the common
   error of picking an AOK because it's familiar rather
   than because it fits.
   ============================================ */

import { AOKS } from "../data/aoks.js";
import { buildPromptSections } from "../core/toolPage.js";

export const fields = [
  {
    id: "title",
    type: "textarea",
    label: "Prescribed title (or its core claim/question)",
    placeholder: "e.g. \"Some areas of knowledge are easier to disagree about than others.\" Discuss.",
    required: true,
    rows: 4,
    maxLength: 500,
  },
  {
    id: "candidateAoks",
    type: "chips",
    label: "Which AOKs are you considering?",
    hint: "Choose 2-4 to compare. Leave blank to have the AI survey all eight and shortlist the strongest.",
    options: AOKS.map((a) => ({ value: a.id, label: a.name })),
  },
  {
    id: "needed",
    type: "radio-chips",
    label: "How many AOKs does your essay need?",
    defaultValue: "two",
    options: [
      { value: "two", label: "Two (standard)" },
      { value: "one-deep", label: "One, in depth" },
    ],
  },
];

export function generate(values) {
  const { title, candidateAoks, needed } = values;

  const aokList = candidateAoks.length
    ? candidateAoks.map((id) => AOKS.find((a) => a.id === id)?.name).filter(Boolean)
    : null;

  const roleSection = {
    heading: "ROLE",
    body: "You are a Theory of Knowledge essay supervisor helping a student choose Areas of Knowledge that genuinely fit a prescribed title — not AOKs the student merely feels comfortable with. Favour intellectual honesty over reassurance.",
  };

  const titleSection = { heading: "PRESCRIBED TITLE", body: `"${title}"` };

  const scopeSection = aokList
    ? { heading: "AOKs TO COMPARE", body: aokList.join(", ") }
    : { heading: "SCOPE", body: "Survey all eight Areas of Knowledge in the TOK course (History, Human Sciences, Natural Sciences, Mathematics, the Arts, Ethics, Religious Knowledge Systems, Indigenous Societies) and shortlist the strongest candidates." };

  const taskSection = {
    heading: "YOUR TASK",
    body: [
      aokList
        ? `1. For EACH of the AOKs listed, give a compatibility rating (Strong fit / Workable / Weak fit) and justify it in 2-3 sentences — what specifically about this title connects, or fails to connect, to this AOK's methods, scope, or characteristic problems?`
        : "1. Identify the 3-4 AOKs most likely to produce strong essay material for this title, and briefly explain why each is a contender, before ranking them as Strong fit / Workable / Weak fit.",
      "2. For the one or two strongest candidates, suggest a SPECIFIC real-world example or case from that AOK that could anchor the essay — not just the AOK in the abstract.",
      needed === "two"
        ? "3. Recommend a pairing of two AOKs that would create productive TENSION or CONTRAST when discussed together for this title — explain what the contrast would actually reveal, not just that 'they're different'."
        : "3. For the single strongest AOK, identify what would need to be explored in depth to sustain a full essay on this title using only that one AOK — what sub-questions or angles give it enough material.",
      "4. Name the most tempting but actually weak AOK choice for this title — the one students often pick because it's familiar, and explain specifically why it underperforms here.",
    ].join("\n"),
  };

  const promptText = buildPromptSections([roleSection, titleSection, scopeSection, taskSection]);

  const whyItWorks = [
    "Forces a graded verdict (Strong / Workable / Weak) rather than vague encouragement, giving the student something decisive to act on.",
    "Requires a SPECIFIC example per AOK, not just abstract compatibility — turning the analysis directly into usable essay material.",
    "Asks for a pairing that creates tension, not just two AOKs bolted together — this is what distinguishes essays that genuinely compare AOKs from ones that discuss them in parallel without ever connecting.",
    "Names the tempting-but-weak choice explicitly, pre-empting the most common AOK-selection mistake before time is wasted on it.",
  ];

  return {
    promptText,
    whyItWorks,
    meta: [{ label: "Module: Essay Development", variant: "module" }],
    filename: "aok-compatibility-prompt.txt",
  };
}
