/* ============================================
   data/tokConcepts.js
   The 12 core TOK concepts named in the current Guide,
   with short working definitions for prompt scaffolding.
   ============================================ */

export const TOK_CONCEPTS = [
  { id: "evidence", name: "Evidence", desc: "What counts as support for a knowledge claim, and how its strength is judged." },
  { id: "certainty", name: "Certainty", desc: "The degree of confidence we can have in a knowledge claim, and its limits." },
  { id: "truth", name: "Truth", desc: "What it means for a claim to be true, and how different AOKs understand truth." },
  { id: "interpretation", name: "Interpretation", desc: "The process of making sense of evidence, data, texts, or experience." },
  { id: "power", name: "Power", desc: "How power relations shape whose knowledge is produced, valued, or silenced." },
  { id: "justification", name: "Justification", desc: "The reasons or grounds offered in support of a knowledge claim." },
  { id: "explanation", name: "Explanation", desc: "An account of why or how something is the case, and what makes it satisfying." },
  { id: "objectivity", name: "Objectivity", desc: "The extent to which knowledge is independent of the particular knower." },
  { id: "perspective", name: "Perspective", desc: "The standpoint, shaped by culture, history, or position, from which a knower approaches knowledge." },
  { id: "culture", name: "Culture", desc: "The shared beliefs, values, and practices that shape what a community treats as knowledge." },
  { id: "values", name: "Values", desc: "The principles that guide judgements of what matters within and across AOKs." },
  { id: "responsibility", name: "Responsibility", desc: "The obligations a knower has in producing, sharing, and acting on knowledge." },
];

export function getConceptById(id) {
  return TOK_CONCEPTS.find((c) => c.id === id) || null;
}

export const TOK_CONCEPT_OPTIONS = TOK_CONCEPTS.map((c) => ({ value: c.id, label: c.name }));
