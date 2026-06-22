/* ============================================
   data/aoks.js
   The Areas of Knowledge (AOKs) as defined in the
   current IB TOK Guide, with supporting detail used
   to enrich generated prompts.
   ============================================ */

export const AOKS = [
  {
    id: "history",
    name: "History",
    shortDesc: "Knowledge of the past, built from evidence, interpretation, and narrative.",
    methods: ["primary and secondary source analysis", "corroboration", "causal reasoning", "periodisation", "historiography"],
    keyTerms: ["evidence", "bias", "narrative", "interpretation", "historical significance", "objectivity"],
    sampleTensions: [
      "the gap between what happened and what can be known to have happened",
      "how the historian's own position shapes the account",
      "whether history can ever be a 'science' of the past",
    ],
  },
  {
    id: "human-sciences",
    name: "The Human Sciences",
    shortDesc: "Systematic study of human behaviour, society, and the mind (e.g. psychology, economics, sociology).",
    methods: ["experiments", "surveys and statistics", "models", "case studies", "longitudinal studies"],
    keyTerms: ["reductionism", "correlation vs causation", "replication", "generalisation", "ethics of research on people"],
    sampleTensions: [
      "whether human behaviour can be studied with the same objectivity as the natural sciences",
      "the observer effect and reflexivity",
      "the limits of generalising from samples to populations",
    ],
  },
  {
    id: "natural-sciences",
    name: "The Natural Sciences",
    shortDesc: "Knowledge of the physical universe built through observation, experiment, and theory.",
    methods: ["controlled experiment", "hypothesis testing", "peer review", "mathematical modelling", "falsification"],
    keyTerms: ["empirical evidence", "paradigm", "falsifiability", "reproducibility", "theory-ladenness of observation"],
    sampleTensions: [
      "whether scientific knowledge is discovered or constructed",
      "the role of paradigm shifts in scientific progress",
      "the gap between scientific models and reality itself",
    ],
  },
  {
    id: "mathematics",
    name: "Mathematics",
    shortDesc: "Knowledge built through formal systems of axioms, proof, and deductive reasoning.",
    methods: ["axiomatic systems", "deductive proof", "abstraction", "symbolic representation"],
    keyTerms: ["proof", "axiom", "certainty", "abstraction", "consistency", "intuition"],
    sampleTensions: [
      "whether mathematical objects are discovered or invented",
      "the apparent 'unreasonable effectiveness' of mathematics in describing the physical world",
      "the role of intuition versus formal proof",
    ],
  },
  {
    id: "the-arts",
    name: "The Arts",
    shortDesc: "Knowledge and understanding generated and communicated through creative and aesthetic work.",
    methods: ["interpretation", "critique", "practice-based exploration", "symbolism and form"],
    keyTerms: ["aesthetic value", "interpretation", "intention", "expression", "representation"],
    sampleTensions: [
      "whether the arts produce 'knowledge' in the same sense other AOKs do",
      "the role of the audience's interpretation versus the artist's intention",
      "how cultural context shapes what counts as meaningful or beautiful",
    ],
  },
  {
    id: "ethics",
    name: "Ethics",
    shortDesc: "Knowledge and reasoning about what is right, good, and how we ought to act.",
    methods: ["moral reasoning", "case-based analysis", "application of ethical theories", "reflective equilibrium"],
    keyTerms: ["moral relativism", "moral realism", "duty", "consequence", "virtue", "justice"],
    sampleTensions: [
      "whether ethical claims can be known to be true or are simply matters of perspective",
      "how competing ethical frameworks (consequentialist, deontological, virtue-based) can reach different conclusions",
      "the relationship between ethical knowledge and action",
    ],
  },
  {
    id: "religious-knowledge-systems",
    name: "Religious Knowledge Systems",
    shortDesc: "Knowledge claims grounded in religious tradition, text, revelation, and practice.",
    methods: ["textual interpretation (hermeneutics)", "appeal to authority and tradition", "personal/communal experience", "theological reasoning"],
    keyTerms: ["faith", "revelation", "authority", "tradition", "interpretation", "sacred text"],
    sampleTensions: [
      "the relationship between faith and reason as ways of knowing",
      "how religious knowledge systems relate to personal versus shared knowledge",
      "diversity of interpretation within and across traditions",
    ],
  },
  {
    id: "indigenous-societies",
    name: "Indigenous Societies",
    shortDesc: "Knowledge systems developed and held by Indigenous communities, often place-based and intergenerational.",
    methods: ["oral tradition", "intergenerational transmission", "land- and practice-based learning", "communal verification"],
    keyTerms: ["oral tradition", "custodianship", "relationality", "place-based knowledge", "holistic knowledge"],
    sampleTensions: [
      "how knowledge held orally is preserved, verified, and can be lost",
      "the relationship between Indigenous knowledge systems and Western academic categories of 'knowledge'",
      "questions of ownership, access, and respect when non-members study Indigenous knowledge",
    ],
  },
];

export function getAokById(id) {
  return AOKS.find((a) => a.id === id) || null;
}

export const AOK_OPTIONS = AOKS.map((a) => ({ value: a.id, label: a.name }));
