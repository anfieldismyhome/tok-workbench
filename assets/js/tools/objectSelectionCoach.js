/* ============================================
   tools/objectSelectionCoach.js
   Module 4: Exhibition Development → Object Selection Coach

   Purpose: a student has their IA prompt but hasn't yet
   chosen their three objects (or has candidates they're
   unsure about). This generates a prompt that helps decide
   or stress-test object choices before commentary writing
   begins — distinct from Object Analysis Tool, which writes
   the commentary for an ALREADY-chosen object.
   ============================================ */

import { IA_PROMPT_OPTIONS } from "../data/iaPrompts.js";
import { buildPromptSections } from "../core/toolPage.js";

export const fields = [
  {
    id: "iaPrompt",
    type: "select",
    label: "Your IA prompt",
    placeholder: "Choose your IA prompt",
    required: true,
    options: IA_PROMPT_OPTIONS,
  },
  {
    id: "mode",
    type: "radio-chips",
    label: "What do you need?",
    defaultValue: "generate",
    options: [
      { value: "generate", label: "Generate object ideas from scratch" },
      { value: "evaluate", label: "Evaluate objects I already have in mind" },
    ],
  },
  {
    id: "candidateObjects",
    type: "textarea",
    label: "Your candidate objects (if evaluating) or interests/context (if generating)",
    placeholder: "Evaluating: list your candidate objects, one per line.\nGenerating: describe your interests, hobbies, culture, or things you have access to that might make good objects.",
    hint: "The strongest objects usually come from a student's own life — be concrete about what's actually available to you.",
    required: true,
    rows: 5,
    maxLength: 1200,
  },
];

export function generate(values) {
  const { iaPrompt, mode, candidateObjects } = values;

  const roleSection = {
    heading: "ROLE",
    body: "You are a Theory of Knowledge teacher helping a student choose three strong, specific, real-world objects for their Exhibition. Strong objects are specific (not generic categories), personally accessible (the student can actually photograph or describe them with real detail), and create a genuine, non-forced link to the IA prompt.",
  };

  const promptSection = { heading: "IA PROMPT (must be used exactly as worded)", body: iaPrompt };

  let taskSection;
  if (mode === "generate") {
    const contextSection = { heading: "STUDENT'S INTERESTS / CONTEXT", body: candidateObjects };
    taskSection = {
      heading: "YOUR TASK",
      body: [
        "1. Suggest 6-8 candidate objects, drawing on the student's stated interests and context, that could each connect specifically to the IA prompt.",
        "2. For each candidate, state in one sentence the specific angle it would take on the prompt — not just 'this relates to knowledge' but what particular aspect.",
        "3. Make sure the 6-8 candidates are genuinely varied — drawing from different areas of the student's life or different types of object (e.g. not six variations on 'a book').",
        "4. From the full set, recommend a combination of THREE that would work well together — they should approach the prompt from clearly different angles, not repeat the same point three times.",
        "5. For the recommended three, flag anything that would need to be made MORE specific before it's exhibition-ready (e.g. 'a family photo' needs to become a specific photo, with a specific story).",
      ].join("\n"),
      extra: [contextSection],
    };
  } else {
    const contextSection = { heading: "CANDIDATE OBJECTS", body: candidateObjects };
    taskSection = {
      heading: "YOUR TASK",
      body: [
        "1. For EACH candidate object, evaluate it against three tests: (a) Is it specific enough, or still a generic category? (b) Does it connect to the IA prompt in a way that's load-bearing, not just thematically loose? (c) Can the student realistically photograph/describe it with genuine personal detail?",
        "2. Give each candidate a verdict: Strong / Needs sharpening / Weak — and say exactly what change would move a 'Needs sharpening' object to 'Strong'.",
        "3. Check whether the candidates, taken together, actually approach the prompt from different angles — or whether two of them are making essentially the same point. If so, say which one is redundant.",
        "4. If the set is weak overall, suggest what KIND of object is missing to balance it (e.g. 'you have two media examples — consider adding something personal or historical').",
        "5. Give a final recommendation: which three objects (from the candidates, possibly modified per your sharpening notes) would make the strongest exhibition.",
      ].join("\n"),
      extra: [contextSection],
    };
  }

  const promptText = buildPromptSections([roleSection, promptSection, ...taskSection.extra, { heading: taskSection.heading, body: taskSection.body }]);

  const whyItWorks =
    mode === "generate"
      ? [
          "Grounds suggestions in the student's actual life and access, rather than generic 'examples of knowledge' that no one can photograph or describe with real specificity.",
          "Forces variety across the 6-8 candidates so the final three don't all make the same point from slightly different angles.",
          "Recommends a combination, not just a list — exhibitions are assessed as a coherent set of three, not three independent attempts.",
          "Flags what still needs sharpening, turning a generic idea into something exhibition-ready rather than leaving that work undone.",
        ]
      : [
          "Applies three explicit, examiner-relevant tests to each object rather than a vague gut-check — specificity, load-bearing connection, and photographability.",
          "Checks for redundancy across the set of three, catching a common weakness where objects repeat the same idea instead of triangulating the prompt.",
          "Gives a concrete sharpening instruction for any weak object, rather than just flagging the problem and leaving the student stuck.",
        ];

  return {
    promptText,
    whyItWorks,
    meta: [{ label: "Module: Exhibition Development", variant: "module" }],
    filename: "object-selection-coach-prompt.txt",
  };
}
