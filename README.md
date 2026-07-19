# Teacher Prompt Studio

Teacher Prompt Studio turns a teacher's real classroom job into a structured,
review-ready prompt for any AI tool. It includes 79 searchable workflows across
planning, teaching, assessment, resources, learner support, feedback,
communication, and professional practice.

The adaptive compiler now offers Precision, Expert, and Breakthrough modes. It
builds an instruction hierarchy, aligns goals to evidence, applies
workflow-specific methods, isolates pasted material as untrusted reference
data, asks the target AI to stress-test and repair its artifact, and generates
a six-part follow-up prompt pack for refinement.

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

The project uses the bundled vinext and Cloudflare Sites structure. Deployment
metadata lives in `.openai/hosting.json`; there are no database, upload, login,
or server-side persistence requirements.
