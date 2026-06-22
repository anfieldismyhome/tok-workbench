/* ============================================
   tools/biasPerspectiveAnalyzer.js
   Module 1: Source Analysis → Bias & Perspective Analyzer

   Purpose: generates a prompt that identifies whose
   perspective is present, amplified, missing, or assumed
   in a source — central to the TOK "Perspectives" lens
   and to avoiding shallow "everything is biased" answers.
   ============================================ */

import { buildPromptSections } from "../core/toolPage.js";

export const fields = [
  {
    id: "source",
    type: "textarea",
    label: "Paste or describe the source",
    placeholder: "e.g. An op-ed arguing that social media regulation harms free speech...",
    required: true,
    rows: 6,
    maxLength: 2000,
  },
  {
    id: "perspectiveType",
    type: "chips",
    label: "Which dimensions of perspective should be examined?",
    hint: "Choose any that seem relevant. Leave blank to let the AI identify the most significant ones itself.",
    options: [
      { value: "cultural", label: "Cultural" },
      { value: "national-political", label: "National / political" },
      { value: "socioeconomic", label: "Socioeconomic" },
      { value: "disciplinary", label: "Disciplinary / professional" },
      { value: "generational", label: "Generational" },
      { value: "gender", label: "Gender" },
      { value: "institutional", label: "Institutional (who funds/publishes it)" },
    ],
  },
  {
    id: "goAvoidGeneric",
    type: "radio-chips",
    label: "How rigorous should the bias analysis be?",
    defaultValue: "rigorous",
    options: [
      { value: "rigorous", label: "Rigorous — avoid generic 'it's biased' claims" },
      { value: "intro", label: "Introductory — explain bias concepts as it goes" },
    ],
  },
];

export function generate(values) {
  const { source, perspectiveType, goAvoidGeneric } = values;

  const dimensionLabels = perspectiveType.length
    ? perspectiveType
        .map((id) => ({
          cultural: "Cultural",
          "national-political": "National / political",
          socioeconomic: "Socioeconomic",
          disciplinary: "Disciplinary / professional",
          generational: "Generational",
          gender: "Gender",
          institutional: "Institutional (funding, publisher, platform)",
        })[id])
        .filter(Boolean)
    : null;

  const roleSection = {
    heading: "ROLE",
    body: "You are a Theory of Knowledge tutor helping a student move beyond the vague claim that a source 'has bias' towards a precise account of whose perspective is shaping it, and how.",
  };

  const sourceSection = {
    heading: "THE SOURCE",
    body: source,
  };

  const taskLines = [
    "1. Identify the perspective(s) actually present in this source — be specific about whose viewpoint is speaking (e.g. not just 'Western', but which institution, profession, or position).",
    "2. Identify at least one perspective that is notably ABSENT or unaddressed — a viewpoint that, if included, would meaningfully change the picture.",
    "3. Distinguish between perspective and bias: explain where this source simply reflects a standpoint (unavoidable for any knower) versus where it shows bias in the sense of unjustified distortion or omission.",
    "4. Explain how the perspective present shapes not just the CONCLUSION of the source, but the very QUESTIONS it asks or fails to ask.",
  ];

  if (dimensionLabels) {
    taskLines.push(
      `5. Organise your analysis using these dimensions of perspective specifically: ${dimensionLabels.join(", ")}.`
    );
  }

  taskLines.push(
    `${dimensionLabels ? 6 : 5}. Conclude with one Knowledge Question about the relationship between perspective and knowledge that this source raises.`
  );

  const taskSection = { heading: "YOUR TASK", body: taskLines.join("\n") };

  const styleSection = {
    heading: "STYLE",
    body:
      goAvoidGeneric === "rigorous"
        ? "Avoid generic statements like 'all sources are biased' or 'we should consider multiple perspectives' without specifying which perspectives and why they matter here. Every claim about bias must be tied to a specific textual or contextual feature of this source."
        : "As you go, briefly explain the TOK distinction between 'perspective' (a standpoint every knower has) and 'bias' (an unjustified distortion), so a student new to these terms can follow the reasoning.",
  };

  const promptText = buildPromptSections([roleSection, sourceSection, taskSection, styleSection]);

  const whyItWorks = [
    "Forces a distinction between perspective and bias — these get conflated constantly, and TOK assessment specifically rewards getting this distinction right.",
    "Asks for an absent perspective, not just present ones — this is the move that produces genuinely interesting TOK analysis rather than restating the obvious.",
    "Connects perspective to which QUESTIONS get asked, not just which conclusions are reached — a more sophisticated and accurate account of how perspective operates.",
    "Includes an explicit instruction against generic 'everything is biased' answers, a common weak pattern in both student writing and AI-generated text.",
  ];

  return {
    promptText,
    whyItWorks,
    meta: [{ label: "Module: Source Analysis", variant: "module" }],
    filename: "bias-perspective-analyzer-prompt.txt",
  };
}
