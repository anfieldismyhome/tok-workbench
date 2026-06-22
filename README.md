# TOK Thinking Workbench

A free, browser-based prompt generator for IB Theory of Knowledge — helping students and teachers get more out of AI assistants for source analysis, knowledge questions, essays, exhibitions, and more.

**[→ Open the tool](https://yourusername.github.io/tok-workbench)** ← replace with your actual GitHub Pages URL once deployed

---

## What it does

TOK Thinking Workbench does not call any AI. It has no backend, no database, no API keys, and no login. Everything runs in your browser.

What it *does* do: it collects structured input from you (a source, a title, a claim, a reflection) and assembles a carefully engineered prompt — one that asks the right TOK questions in the right order, using the right vocabulary — that you then copy into whichever AI assistant your school uses.

The difference between a generic prompt ("analyse this source for my TOK essay") and a well-built one is significant. This tool builds the good version.

---

## Tools included

**Module 1 — Source Analysis**
- Source Analyzer
- AoK Example Analyzer
- Bias & Perspective Analyzer
- Knowledge Framework Lens

**Module 2 — Knowledge Question Development**
- KQ Builder
- KQ Generator
- Discussion Question Builder

**Module 3 — Essay Development**
- Essay Prescribed Title Unpacker
- AoK Compatibility Analysis
- AoK Pairing Analysis
- Counterclaim Builder

**Module 4 — Exhibition Development**
- Exhibition Prompt Unpacker
- Object Analysis Tool
- Object Selection Coach

**Module 5 — Reflection and Metacognition**
- Reflection Tool

**Module 6 — TOK Language**
- TOK Vocabulary Translator
- TOK Jargon Detector
- TOK to Simple Language
- Simple Language to TOK

---

## How to run locally

No installation required. No npm install. No build step.

```bash
git clone https://github.com/yourusername/tok-workbench.git
cd tok-workbench
python3 -m http.server 8080
```

Open `http://localhost:8080` in any browser.

> **Do not open `index.html` directly** (via double-click or `file://`). The ES module imports require a local server, even a minimal one like the Python one above.

---

## How to deploy (GitHub Pages)

1. Push this repo to GitHub (public repository)
2. Go to **Settings → Pages**
3. Under *Source*, select **Deploy from a branch**
4. Choose **main** branch, **/ (root)** folder
5. Click **Save**

Your site will be live at `https://yourusername.github.io/tok-workbench` within a minute or two.

---

## How to add a new tool

The architecture is deliberately declarative — adding a tool means writing data, not wiring up new plumbing.

**Step 1.** Add one entry to `assets/js/data/toolRegistry.js`:

```js
{ id: "my-new-tool", name: "My New Tool", desc: "One line description.", icon: "🔍", href: "tools/my-new-tool.html" }
```

**Step 2.** Create `assets/js/tools/myNewTool.js` with two exports:

```js
export const fields = [ /* field schema */ ];
export function generate(values) { /* return { promptText, whyItWorks, meta, filename } */ }
```

Copy any existing tool file as a starting point — they're all the same shape.

**Step 3.** Create `tools/my-new-tool.html` — copy any existing tool HTML and change three things: the `<title>`, the `<h1>` description, and the import path at the bottom.

The nav, landing page grid, CSS, form renderer, and output panel all pick it up automatically.

---

## Tech stack

| What | How |
|---|---|
| HTML / CSS / JS | Vanilla. No framework. No bundler. |
| Deployment | GitHub Pages (static, free) |
| Storage | None. Nothing is saved anywhere. |
| AI calls | None. This site generates prompts — it does not call any AI. |
| Dependencies | None at runtime. |

---

## Alignment with IB TOK

Built around the current IB TOK Guide:
- 8 Areas of Knowledge
- Knowledge Framework: Scope, Perspectives, Methods and Tools, Ethics
- 12 core TOK concepts (evidence, certainty, truth, interpretation, power, justification, explanation, objectivity, perspective, culture, values, responsibility)
- The 35 official IA prompts for the Exhibition (fixed, verified against IB Guide p.40)
- Optional themes including Knowledge and Technology, Knowledge and Design, Knowledge and Computational Thinking

This tool is not affiliated with or endorsed by the International Baccalaureate Organization.

---

## Contributing

Issues and pull requests welcome. If you're a TOK teacher and you want a tool that doesn't exist yet, open an issue describing it — the architecture makes additions straightforward.

---

## License

MIT — see [LICENSE](LICENSE) for details.
