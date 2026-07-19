import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the teacher prompt studio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Teacher Prompt Studio/);
  assert.match(html, /Create the actual artifact/);
  assert.match(html, /No prompt writing/);
  assert.match(html, /Pick a ready teaching mission/);
  assert.match(html, /Nothing is sent by this site/);
  assert.match(html, /Live artifact blueprint/);
  assert.match(html, /PDF \+ DOCX bundle/);
  assert.match(html, /Question paper/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("keeps the prompt library broad and the old logic defects removed", async () => {
  const [data, engine, page, layout, presets, artifacts, stage, preflight, styles, assessmentSpec] = await Promise.all([
    readFile(new URL("../app/prompt-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/prompt-engine.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/PromptStudio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/studio-presets.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/artifact-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/ArtifactStage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/artifact-preflight.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/assessment-spec.ts", import.meta.url), "utf8"),
  ]);

  const workflowCount = (data.match(/workflow\(\{/g) ?? []).length;
  assert.ok(workflowCount >= 75, `expected at least 75 workflows, found ${workflowCount}`);

  const workflowIds = [...data.matchAll(/\bid: "([a-z0-9-]+)",\n\s+title:/g)].map(
    (match) => match[1],
  );
  assert.equal(
    new Set(workflowIds).size,
    workflowIds.length,
    "workflow ids must be unique",
  );

  for (const category of [
    "Plan",
    "Teach",
    "Assess",
    "Resources",
    "Support",
    "Feedback",
    "Communicate",
    "Professional",
  ]) {
    assert.match(data, new RegExp(`category: "${category}"`));
  }

  assert.match(data, /Competitive exam set/);
  assert.match(data, /Complete teaching pack/);
  assert.match(data, /Adaptive Socratic tutor/);
  assert.match(data, /Assessment quality audit/);
  assert.match(data, /Practitioner inquiry or action research/);
  assert.match(data, /Custom subject/);
  assert.match(engine, /An empty topic will never mean/);
  assert.match(engine, /INSTRUCTION PRIORITY/);
  assert.match(engine, /EXECUTION PROTOCOL/);
  assert.match(engine, /QUALITY GATES/);
  assert.match(engine, /REFERENCE DATA AND TRUST BOUNDARY/);
  assert.match(engine, /Generate at least three conceptually distinct approaches internally/);
  assert.match(engine, /JSON\.stringify/);
  assert.match(engine, /buildRefinements/);
  assert.match(engine, /Do not expose hidden chain-of-thought/);
  assert.match(engine, /MANDATORY FILE DELIVERY/);
  assert.match(engine, /Required attached files/);
  assert.doesNotMatch(engine, /`Required formats:/);
  assert.match(engine, /FILE FIREWALL — PHYSICAL AUDIENCE SEPARATION/);
  assert.match(engine, /requiresPhysicalAudienceSeparation/);
  assert.match(engine, /effectiveArtifactFiles/);
  assert.match(engine, /effectivePortableFallback/);
  assert.match(engine, /allowsControlledPlaceholders/);
  assert.match(engine, /compilePreflightGateLines\(input\.artifact, input\.outputLanguage, isAssessment, artifactFiles, controlledPlaceholders\)/);
  assert.match(engine, /LEDGERED FIELDS 6\/6/);
  assert.match(engine, /UNLISTED PLACEHOLDERS 0/);
  assert.match(engine, /Never merge learner and teacher content into one fallback file/);
  assert.doesNotMatch(engine, /Portable fallback: \$\{input\.artifact\.fallback\}/);
  assert.match(engine, /artifactManifest: artifactFiles/);
  assert.doesNotMatch(engine, /input\.artifact\.id === "worksheet-bundle"/);
  assert.match(engine, /ASSESSMENT BLUEPRINT — EXACT, NOT APPROXIMATE/);
  assert.match(engine, /ACADEMIC PUBLICATION STANDARD/);
  assert.match(engine, /LANGUAGE, FONT AND EXPORT PRODUCTION/);
  assert.match(engine, /STRICT ARTIFACT RELEASE GATE — PASS \/ FAIL \/ NOT_RUN/);
  assert.match(engine, /Never title or deliver one document as ‘Teacher Version \+ Student Version’/);
  assert.match(engine, /Keep the derivation and any assumption in teacher-only planning content/);
  assert.match(engine, /Do not satisfy this mission with ordinary chat prose/);
  assert.match(engine, /topic-substitution test/i);
  assert.match(engine, /PROVENANCE METADATA/);
  assert.match(engine, /studio-provenance: \$\{safeCreatorMarker\}/);
  assert.match(engine, /FILE-ONLY FINAL RETURN/);
  assert.match(page, /useMemo\(\s*\(\) => buildTeacherPrompt/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /STUDIO_RECIPES/);
  assert.match(page, /surpriseMe/);
  assert.match(page, /result\.refinements/);
  assert.match(page, /activeStep/);
  assert.match(page, /aria-current=/);
  assert.match(page, /ArtifactStage/);
  assert.match(page, /FOLLOW_UP_PATHS/);
  assert.match(page, /artifact\.actionLabel/);
  assert.match(page, /AI_PROVIDERS/);
  assert.match(page, /ASSESSMENT_PROFILES/);
  assert.match(page, /STRUCTURED_ITEM_WORKFLOW_IDS/);
  assert.match(page, /"quiz-test"/);
  assert.match(page, /"competitive-exam"/);
  assert.doesNotMatch(page, /selectedWorkflow\.flags\?\.includes\("assessment"\) \|\| artifactId === "worksheet-bundle"/);
  assert.match(page, /buildAssessmentSpec/);
  assert.match(assessmentSpec, /profile\.rows\[rowIndex\]\.weight <= 0 \|\| counts\[rowIndex\] > 0/);
  assert.match(assessmentSpec, /counts\[rowIndex\] = 1/);
  assert.match(page, /EXACTLY \$\{assessmentSpec\.totalItems\} items/);
  assert.match(page, /Exact item and mark totals are calculated automatically/);
  assert.doesNotMatch(page, /approximately \$\{questionCount\}/);
  assert.match(page, /expertDetailsRef\.current\.open = true/);
  assert.match(page, /textarea\.value = text/);
  assert.match(page, /aria-label="Thinking demand"/);
  assert.match(page, /aria-label="Question volume"/);
  assert.ok(
    (presets.match(/workflowId: "/g) ?? []).length >= 28,
    "expected at least 28 tap-first outcome recipes",
  );
  assert.match(presets, /Question paper/);
  assert.match(presets, /Daily practice problem pack/);
  assert.match(presets, /Resource fusion master pack/);
  assert.match(presets, /CBSE \/ NCERT/);
  assert.match(presets, /ICSE/);
  assert.match(presets, /ISC/);
  assert.match(presets, /ChatGPT/);
  assert.match(presets, /Claude/);
  assert.match(presets, /Gemini/);
  assert.match(presets, /Grok/);
  assert.match(presets, /Interactive concept simulation/);
  assert.match(presets, /Interactive chapter learning website/);
  assert.match(presets, /Easy-to-follow visual flowchart/);
  assert.match(presets, /Visual teacher brainstorm and decision lab/);
  assert.ok(
    (artifacts.match(/^    id: "/gm) ?? []).length >= 12,
    "expected at least 12 real artifact profiles",
  );
  for (const artifact of [
    "worksheet-bundle",
    "print-pdf",
    "editable-docx",
    "slide-deck",
    "visual-infographic",
    "flowchart-map",
    "interactive-website",
    "branching-simulation",
    "data-spreadsheet",
    "media-storyboard",
    "resource-bundle",
    "brainstorm-canvas",
  ]) {
    assert.match(artifacts, new RegExp(`id: "${artifact}"`));
  }
  assert.match(artifacts, /CREATOR_SIGNATURE = "Indrajeet Yadav"/);
  assert.match(artifacts, /filename: "student-paper\.pdf"/);
  assert.match(artifacts, /filename: "student-paper-editable\.docx"/);
  assert.match(artifacts, /filename: "teacher-assessment-pack\.pdf"/);
  assert.match(artifacts, /separate downloadable self-contained student-paper, editable-student-master and teacher-pack HTML files/);
  assert.match(artifacts, /mustExclude: \["answers or hints"/);
  assert.match(artifacts, /id: "academic-editorial"/);
  assert.match(artifacts, /id: "technical-institute"/);
  assert.match(artifacts, /id: "balanced-academic"/);
  assert.match(artifacts, /id: "application-rich"/);
  assert.match(artifacts, /id: "rapid-diagnostic"/);
  assert.match(artifacts, /Return the fully runnable self-contained HTML simulation file/);
  assert.match(stage, /Interactive flowchart blueprint preview/);
  assert.match(stage, /Interactive simulation blueprint preview/);
  assert.match(stage, /Teacher assessment pack/);
  assert.match(stage, /Placeholders 0/);
  assert.match(stage, /useState/);
  for (const gate of [
    "G01_MANIFEST",
    "G03_PLACEHOLDERS",
    "G04_META_LEAKAGE",
    "G05_AUDIENCE_FIREWALL",
    "G07_VISUAL_RENDER",
    "G09_PROFESSIONAL_LAYOUT",
    "G12_DELIVERY_EVIDENCE",
    "G13_ASSESSMENT_VALIDITY",
    "G14_MULTILINGUAL_RENDER",
    "F01_PDF",
    "F02_DOCX",
  ]) {
    assert.match(preflight, new RegExp(`id: "${gate}"`));
  }
  assert.match(preflight, /NOT_RUN is a failure/);
  assert.match(preflight, /Noto Sans Devanagari/);
  assert.match(preflight, /Noto Sans Bengali/);
  assert.match(preflight, /Noto Sans Tamil/);
  assert.match(preflight, /U\+FFFD/);
  assert.match(preflight, /tofu boxes/);
  assert.match(preflight, /placeholder scan count must equal zero/);
  assert.match(styles, /\.style-academic-editorial/);
  assert.match(styles, /\.style-technical-institute/);
  assert.match(styles, /\.assessment-profile-buttons/);
  assert.match(layout, /Create real teaching artifacts/);
  assert.match(layout, /og-beast\.png/);
  assert.doesNotMatch(page, /download.*teacher-prompt\.txt/s);
});

test("preserves every promised positive assessment row at the minimum size", async () => {
  const [{ ASSESSMENT_PROFILES }, { buildAssessmentSpec }] = await Promise.all([
    import("../app/artifact-data.ts"),
    import("../app/assessment-spec.ts"),
  ]);
  const rapid = ASSESSMENT_PROFILES.find((profile) => profile.id === "rapid-diagnostic");
  const result = buildAssessmentSpec(rapid, 5);

  assert.equal(result.totalItems, 5);
  assert.deepEqual(result.rows.map((row) => row.count), [3, 1, 1]);
  assert.equal(result.rows.reduce((total, row) => total + row.count, 0), 5);
});
