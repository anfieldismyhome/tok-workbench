/* ============================================
   tools/discussionQuestionBuilder.js
   Module 2: KQ Development → Discussion Question Builder

   Purpose: teacher-facing tool that generates a prompt
   asking the AI to build a sequence of classroom discussion
   questions on a TOK topic — scaffolded from concrete to
   abstract, suitable for whole-class or small-group use.
   ============================================ */

import { AOK_OPTIONS, getAokById } from "../data/aoks.js";
import { ADVANCED_THEME_OPTIONS, getThemeById } from "../data/advancedThemes.js";
import { buildPromptSections } from "../core/toolPage.js";

export const fields = [
  {
    id: "topic",
    type: "textarea",
    label: "Lesson topic or stimulus",
    placeholder: "e.g. Whether eyewitness testimony should count as strong evidence in court",
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
    id: "advancedTheme",
    type: "select",
    label: "Connect to an advanced theme? (optional)",
    placeholder: "No advanced theme",
    options: ADVANCED_THEME_OPTIONS,
    allowEmptySubmit: true,
  },
  {
    id: "classFormat",
    type: "radio-chips",
    label: "Class format",
    defaultValue: "whole-class",
    options: [
      { value: "whole-class", label: "Whole-class discussion" },
      { value: "small-group", label: "Small-group / think-pair-share" },
      { value: "socratic", label: "Socratic seminar" },
    ],
  },
  {
    id: "duration",
    type: "radio-chips",
    label: "Approximate discussion length",
    defaultValue: "20",
    options: [
      { value: "10", label: "~10 min" },
      { value: "20", label: "~20 min" },
      { value: "40", label: "Full lesson (~40 min)" },
    ],
  },
];

const FORMAT_NOTE = {
  "whole-class": "designed for a teacher to pose to the full class, with room for multiple students to respond and build on each other",
  "small-group": "designed to work as think-pair-share or small-group prompts, where students discuss before any whole-class share-back",
  socratic: "designed for a Socratic seminar format, where the teacher's role is mainly to pose and follow up, not to lecture",
};

export function generate(values) {
  const { topic, aok, advancedTheme, classFormat, duration } = values;
  const aokData = aok ? getAokById(aok) : null;
  const themeData = advancedTheme ? getThemeById(advancedTheme) : null;

  const roleSection = {
    heading: "ROLE",
    body: "You are a Theory of Knowledge teacher preparing discussion questions for class. Build a short SEQUENCE of questions that opens with something concrete and accessible, then moves toward genuine TOK abstraction — not a flat list of equally difficult questions.",
  };

  const topicSection = {
    heading: "LESSON TOPIC", 
    body: topic,
  };

  const contextLines = [];
  if (aokData) contextLines.push(`Anchor the discussion in ${aokData.name} as the Area of Knowledge.`);
  if (themeData) contextLines.push(`Where natural, connect the discussion to the theme of ${themeData.name}: ${themeData.shortDesc}`);
  contextLines.push(`This is ${FORMAT_NOTE[classFormat]}, for approximately ${duration} minutes.`);

  const contextSection = { heading: "CONTEXT", body: contextLines.map((c) => `- ${c}`).join("\n") };

  const taskSection = {
    heading: "YOUR TASK",
    body: [
      "1. Write an OPENING question that any student can answer from personal experience or general knowledge — no TOK vocabulary required yet. This should hook interest, not test prior learning.",
      "2. Write 2-3 BRIDGE questions that move from the concrete opening toward TOK thinking — introducing concepts like evidence, justification, or perspective naturally through the topic, not by lecturing definitions.",
      "3. Write 1-2 CORE questions that are genuine Knowledge Questions — open, general, about knowledge itself.",
      "4. Write ONE closing or 'so what' question that asks students to reflect on why this discussion matters beyond the classroom.",
      "5. For at least 2 of the questions, suggest a likely unhelpful or surface-level answer a student might give, and a follow-up question the teacher could use to push past it.",
    ].join("\n"),
  };

  const formatSection = {
    heading: "FORMAT",
    body: `Label each question by its role in the sequence (Opening / Bridge / Core / Closing). Keep teacher-facing notes brief — this should be quick to scan during a live lesson, fitting comfortably within ${duration} minutes including discussion time, not just question-reading time.`,
  };

  const promptText = buildPromptSections([roleSection, topicSection, contextSection, taskSection, formatSection]);

  const whyItWorks = [
    "Sequences questions from concrete to abstract rather than listing them flat — this single structural choice is what separates a real discussion arc from a quiz.",
    "Asks for anticipated weak answers plus follow-ups, giving the teacher a live tool for the actual unpredictable moment in class, not just a script to read.",
    "Keeps the opening question free of TOK jargon, so the discussion earns its way into abstraction rather than starting there and losing the room.",
    "Builds in a time constraint so the output is realistically usable within an actual lesson, not an idealised infinite-time discussion plan.",
  ];

  return {
    promptText,
    whyItWorks,
    meta: [
      { label: "Module: KQ Development", variant: "module" },
      aokData ? { label: aokData.name, variant: "aok" } : null,
      themeData ? { label: themeData.name, variant: "module" } : null,
    ].filter(Boolean),
    filename: "discussion-question-builder-prompt.txt",
  };
}
