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

function sourceSection(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0, `missing source marker: ${startMarker}`);
  assert.ok(end > start, `missing source marker after ${startMarker}: ${endMarker}`);
  return source.slice(start, end);
}

function assertSourceOrder(source, markers, message) {
  let previous = -1;
  for (const marker of markers) {
    const index = source.indexOf(marker, previous + 1);
    assert.ok(index > previous, `${message}: expected ${marker} after the previous gate`);
    previous = index;
  }
}

async function loadViteModule(modulePath) {
  const { createServer } = await import("vite");
  const server = await createServer({
    appType: "custom",
    configFile: false,
    logLevel: "silent",
    server: { middlewareMode: true },
  });
  try {
    return await server.ssrLoadModule(modulePath);
  } finally {
    await server.close();
  }
}

test("server-renders the teacher prompt studio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Teacher Prompt Studio/);
  assert.match(html, /dependable assessment bundle/);
  assert.match(html, /prompt stays backstage/);
  assert.match(html, /Pick a ready teaching mission/);
  assert.match(html, /Your prompt is not uploaded by this site/);
  assert.match(html, /Live artifact blueprint/);
  assert.match(html, /PDF \+ DOCX bundle/);
  assert.match(html, /Question paper/);
  assert.match(html, /Render-verified flagship sample/);
  assert.match(html, /class-10-quadratics-student-bilingual\.pdf/);
  assert.match(html, /class-10-quadratics-student-editable\.docx/);
  assert.match(html, /class-10-quadratics-teacher-pack-bilingual\.pdf/);
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
  assert.match(page, /current\.refinements/);
  assert.match(page, /activeStep/);
  assert.match(page, /aria-current=/);
  assert.match(page, /ArtifactStage/);
  assert.match(page, /FOLLOW_UP_PATHS/);
  assert.match(page, /artifact\.actionLabel/);
  assert.match(page, /AI_PROVIDERS/);
  assert.match(page, /data-testid="launch-ai-panel"/);
  assert.match(page, /launchProviders\.map/);
  assert.match(page, /Copy instructions & open/);
  assert.match(page, /prepareProvider\(provider\.id\)/);
  assert.match(page, /revealPromptForManualCopy/);
  assert.match(page, /technicalPromptRef\.current\.open = true/);
  assert.match(page, /window\.open\("about:blank", "_blank"\)/);
  assert.match(page, /launchWindow\.location\.replace\(provider\.url\)/);
  assert.match(page, /launchWindow\?\.close\(\)/);
  assert.match(page, /After copying, open \{manualProvider\.name\}/);
  assert.match(page, /if \(!launched\) recordImpactPrepared\(manualProvider\)/);
  assert.doesNotMatch(page, /href=\{provider\.url\}[\s\S]{0,180}prepareProvider/);
  const reserveTab = page.indexOf('window.open("about:blank", "_blank")');
  const copyInstructions = page.indexOf("await copyText(current.prompt)", reserveTab);
  const navigateProvider = page.indexOf("launchWindow.location.replace(provider.url)", copyInstructions);
  assert.ok(reserveTab >= 0 && reserveTab < copyInstructions && copyInstructions < navigateProvider,
    "provider navigation must wait until the copy attempt finishes");
  assert.doesNotMatch(page, /focusIssue\(currentErrors\[0\]\.field\)/);
  assert.doesNotMatch(page, /<details className="all-providers">/);
  assert.ok(
    page.indexOf('data-testid="launch-ai-panel"') < page.indexOf('className="launch-receipt"'),
    "Launch AI must appear before the delivery receipt",
  );
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
  assert.match(styles, /\.maker-actions \{[\s\S]*position: fixed/);
  assert.match(styles, /\.blueprint-panel \{[\s\S]*grid-row: 2/);
  assert.match(styles, /\.provider-cards > button/);
  assert.match(layout, /Dependable assessment production/);
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

test("keeps every AI handoff valid and every artifact recommendation resolvable", async () => {
  const [{ AI_PROVIDERS }, { ARTIFACT_PROFILES }] = await Promise.all([
    import("../app/studio-presets.ts"),
    import("../app/artifact-data.ts"),
  ]);
  const providerIds = new Set(AI_PROVIDERS.map((provider) => provider.id));

  assert.ok(AI_PROVIDERS.length >= 7);
  assert.deepEqual(
    ["chatgpt", "claude", "gemini", "aistudio"].map((id) => providerIds.has(id)),
    [true, true, true, true],
  );
  for (const provider of AI_PROVIDERS) {
    assert.match(provider.url, /^https:\/\//);
  }
  for (const artifact of ARTIFACT_PROFILES) {
    assert.ok(artifact.recommendedProviders.length > 0, `${artifact.id} needs a recommended AI`);
    for (const providerId of artifact.recommendedProviders) {
      assert.ok(providerIds.has(providerId), `${artifact.id} references missing provider ${providerId}`);
    }
  }
});

test("parses, updates and summarizes the device-local impact ledger deterministically", async () => {
  const {
    IMPACT_LEDGER_LIMIT,
    createImpactEntry,
    formatPilotSummary,
    parseImpactLedger,
    setImpactOutcome,
    summarizeImpact,
  } = await import("../app/impact-ledger.ts");

  const snapshot = (workflowId) => ({
    recipeId: `${workflowId}-recipe`,
    workflowId,
    artifactId: "worksheet-bundle",
    providerId: "chatgpt",
    boardId: "cbse",
    grade: 10,
    audienceMode: "school",
    classSize: 40,
    subject: "Mathematics",
    level: "Secondary / high school",
    topic: "Quadratic equations",
    outputLanguage: "English",
    timeIndex: 3,
    difficultyIndex: 1,
    questionCount: 20,
    finishId: "polished",
    visualStyleId: "academic-editorial",
    assessmentProfileId: "balanced-academic",
    addOns: ["answers"],
  });
  const create = (id, createdAt, workflowId) => createImpactEntry({
    mission: `${workflowId} mission`,
    artifactLabel: "PDF + DOCX bundle",
    providerName: "ChatGPT",
    classLabel: "Class 10",
    boardLabel: "CBSE / NCERT",
    subject: "Mathematics",
    language: "English",
    timeSaved: "2 hours",
    snapshot: snapshot(workflowId),
  }, new Date(createdAt), id);

  const usable = create("usable", "2026-07-19T10:00:00.000Z", "quiz-test");
  const repair = create("repair", "2026-07-18T10:00:00.000Z", "worksheet-homework");
  const textOnly = create("text-only", "2026-05-01T10:00:00.000Z", "question-bank");
  const awaiting = create("awaiting", "2026-07-17T10:00:00.000Z", "quiz-test");

  let entries = [repair, textOnly, usable, awaiting];
  entries = setImpactOutcome(entries, "usable", "usable", new Date("2026-07-19T11:00:00.000Z"));
  entries = setImpactOutcome(entries, "repair", "repair", new Date("2026-07-18T11:00:00.000Z"));
  entries = setImpactOutcome(entries, "text-only", "text-only", new Date("2026-05-01T11:00:00.000Z"));

  assert.equal(entries.find((entry) => entry.id === "usable")?.outcome, "usable");
  assert.equal(entries.find((entry) => entry.id === "usable")?.updatedAt, "2026-07-19T11:00:00.000Z");
  assert.equal(entries.find((entry) => entry.id === "awaiting")?.outcome, "prepared");

  const parsed = parseImpactLedger(JSON.stringify([
    { id: "invalid-entry" },
    ...entries,
  ]));
  assert.deepEqual(parsed.map((entry) => entry.id), ["usable", "repair", "awaiting", "text-only"]);
  assert.deepEqual(parseImpactLedger("not-json"), []);
  assert.deepEqual(parseImpactLedger(JSON.stringify({ entries })), []);

  const oversizedLedger = Array.from({ length: IMPACT_LEDGER_LIMIT + 5 }, (_, index) =>
    create(`bulk-${index}`, new Date(Date.UTC(2026, 0, 1, 0, 0, index)).toISOString(), "quiz-test"));
  const limited = parseImpactLedger(JSON.stringify(oversizedLedger));
  assert.equal(limited.length, IMPACT_LEDGER_LIMIT);
  assert.equal(limited[0].id, `bulk-${IMPACT_LEDGER_LIMIT + 4}`);

  const now = new Date("2026-07-20T10:00:00.000Z");
  const summary = summarizeImpact(parsed, now);
  assert.deepEqual(summary, {
    totalPrepared: 4,
    confirmedUsable: 1,
    needsRepair: 1,
    textOnly: 1,
    rated: 3,
    successRate: 33,
    uniqueWorkflows: 3,
    preparedLast30Days: 3,
  });
  const pilotSummary = formatPilotSummary(summary, now);
  assert.match(pilotSummary, /Usable-file rate among rated handoffs: 33%/);
  assert.match(pilotSummary, /anonymised, device-local activity record/);
  assert.match(pilotSummary, /not a global usage or revenue metric/);
});

test("blocks identifiable learner data as an error before any external handoff", async () => {
  const [{ WORKFLOWS }, { getArtifactProfile }, { validatePromptInput }] = await Promise.all([
    import("../app/prompt-data.ts"),
    import("../app/artifact-data.ts"),
    loadViteModule("/app/prompt-engine.ts"),
  ]);
  const workflow = WORKFLOWS.find((item) => item.id === "quiz-test");
  assert.ok(workflow);
  const input = {
    workflow,
    recipeId: "question-paper",
    artifact: getArtifactProfile("worksheet-bundle"),
    requiredOutputs: workflow.outputSections,
    visualStyle: "Scholarly university",
    interactionMode: "Guided",
    creatorSignature: "Teacher Prompt Studio",
    creatorMarker: "TPS-TEST",
    subject: "Mathematics",
    customSubject: "",
    level: "Secondary / high school",
    customLevel: "",
    topic: "Quadratic equations",
    curriculum: "CBSE / NCERT",
    objective: "Assess conceptual understanding and reasoning.",
    learnerContext: "Class 10 learner: student@example.com",
    priorKnowledge: "Linear equations",
    duration: "45 minutes",
    modality: "Print",
    outputLanguage: "English",
    tone: "Professional",
    outputLength: "Complete",
    details: "Original classroom assessment",
    sourceMaterial: "",
    taskMaterial: "",
    educatorRole: "Teacher",
    teachingSetting: "School classroom",
    countryRegion: "India",
    pedagogyLens: "Evidence informed",
    cognitiveDemand: "Application and reasoning",
    successEvidence: "Accurate solutions with justified reasoning",
    resourceLimits: "Ordinary A4 printer",
    mustAvoid: "No unsupported official claims",
    powerMode: "Expert",
    collaborationStyle: "Proceed intelligently with stated assumptions",
    outputForm: "Separate teacher and learner files",
    addOns: [],
  };

  const issues = validatePromptInput(input);
  const privacyIssue = issues.find((issue) => /personal identifier|email|phone/i.test(issue.message));
  assert.ok(privacyIssue, "identifiable learner data must produce a privacy issue");
  assert.equal(privacyIssue.severity, "error");
  assert.equal(privacyIssue.field, "taskMaterial");
  assert.match(privacyIssue.message, /Remove it before copying anything to an external AI provider/);
});

test("keeps validation ahead of copying and preserves the exact refinement on fallback", async () => {
  const [page, { FOLLOW_UP_PATHS }, { WORKFLOWS }, { getArtifactProfile }, { buildTeacherPrompt }] = await Promise.all([
    readFile(new URL("../app/PromptStudio.tsx", import.meta.url), "utf8"),
    import("../app/artifact-data.ts"),
    import("../app/prompt-data.ts"),
    import("../app/artifact-data.ts"),
    loadViteModule("/app/prompt-engine.ts"),
  ]);

  const providerHandoff = sourceSection(page, "const prepareProvider = async", "const copyPrompt = async");
  assertSourceOrder(providerHandoff, [
    "const current = currentPromptResult()",
    "const currentErrors = current.issues.filter",
    "if (currentErrors.length)",
    "return;",
    'window.open("about:blank", "_blank")',
    "await copyText(current.prompt)",
  ], "provider handoff validation");

  const copyOnly = sourceSection(page, "const copyPrompt = async", "const copyVisibleInstructions = async");
  assertSourceOrder(copyOnly, [
    "const current = currentPromptResult()",
    "const currentErrors = current.issues.filter",
    "if (currentErrors.length)",
    "return;",
    "await copyText(current.prompt)",
  ], "copy-only validation");

  const followUp = sourceSection(page, "const copyFollowUp = async", "const markImpactOutcome = async");
  assertSourceOrder(followUp, [
    "const current = currentPromptResult()",
    "current.refinements.find",
    "if (!refinement) return false",
    "await copyText(refinement.prompt)",
    "revealPromptForManualCopy(refinement.prompt",
  ], "exact refinement fallback");
  assert.doesNotMatch(followUp, /revealPromptForManualCopy\(result\.prompt/);

  const workflow = WORKFLOWS.find((item) => item.id === "quiz-test");
  assert.ok(workflow);
  const result = buildTeacherPrompt({
    workflow,
    recipeId: "question-paper",
    artifact: getArtifactProfile("worksheet-bundle"),
    requiredOutputs: workflow.outputSections,
    visualStyle: "Scholarly university",
    interactionMode: "Guided",
    creatorSignature: "Teacher Prompt Studio",
    creatorMarker: "TPS-TEST",
    subject: "Mathematics",
    customSubject: "",
    level: "Secondary / high school",
    customLevel: "",
    topic: "Quadratic equations",
    curriculum: "CBSE / NCERT",
    objective: "Assess conceptual understanding and reasoning.",
    learnerContext: "Class 10",
    priorKnowledge: "Linear equations",
    duration: "45 minutes",
    modality: "Print",
    outputLanguage: "English",
    tone: "Professional",
    outputLength: "Complete",
    details: "Original classroom assessment",
    sourceMaterial: "",
    taskMaterial: "",
    educatorRole: "Teacher",
    teachingSetting: "School classroom",
    countryRegion: "India",
    pedagogyLens: "Evidence informed",
    cognitiveDemand: "Application and reasoning",
    successEvidence: "Accurate solutions with justified reasoning",
    resourceLimits: "Ordinary A4 printer",
    mustAvoid: "No unsupported official claims",
    powerMode: "Expert",
    collaborationStyle: "Proceed intelligently with stated assumptions",
    outputForm: "Separate teacher and learner files",
    addOns: [],
  });
  const refinementMap = {
    repair: "audit-repair",
    visual: "visual",
    adapt: "adapt-access",
    deepen: "deepen",
    transform: "transform",
    share: "publish",
  };
  for (const path of FOLLOW_UP_PATHS) {
    const expected = result.refinements.find((item) => item.id === refinementMap[path.id]);
    assert.ok(expected, `${path.id} must resolve to one exact refinement`);
    assert.ok(expected.prompt.length > 100, `${path.id} fallback must retain the complete follow-up`);
  }
});

test("resets topic selection with the subject and keeps investor-demo claims honest", async () => {
  const [page, impactPanel, { SUBJECT_LAUNCHERS, TOPIC_BANK }] = await Promise.all([
    readFile(new URL("../app/PromptStudio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ImpactPanel.tsx", import.meta.url), "utf8"),
    import("../app/studio-presets.ts"),
  ]);
  const chooseSubject = sourceSection(page, "const chooseSubject =", "const chooseLanguage =");
  assertSourceOrder(chooseSubject, [
    "TOPIC_BANK[subject]?.[0]",
    "setForm((current)",
    "subject, topic: firstTopic",
  ], "subject and topic selection");
  for (const subject of SUBJECT_LAUNCHERS) {
    assert.ok(TOPIC_BANK[subject.label]?.[0], `${subject.label} needs a deterministic reset topic`);
  }
  assert.notEqual(TOPIC_BANK.Mathematics[0], TOPIC_BANK.Biology[0]);
  assert.match(page, /aria-checked=\{form\.subject === subject\.label\}/);
  assert.match(page, /<select value=\{form\.subject\} onChange=\{\(event\) => chooseSubject\(event\.target\.value\)\}>/);

  assert.match(page, /Estimated save · \$\{recipe\.timeSaved\}/);
  assert.match(page, /<em>\{index === 0 \? "Suggested" : recommended \? "Format fit" : "Available"\}<\/em>/);
  assert.match(page, /External AI handoff/);
  assert.match(page, /provider&apos;s privacy and file-generation limits apply/);
  assert.match(page, /file-generation support can vary by provider, plan and model/);
  assert.match(page, /Your answer stays on this device/);
  assert.match(page, /Build-brief readiness/);
  assert.doesNotMatch(page, /Best match for this file|Guaranteed file|guaranteed time saved/i);
  assert.match(impactPanel, /Source material and learner responses are never stored/);
  assert.match(impactPanel, /Private by default: this evidence stays in your browser/);
});

test("runs every release quality gate before the Pages build", async () => {
  const workflow = await readFile(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8");
  assertSourceOrder(workflow, [
    "npm ci",
    "npm run lint",
    "npm test",
    "npm audit --audit-level=high",
    "npm run build:pages",
    "touch dist-pages/.nojekyll",
  ], "GitHub Pages quality gates");
});

test("ships the complete render-verified flagship artifact bundle", async () => {
  const files = await Promise.all([
    readFile(new URL("../public/samples/class-10-quadratics-student-bilingual.pdf", import.meta.url)),
    readFile(new URL("../public/samples/class-10-quadratics-student-editable.docx", import.meta.url)),
    readFile(new URL("../public/samples/class-10-quadratics-teacher-pack-bilingual.pdf", import.meta.url)),
  ]);

  assert.ok(files[0].length > 100_000, "student PDF must be a substantive rendered file");
  assert.ok(files[1].length > 20_000, "editable DOCX must be a substantive Office file");
  assert.ok(files[2].length > 100_000, "teacher PDF must be a substantive rendered file");
  assert.equal(files[0].subarray(0, 4).toString(), "%PDF");
  assert.equal(files[1].subarray(0, 2).toString(), "PK");
  assert.equal(files[2].subarray(0, 4).toString(), "%PDF");
});
