/* ============================================
   data/commandTerms.js
   Command terms commonly used in TOK exhibition/essay
   prescribed titles and classroom tasks, with the kind
   of thinking each demands. Used to calibrate generated
   prompts so the AI is asked to do the right cognitive work.
   ============================================ */

export const COMMAND_TERMS = [
  { id: "discuss", name: "Discuss", demand: "Offer a balanced review that includes a range of arguments, factors, or hypotheses. Opinions/conclusions should be presented clearly and supported by appropriate evidence." },
  { id: "evaluate", name: "Evaluate", demand: "Make an appraisal by weighing up strengths and limitations." },
  { id: "explore", name: "Explore", demand: "Undertake a systematic process of discovery, open to multiple angles rather than a single fixed conclusion." },
  { id: "examine", name: "Examine", demand: "Consider an argument or concept in a way that uncovers the assumptions and interrelationships of the issue." },
  { id: "justify", name: "Justify", demand: "Give valid reasons or evidence to support an answer or conclusion." },
  { id: "to-what-extent", name: "To what extent", demand: "Consider the merits or otherwise of an argument or concept, weighing evidence for and against, and arriving at a qualified judgement." },
  { id: "compare", name: "Compare", demand: "Give an account of similarities between two or more items, referring to both throughout." },
  { id: "compare-and-contrast", name: "Compare and contrast", demand: "Give an account of similarities and differences between two or more items, referring to both throughout." },
];

export function getCommandTermById(id) {
  return COMMAND_TERMS.find((c) => c.id === id) || null;
}

export const COMMAND_TERM_OPTIONS = COMMAND_TERMS.map((c) => ({ value: c.id, label: c.name }));
