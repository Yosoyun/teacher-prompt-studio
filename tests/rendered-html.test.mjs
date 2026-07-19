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
  assert.match(html, /AI-ready masterpiece/);
  assert.match(html, /classroom command deck/i);
  assert.match(html, /Nothing is sent or stored/);
  assert.match(html, /Tune the intelligence/);
  assert.match(html, /Improve the AI/);
  assert.match(html, /Launch in your favourite AI/);
  assert.match(html, /INSTRUCTION PRIORITY/);
  assert.match(html, /EXECUTION PROTOCOL/);
  assert.match(html, /QUALITY GATES/);
  assert.match(html, /Question paper/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("keeps the prompt library broad and the old logic defects removed", async () => {
  const [data, engine, page, layout, presets] = await Promise.all([
    readFile(new URL("../app/prompt-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/prompt-engine.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/PromptStudio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/studio-presets.ts", import.meta.url), "utf8"),
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
  assert.match(engine, /REFERENCE DATA AND TRUST BOUNDARY/);
  assert.match(engine, /Generate at least three conceptually distinct approaches internally/);
  assert.match(engine, /JSON\.stringify/);
  assert.match(engine, /buildRefinements/);
  assert.match(engine, /Do not expose hidden chain-of-thought/);
  assert.match(page, /useMemo\(\s*\(\) => buildTeacherPrompt/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /STUDIO_RECIPES/);
  assert.match(page, /surpriseMe/);
  assert.match(page, /result\.refinements/);
  assert.match(page, /Print or save prompt as PDF/);
  assert.match(page, /AI_PROVIDERS/);
  assert.ok(
    (presets.match(/workflowId: "/g) ?? []).length >= 20,
    "expected at least 20 tap-first outcome recipes",
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
  assert.match(layout, /One-tap AI missions for Indian teachers/);
  assert.match(layout, /og-beast\.png/);
  assert.doesNotMatch(page, /scrollIntoView\(\).*buildTeacherPrompt/s);
});
