/* ============================================
   data/advancedThemes.js
   Optional/contemporary TOK themes. The current Guide's
   official optional theme is "Knowledge and Technology";
   "Knowledge and Design" / "Knowledge and Computational
   Thinking" are included here as applied lenses some
   schools and IB resources use to extend the technology
   theme into design and computing contexts.
   ============================================ */

export const ADVANCED_THEMES = [
  {
    id: "technology",
    name: "Knowledge and Technology",
    isOfficial: true,
    shortDesc: "How technology mediates, extends, and constrains what and how we know.",
    focusQuestions: [
      "How does technology change the methods available to a knower?",
      "Who controls technological tools of knowledge production, and what power follows from that?",
      "Can a technological tool (e.g. an algorithm) be said to 'know' something, or only to process it?",
      "What is lost, as well as gained, when knowledge production is automated or mediated by technology?",
    ],
  },
  {
    id: "design",
    name: "Knowledge and Design",
    isOfficial: false,
    shortDesc: "Knowledge produced through, and embedded in, acts of designing and making.",
    focusQuestions: [
      "What kind of knowledge is generated through the iterative process of designing and prototyping?",
      "How do constraints (material, ethical, economic) shape what counts as a 'good' design solution?",
      "Is design knowledge tacit (embodied, hard to articulate) or explicit, and what follows from that?",
      "Whose needs and perspectives are designed for, and whose are designed out?",
    ],
  },
  {
    id: "computational-thinking",
    name: "Knowledge and Computational Thinking",
    isOfficial: false,
    shortDesc: "How computational methods — abstraction, decomposition, algorithms — shape knowledge claims.",
    focusQuestions: [
      "What is gained and lost when a real-world problem is abstracted into a computational model?",
      "How does algorithmic bias arise, and what does it reveal about the data used to build knowledge systems?",
      "Can computational/statistical pattern-finding count as 'understanding', or only correlation?",
      "What responsibilities do designers of computational systems have for the knowledge claims those systems produce?",
    ],
  },
];

export function getThemeById(id) {
  return ADVANCED_THEMES.find((t) => t.id === id) || null;
}

export const ADVANCED_THEME_OPTIONS = ADVANCED_THEMES.map((t) => ({ value: t.id, label: t.name }));
