/* ============================================
   data/knowledgeFramework.js
   The four Knowledge Framework lenses used to interrogate
   any Area of Knowledge, per the current TOK Guide.
   ============================================ */

export const KNOWLEDGE_FRAMEWORK = [
  {
    id: "scope",
    name: "Scope",
    guidingQuestions: [
      "What is this area of knowledge a study of, and what are its aims?",
      "What questions does this AOK try to answer, and which questions lie beyond it?",
      "How does this AOK relate to other AOKs, and where do boundaries blur?",
      "Why might this area of knowledge be of interest or importance?",
    ],
  },
  {
    id: "perspectives",
    name: "Perspectives",
    guidingQuestions: [
      "What can we learn from the perspectives of those who have contributed to this area of knowledge?",
      "What influence does the personal perspective of the knower have on what is produced or accepted as knowledge?",
      "Whose perspectives have been historically excluded or marginalised, and with what effect?",
      "How might dominant perspectives shape what counts as a legitimate question or method?",
    ],
  },
  {
    id: "methods-tools",
    name: "Methods and Tools",
    guidingQuestions: [
      "What are the methods or procedures used in this area of knowledge, and what assumptions underlie them?",
      "What tools are used to produce, record, or communicate knowledge in this area?",
      "How is the reliability of methods tested or justified within this AOK?",
      "How have changes in tools or technology shaped what can be known in this area?",
    ],
  },
  {
    id: "ethics",
    name: "Ethics",
    guidingQuestions: [
      "What are the ethical considerations involved in the production or application of knowledge in this area?",
      "What responsibilities, if any, do knowers in this area have towards others affected by their knowledge?",
      "Are there ethical principles unique to, or especially significant within, this AOK?",
      "How might the pursuit of knowledge in this area conflict with other values?",
    ],
  },
];

export function getFrameworkElement(id) {
  return KNOWLEDGE_FRAMEWORK.find((f) => f.id === id) || null;
}

export const KF_OPTIONS = KNOWLEDGE_FRAMEWORK.map((f) => ({ value: f.id, label: f.name }));
