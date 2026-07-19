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
  assert.match(html, /Start with the/);
  assert.match(html, /Prompt workspace/);
  assert.match(html, /Nothing is sent or stored/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("keeps the prompt library broad and the old logic defects removed", async () => {
  const [data, engine, page, layout] = await Promise.all([
    readFile(new URL("../app/prompt-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/prompt-engine.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/PromptStudio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  const workflowCount = (data.match(/workflow\(\{/g) ?? []).length;
  assert.ok(workflowCount >= 35, `expected at least 35 workflows, found ${workflowCount}`);

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
  assert.match(data, /Custom subject/);
  assert.match(engine, /An empty topic will never mean/);
  assert.match(engine, /Do not claim certainty or that the output is error-proof/);
  assert.match(engine, /reference_material/);
  assert.match(page, /useMemo\(\s*\(\) => buildTeacherPrompt/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /Print or save prompt as PDF/);
  assert.match(layout, /Teacher Prompt Studio \| Prompts for every classroom/);
  assert.doesNotMatch(page, /scrollIntoView\(\).*buildTeacherPrompt/s);
});
