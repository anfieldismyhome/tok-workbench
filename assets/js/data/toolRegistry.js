/* ============================================
   data/toolRegistry.js
   Single source of truth for every module + tool.
   Used to render the landing page grid and to build
   consistent breadcrumbs/nav across tool pages.
   Adding a new tool = add one entry here + its page.
   ============================================ */

export const MODULES = [
  {
    id: "source-analysis",
    name: "Source Analysis",
    desc: "Turn any real-world source into rigorous TOK analysis.",
    tools: [
      { id: "source-analyzer", name: "Source Analyzer", desc: "Surface knowledge claims and justification in any source.", icon: "🔎", href: "tools/source-analyzer.html" },
      { id: "aok-example-analyzer", name: "AoK Example Analyzer", desc: "Test how well a real-world example fits an Area of Knowledge.", icon: "📚", href: "tools/aok-example-analyzer.html" },
      { id: "bias-perspective-analyzer", name: "Bias & Perspective Analyzer", desc: "Identify whose perspective is present, missing, or assumed.", icon: "⚖", href: "tools/bias-perspective-analyzer.html" },
      { id: "knowledge-framework-lens", name: "Knowledge Framework Lens", desc: "Apply Scope, Perspectives, Methods & Tools, or Ethics to any topic.", icon: "🧭", href: "tools/knowledge-framework-lens.html" },
    ],
  },
  {
    id: "kq-development",
    name: "Knowledge Question Development",
    desc: "Build and refine the questions at the heart of TOK.",
    tools: [
      { id: "kq-builder", name: "KQ Builder", desc: "Construct a well-formed Knowledge Question step by step.", icon: "🛠", href: "tools/kq-builder.html" },
      { id: "kq-generator", name: "KQ Generator", desc: "Generate candidate Knowledge Questions from a topic or claim.", icon: "✨", href: "tools/kq-generator.html" },
      { id: "discussion-question-builder", name: "Discussion Question Builder", desc: "Create classroom discussion prompts that open TOK thinking.", icon: "💬", href: "tools/discussion-question-builder.html" },
    ],
  },
  {
    id: "essay-development",
    name: "Essay Development",
    desc: "Work the prescribed title from unpacking to counterclaim.",
    tools: [
      { id: "title-unpacker", name: "Essay Prescribed Title Unpacker", desc: "Break a prescribed title into its working parts.", icon: "📝", href: "tools/title-unpacker.html" },
      { id: "aok-compatibility", name: "AoK Compatibility Analysis", desc: "Test which AOKs genuinely fit a prescribed title.", icon: "🧩", href: "tools/aok-compatibility.html" },
      { id: "aok-pairing", name: "AoK Pairing Analysis", desc: "Explore productive tension between two AOKs for a title.", icon: "🔗", href: "tools/aok-pairing.html" },
      { id: "counterclaim-builder", name: "Counterclaim Builder", desc: "Build strong counterclaims and the response that follows.", icon: "↔", href: "tools/counterclaim-builder.html" },
    ],
  },
  {
    id: "exhibition-development",
    name: "Exhibition Development",
    desc: "From IA prompt to object commentary.",
    tools: [
      { id: "exhibition-prompt-unpacker", name: "Exhibition Prompt Unpacker", desc: "Unpack one of the 35 IA prompts into a working plan.", icon: "🖼", href: "tools/exhibition-prompt-unpacker.html" },
      { id: "object-analysis-tool", name: "Object Analysis Tool", desc: "Generate rigorous commentary linking an object to the IA prompt.", icon: "🔬", href: "tools/object-analysis-tool.html" },
      { id: "object-selection-coach", name: "Object Selection Coach", desc: "Decide which real-world objects best serve your IA prompt.", icon: "🎯", href: "tools/object-selection-coach.html" },
    ],
  },
  {
    id: "reflection",
    name: "Reflection and Metacognition",
    desc: "Think about your own thinking as a knower.",
    tools: [
      { id: "reflection-tool", name: "Reflection Tool", desc: "Generate a structured metacognitive reflection prompt.", icon: "🪞", href: "tools/reflection-tool.html" },
    ],
  },
  {
    id: "tok-language",
    name: "TOK Language",
    desc: "Move fluently between TOK register and plain English.",
    tools: [
      { id: "vocabulary-translator", name: "TOK Vocabulary Translator", desc: "Find the precise TOK term for an everyday idea.", icon: "🔤", href: "tools/vocabulary-translator.html" },
      { id: "jargon-detector", name: "TOK Jargon Detector", desc: "Spot empty or misused TOK jargon in your writing.", icon: "🚩", href: "tools/jargon-detector.html" },
      { id: "tok-to-simple", name: "TOK to Simple Language", desc: "Turn dense TOK writing into a plain-English explanation.", icon: "➡", href: "tools/tok-to-simple.html" },
      { id: "simple-to-tok", name: "Simple Language to TOK", desc: "Upgrade an everyday idea into precise TOK register.", icon: "⬅", href: "tools/simple-to-tok.html" },
    ],
  },
];

export function getAllTools() {
  return MODULES.flatMap((m) => m.tools.map((t) => ({ ...t, moduleId: m.id, moduleName: m.name })));
}

export function getToolById(id) {
  return getAllTools().find((t) => t.id === id) || null;
}
