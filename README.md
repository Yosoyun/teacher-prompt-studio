# Teacher Prompt Studio

Teacher Prompt Studio turns a teacher's real classroom job into an artifact-first
AI build brief. A focused four-step maker helps teachers choose the outcome, fit
it to their classroom, select real file formats and launch the job in a capable
AI without writing prompts. The prompt remains backstage.

Live site: https://yosoyun.github.io/teacher-prompt-studio/

Teachers can request coordinated PDF/DOCX bundles, print-ready PDFs, editable
documents, slide decks, infographics, flowcharts, learning websites, interactive
simulations, workbooks, media storyboards, brainstorm canvases and complete
resource packs. The compiler rejects ordinary chat prose, defines exact file and
production requirements, runs topic-specific originality tests, embeds a
metadata-only creator marker and supplies an easy same-chat improvement path.
The full library still includes 79 specialist workflows.

## Product principles

- A missing topic never silently becomes “full syllabus.”
- The hidden build instructions update live, so every AI handoff uses the latest choices.
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
