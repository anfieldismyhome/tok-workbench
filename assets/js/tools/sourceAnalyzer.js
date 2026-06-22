/* ============================================
   tools/sourceAnalyzer.js
   Module 1: Source Analysis → Source Analyzer

   Purpose: helps a learner generate a rigorous prompt that
   asks an AI to analyse a real-world source (article, image,
   data set, speech, etc.) through a TOK lens — surfacing
   knowledge claims, AOK, methods, and concepts at stake,
   rather than just summarising the source.
   ============================================ */

import { AOK_OPTIONS } from "../data/aoks.js";
import { TOK_CONCEPT_OPTIONS } from "../data/tokConcepts.js";
import { buildPromptSections } from "../core/toolPage.js";

export const fields = [
  {
    id: "sourceDescription",
    type: "textarea",
    label: "Describe or paste the source",
    placeholder: "e.g. A news article claiming a new diet 'proven' to reduce cancer risk by 50%, based on a 6-week study of 40 participants...",
    hint: "Paste the text, or describe the source in enough detail that someone who hasn't seen it could picture it.",
    required: true,
    rows: 6,
    maxLength: 2000,
  },
  {
    id: "sourceType",
    type: "select",
    label: "What kind of source is this?",
    placeholder: "Select a source type",
    required: true,
    options: [
      { value: "news-article", label: "News article" },
      { value: "social-media", label: "Social media post" },
      { value: "academic-paper", label: "Academic paper / journal article" },
      { value: "advertisement", label: "Advertisement" },
      { value: "image-photo", label: "Image or photograph" },
      { value: "data-visualisation", label: "Data set / chart / infographic" },
      { value: "speech-interview", label: "Speech or interview" },
      { value: "documentary-film", label: "Documentary or film clip" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "relatedAok",
    type: "select",
    label: "Which Area of Knowledge does this source relate to most closely?",
    placeholder: "Select an AOK (optional)",
    options: AOK_OPTIONS,
    allowEmptySubmit: true,
    hint: "If you're unsure, leave this and ask the AI to suggest one — it's added as an option below.",
  },
  {
    id: "suggestAok",
    type: "radio-chips",
    label: "If you didn't choose an AOK, should the AI suggest one?",
    defaultValue: "yes",
    options: [
      { value: "yes", label: "Yes, suggest an AOK" },
      { value: "no", label: "No, skip that" },
    ],
  },
  {
    id: "focusConcepts",
    type: "chips",
    label: "Which TOK concepts should the analysis foreground?",
    hint: "Choose 1–3. The prompt will ask the AI to organise its analysis around these.",
    options: TOK_CONCEPT_OPTIONS,
  },
  {
    id: "depth",
    type: "radio-chips",
    label: "Analysis depth",
    defaultValue: "standard",
    options: [
      { value: "quick", label: "Quick (key claims only)" },
      { value: "standard", label: "Standard" },
      { value: "deep", label: "Deep (essay-ready)" },
    ],
  },
];

function depthInstruction(depth) {
  switch (depth) {
    case "quick":
      return "Keep the analysis concise: identify the core knowledge claim(s) and one or two key TOK issues only. Aim for a tight, scannable response.";
    case "deep":
      return "Provide a thorough, essay-ready analysis suitable for use as evidence in a TOK essay or exhibition commentary. Where relevant, note how the analysis could be developed further with additional research.";
    default:
      return "Provide a clear, well-organised analysis suitable for class discussion or a journal entry — thorough but not exhaustive.";
  }
}

const SOURCE_TYPE_LABELS = {
  "news-article": "a news article",
  "social-media": "a social media post",
  "academic-paper": "an academic paper or journal article",
  advertisement: "an advertisement",
  "image-photo": "an image or photograph",
  "data-visualisation": "a data set, chart, or infographic",
  "speech-interview": "a speech or interview",
  "documentary-film": "a documentary or film clip",
  other: "a source",
};

export function generate(values) {
  const { sourceDescription, sourceType, relatedAok, suggestAok, focusConcepts, depth } = values;

  const aokLabel = relatedAok
    ? AOK_OPTIONS.find((o) => o.value === relatedAok)?.label
    : null;

  const conceptLabels = focusConcepts
    .map((id) => TOK_CONCEPT_OPTIONS.find((o) => o.value === id)?.label)
    .filter(Boolean);

  const roleSection = {
    heading: "ROLE",
    body: "You are a Theory of Knowledge (TOK) tutor helping a Diploma Programme student analyse a real-world source. Your job is not to summarise the source, but to surface the knowledge claims it makes and examine them critically using TOK concepts and language.",
  };

  const sourceSection = {
    heading: "THE SOURCE",
    body: `Type: ${SOURCE_TYPE_LABELS[sourceType] || "a source"}\n\n${sourceDescription}`,
  };

  const taskLines = [
    "1. Identify the explicit and implicit knowledge claims being made in this source. State each claim clearly in one sentence.",
    "2. For each claim, identify what KIND of justification is being offered (e.g. evidence, authority, anecdote, statistical inference, appeal to emotion) and evaluate how strong that justification actually is.",
    aokLabel
      ? `3. Discuss how this source relates to ${aokLabel} as an Area of Knowledge — which methods, tools, or standards of justification from that AOK are being used well, used poorly, or ignored.`
      : suggestAok === "yes"
        ? "3. Suggest which Area(s) of Knowledge this source most relates to, and justify your choice before discussing how well the source meets the standards of justification typical of that AOK."
        : "3. Comment on what standards of justification this source seems to be operating under, without assuming a single Area of Knowledge.",
  ];

  if (conceptLabels.length) {
    taskLines.push(
      `4. Organise part of your analysis explicitly around the following TOK concept(s): ${conceptLabels.join(", ")}. For each concept, explain specifically how it illuminates something about this source that a surface-level reading would miss.`
    );
  }

  taskLines.push(
    `${conceptLabels.length ? 5 : 4}. Identify at least one significant limitation, bias, or unanswered question in the source — something a careful knower should be cautious about before accepting its claims.`
  );
  taskLines.push(
    `${conceptLabels.length ? 6 : 5}. Close with one strong, open Knowledge Question that this source raises — phrased generally (not about this source specifically) so it could apply to other knowledge situations too.`
  );

  const taskSection = {
    heading: "YOUR TASK",
    body: taskLines.join("\n"),
  };

  const styleSection = {
    heading: "STYLE AND DEPTH",
    body: `${depthInstruction(depth)} Use precise TOK vocabulary, but explain any technical term the first time you use it. Avoid simply restating the source — every sentence should add analytical value.`,
  };

  const promptText = buildPromptSections([roleSection, sourceSection, taskSection, styleSection]);

  const whyItWorks = [
    "Separates claim identification from claim evaluation — a common weak spot where students conflate 'what is said' with 'how well it is justified'.",
    "Forces explicit naming of the kind of justification used, which is exactly what TOK assessment rewards over plot-summary description.",
    aokLabel || suggestAok === "yes"
      ? "Anchors the analysis in a specific Area of Knowledge so the AI's response uses that AOK's actual standards, not generic critical thinking."
      : "Keeps the analysis open rather than forcing a premature AOK label, useful at early exploration stages.",
    conceptLabels.length
      ? "Names specific TOK concepts to organise the response around, preventing a generic 'this could be biased' answer."
      : "Leaves concept selection open, useful if you want to discover which concepts are most relevant before committing.",
    "Ends by asking for a general Knowledge Question rather than a source-specific one — this is the exact move needed to turn a source into exhibition or essay material.",
  ];

  return {
    promptText,
    whyItWorks,
    meta: [
      { label: "Module: Source Analysis", variant: "module" },
      aokLabel ? { label: aokLabel, variant: "aok" } : null,
    ].filter(Boolean),
    filename: "source-analyzer-prompt.txt",
  };
}
