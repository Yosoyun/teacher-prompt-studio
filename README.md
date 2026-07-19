# Teacher Prompt Studio

Teacher Prompt Studio turns a teacher's real classroom job into a structured,
review-ready prompt for any AI tool. It includes 43 searchable workflows across
planning, teaching, assessment, resources, learner support, feedback,
communication, and professional practice.

## Product principles

- A missing topic never silently becomes “full syllabus.”
- The prompt updates live, so copy and download can never use stale output.
- Exam rules, curriculum codes, sources, and statistics are never invented.
- Student information must be anonymized before it is added to a prompt.
- Accessibility, source fidelity, safety, and teacher review are built into the
  relevant workflows.
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

The project uses the bundled vinext and Cloudflare Sites structure. Deployment
metadata lives in `.openai/hosting.json`; there are no database, upload, login,
or server-side persistence requirements.
