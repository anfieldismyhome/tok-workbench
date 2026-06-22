/* ============================================
   tools/titleUnpacker.js
   Module 3: Essay Development → Essay Prescribed Title Unpacker

   Purpose: takes a prescribed title (verbatim, from the
   current IB TOK title list) and generates a prompt that
   breaks it into its working parts — command term, key
   terms, implicit assumptions, and the KQ(s) buried inside it.
   ============================================ */

import { COMMAND_TERMS, getCommandTermById } from "../data/commandTerms.js";
import { buildPromptSections } from "../core/toolPage.js";

export const fields = [
  {
    id: "title",
    type: "textarea",
    label: "Paste the prescribed title exactly as given",
    placeholder: "e.g. \"The production of knowledge requires the involvement of the knower. Discuss this claim with reference to two Areas of Knowledge.\"",
    hint: "Use the exact wording — small differences in phrasing change what the title is actually asking.",
    required: true,
    rows: 4,
    maxLength: 500,
  },
  {
    id: "commandTerm",
    type: "select",
    label: "Command term in the title (if you can identify it)",
    placeholder: "Not sure — let the AI identify it",
    options: COMMAND_TERMS.map((c) => ({ value: c.id, label: c.name })),
    allowEmptySubmit: true,
  },
  {
    id: "stage",
    type: "radio-chips",
    label: "Where are you in the process?",
    defaultValue: "first-read",
    options: [
      { value: "first-read", label: "First read-through" },
      { value: "choosing-aoks", label: "Choosing which AOKs to use" },
      { value: "planning", label: "Planning the structure" },
    ],
  },
];

const STAGE_FOCUS = {
  "first-read": "The student is encountering this title for the first time and needs to understand exactly what it is asking before doing anything else.",
  "choosing-aoks": "The student understands the title broadly and now needs help deciding which Areas of Knowledge would let them engage with it most productively.",
  planning: "The student has a rough direction and needs the unpacking to feed directly into a working essay structure.",
};

export function generate(values) {
  const { title, commandTerm, stage } = values;
  const commandTermData = commandTerm ? getCommandTermById(commandTerm) : null;

  const roleSection = {
    heading: "ROLE",
    body: "You are a Theory of Knowledge essay supervisor. Your job is to unpack a prescribed title with total precision before any essay writing begins — vague unpacking produces vague essays, so be exact about every word that matters.",
  };

  const titleSection = {
    heading: "PRESCRIBED TITLE",
    body: `"${title}"`,
  };

  const stageSection = { heading: "CONTEXT", body: STAGE_FOCUS[stage] };

  const taskLines = [
    "1. Identify the command term in this title and state precisely what kind of thinking it demands (e.g. a balanced range of arguments, a weighed judgement, a systematic exploration). Do not just define the term generically — apply it to this specific title.",
  ];

  if (commandTermData) {
    taskLines[0] += ` The student has identified the command term as "${commandTermData.name}" — confirm or correct this, then explain: ${commandTermData.demand}`;
  }

  taskLines.push(
    "2. Identify every key term or phrase in the title that needs to be defined or interpreted before the essay can proceed — flag any term that is ambiguous or could be reasonably interpreted more than one way, since how it's defined will shape the whole essay.",
    "3. State the implicit assumption(s) buried in the title — what does the title seem to take for granted that a strong essay should actually question?",
    "4. Rephrase the title as one or more genuine Knowledge Questions in plain language, to confirm what is actually being asked beneath the formal wording.",
    "5. Flag the most common way students misread or oversimplify this kind of title, so it can be deliberately avoided."
  );

  const taskSection = { heading: "YOUR TASK", body: taskLines.join("\n") };

  const promptText = buildPromptSections([roleSection, titleSection, stageSection, taskSection]);

  const whyItWorks = [
    "Refuses to let the command term get treated as decoration — ties it concretely to what the title demands, which directly drives essay structure.",
    "Flags ambiguous key terms before writing starts, preventing the common failure where a student picks a definition midway through and has to restart.",
    "Surfaces the title's implicit assumption — interrogating assumptions is exactly the kind of move that distinguishes strong TOK essays from descriptive ones.",
    "Converts the formal title into plain-language Knowledge Questions, giving the student a sanity check on whether they've actually understood what's being asked.",
    "Names the common misreading proactively, functioning as an early warning system rather than a correction after the fact.",
  ];

  return {
    promptText,
    whyItWorks,
    meta: [{ label: "Module: Essay Development", variant: "module" }],
    filename: "title-unpacker-prompt.txt",
  };
}
