# Teacher Prompt Studio

Teacher Prompt Studio turns a teacher's real classroom job into a structured,
review-ready prompt for any AI tool. The redesigned command centre starts with
tap-first outcome recipes for question papers, DPPs, theory notes, mind maps,
formula sheets, lesson packs and more, then exposes 79 specialist workflows
across the complete teaching cycle.

Live site: https://yosoyun.github.io/teacher-prompt-studio/

Teachers can choose an Indian board or programme, class, subject and chapter,
then tune time, thinking level, prompt depth and practice volume with sliders.
The adaptive compiler builds an instruction hierarchy, aligns goals to
evidence, isolates pasted material as untrusted reference data, asks the target
AI to stress-test and repair its artifact, and generates a six-part follow-up
prompt pack for refinement. One-click actions copy the prompt and open ChatGPT,
Claude, Gemini, Google AI Studio, Grok, Perplexity or Copilot without placing
the prompt in a URL.

## Product principles

- A missing topic never silently becomes “full syllabus.”
- The prompt updates live, so copy and download can never use stale output.
- Exam rules, curriculum codes, sources, and statistics are never invented.
- Student information must be anonymized before it is added to a prompt.
- Accessibility, source fidelity, safety, and teacher review are built into the
  relevant workflows.
- Selected power-ups update both the instructions and the output contract.
- Source-sensitive workflows require or recommend the material they need.
- Readiness is explained across goal, learners, evidence, constraints,
  grounding, and design DNA.
- JEE, NEET, Olympiad, and other competitive exams remain available as a
  specialist, version-aware workflow rather than defining the entire product.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run lint
npm test
npm audit
```

`npm test` creates the production build and checks the rendered product and
workflow coverage.

## Deployment

The public site is deployed automatically to GitHub Pages from
`.github/workflows/deploy-pages.yml`. The project also retains the bundled
vinext and Cloudflare Sites structure; there are no database, upload, login, or
server-side persistence requirements.
