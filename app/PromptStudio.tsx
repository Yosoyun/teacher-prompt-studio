"use client";

import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  ADD_ONS,
  CATEGORY_META,
  LEVELS,
  SUBJECTS,
  WORKFLOW_CATEGORIES,
  WORKFLOWS,
  type PromptWorkflow,
  type WorkflowCategory,
} from "./prompt-data";
import {
  buildTeacherPrompt,
  type BuilderInput,
} from "./prompt-engine";

type CategoryFilter = "All" | WorkflowCategory;
type BuilderMode = "Quick" | "Advanced";

const DEFAULT_WORKFLOW = WORKFLOWS.find(
  (item) => item.id === "lesson-plan",
) as PromptWorkflow;

const initialForm = {
  subject: "Physics",
  customSubject: "",
  level: "Secondary / high school",
  customLevel: "",
  topic: "Newton's laws of motion",
  curriculum: "CBSE / NCERT",
  objective:
    "Plan a clear, engaging lesson that moves learners from prior knowledge to independent practice.",
  learnerContext: "Mixed-readiness class of 32 learners",
  priorKnowledge: "",
  duration: "45 minutes",
  modality: "In person",
  outputLanguage: "English",
  tone: "Clear, encouraging and professional",
  outputLength: "Practical classroom detail",
  details:
    "Use a short demonstration, pair discussion, guided practice and an exit check. Assume a board and everyday classroom materials only.",
  sourceMaterial: "",
};

type FormState = typeof initialForm;

function FieldNote({ children }: { children: React.ReactNode }) {
  return <span className="field-note">{children}</span>;
}

export default function PromptStudio() {
  const [selectedWorkflow, setSelectedWorkflow] =
    useState<PromptWorkflow>(DEFAULT_WORKFLOW);
  const [form, setForm] = useState<FormState>(initialForm);
  const [addOns, setAddOns] = useState<string[]>(
    DEFAULT_WORKFLOW.defaultAddOns,
  );
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<BuilderMode>("Quick");
  const [copyStatus, setCopyStatus] = useState("");
  const promptRef = useRef<HTMLTextAreaElement>(null);

  const builderInput: BuilderInput = useMemo(
    () => ({
      workflow: selectedWorkflow,
      ...form,
      addOns,
    }),
    [selectedWorkflow, form, addOns],
  );

  const result = useMemo(
    () => buildTeacherPrompt(builderInput),
    [builderInput],
  );

  const errors = result.issues.filter((issue) => issue.severity === "error");
  const warnings = result.issues.filter(
    (issue) => issue.severity === "warning",
  );

  const filteredWorkflows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return WORKFLOWS.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const searchable = `${item.title} ${item.summary} ${item.category}`.toLowerCase();
      return matchesCategory && (!query || searchable.includes(query));
    });
  }, [category, search]);

  const updateField =
    (field: keyof FormState) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setCopyStatus("");
    };

  const chooseWorkflow = (workflow: PromptWorkflow) => {
    setSelectedWorkflow(workflow);
    setForm((current) => ({
      ...current,
      objective: workflow.defaultGoal,
      details: "",
      sourceMaterial: "",
    }));
    setAddOns(workflow.defaultAddOns);
    setCopyStatus(`${workflow.title} starter applied.`);
  };

  const toggleAddOn = (id: string) => {
    setAddOns((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
    setCopyStatus("");
  };

  const focusFirstError = () => {
    const first = errors[0];
    if (!first?.field) return;
    const target = document.getElementById(`field-${first.field}`);
    target?.focus();
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const copyPrompt = async () => {
    if (errors.length) {
      setCopyStatus("Complete the required fields before copying.");
      focusFirstError();
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(result.prompt);
      } else {
        throw new Error("Clipboard API unavailable");
      }
      setCopyStatus("Prompt copied — paste it into your preferred AI tool.");
    } catch {
      const textarea = promptRef.current;
      if (!textarea) {
        setCopyStatus("Copy failed. Select the prompt text and copy it manually.");
        return;
      }
      textarea.focus();
      textarea.select();
      const copied = document.execCommand("copy");
      setCopyStatus(
        copied
          ? "Prompt copied — paste it into your preferred AI tool."
          : "Copy failed. The prompt is selected so you can copy it manually.",
      );
    }
  };

  const downloadPrompt = () => {
    if (errors.length) {
      setCopyStatus("Complete the required fields before downloading.");
      focusFirstError();
      return;
    }

    const blob = new Blob([result.prompt], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${selectedWorkflow.id}-teacher-prompt.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    setCopyStatus("Prompt downloaded as a text file.");
  };

  const resetBuilder = () => {
    setSelectedWorkflow(DEFAULT_WORKFLOW);
    setForm(initialForm);
    setAddOns(DEFAULT_WORKFLOW.defaultAddOns);
    setMode("Quick");
    setCopyStatus("Example restored.");
  };

  return (
    <main>
      <a className="skip-link" href="#builder">
        Skip to prompt builder
      </a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Teacher Prompt Studio home">
          <span className="brand-mark" aria-hidden="true">
            TP
          </span>
          <span>
            Teacher Prompt Studio
            <small>Built for real classrooms</small>
          </span>
        </a>
        <div className="header-actions">
          <span className="privacy-chip">
            <span aria-hidden="true">●</span> Nothing is sent or stored
          </span>
          <a className="header-link" href="#workflow-library">
            {WORKFLOWS.length} starters
          </a>
        </div>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow">
            JEE-grade precision <span aria-hidden="true">→</span> every subject
          </div>
          <h1 id="hero-title">
            Start with the <em>teaching job.</em>
            <br />We&apos;ll build the prompt.
          </h1>
          <p>
            Choose what you need, add your classroom context, and get a clear,
            review-ready prompt for any AI tool—without learning prompt jargon.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#builder">
              Build a prompt <span aria-hidden="true">↓</span>
            </a>
            <a className="text-link" href="#workflow-library">
              Browse all teaching workflows
            </a>
          </div>
        </div>
        <div className="hero-proof" aria-label="Coverage highlights">
          <div className="proof-card proof-card-main">
            <span className="proof-kicker">One studio</span>
            <strong>{WORKFLOWS.length}</strong>
            <span>teacher workflows</span>
          </div>
          <div className="proof-card proof-card-small">
            <span aria-hidden="true">✓</span>
            <p>
              <strong>Any subject</strong>
              <br />Early years to university
            </p>
          </div>
          <div className="proof-card proof-card-small proof-card-accent">
            <span aria-hidden="true">◇</span>
            <p>
              <strong>Safer prompts</strong>
              <br />Privacy, sources & review built in
            </p>
          </div>
        </div>
      </section>

      <section className="studio" id="builder" aria-labelledby="builder-title">
        <div className="studio-heading">
          <div>
            <span className="section-number">01</span>
            <p className="section-kicker">Prompt workspace</p>
            <h2 id="builder-title">Build from a teaching workflow</h2>
          </div>
          <div className="mode-switch" aria-label="Builder detail level">
            {(["Quick", "Advanced"] as BuilderMode[]).map((item) => (
              <button
                key={item}
                type="button"
                className={mode === item ? "active" : ""}
                aria-pressed={mode === item}
                onClick={() => setMode(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="workspace">
          <aside
            className="workflow-panel"
            id="workflow-library"
            aria-labelledby="workflow-heading"
          >
            <div className="panel-title-row">
              <div>
                <span className="panel-step">A</span>
                <h3 id="workflow-heading">Choose a starter</h3>
              </div>
              <span className="result-count">{filteredWorkflows.length}</span>
            </div>

            <label className="search-field">
              <span className="sr-only">Search prompt starters</span>
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search lesson, rubric, JEE…"
              />
            </label>

            <div className="category-scroll" aria-label="Workflow categories">
              {(["All", ...WORKFLOW_CATEGORIES] as CategoryFilter[]).map(
                (item) => (
                  <button
                    type="button"
                    key={item}
                    className={category === item ? "active" : ""}
                    aria-pressed={category === item}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>

            <div className="workflow-list">
              {filteredWorkflows.length ? (
                filteredWorkflows.map((workflow) => (
                  <button
                    type="button"
                    className={`workflow-card ${
                      selectedWorkflow.id === workflow.id ? "selected" : ""
                    }`}
                    key={workflow.id}
                    aria-pressed={selectedWorkflow.id === workflow.id}
                    onClick={() => chooseWorkflow(workflow)}
                  >
                    <span className="workflow-glyph" aria-hidden="true">
                      {workflow.glyph}
                    </span>
                    <span className="workflow-copy">
                      <strong>{workflow.title}</strong>
                      <small>{workflow.summary}</small>
                    </span>
                    <span className="workflow-arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                ))
              ) : (
                <div className="empty-state">
                  <strong>No starter found.</strong>
                  <p>Try “lesson”, “feedback”, “exam” or choose All.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setCategory("All");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </aside>

          <section className="brief-panel" aria-labelledby="brief-heading">
            <div className="panel-title-row brief-title-row">
              <div>
                <span className="panel-step">B</span>
                <h3 id="brief-heading">Add your context</h3>
              </div>
              <span className="selected-tag">{selectedWorkflow.title}</span>
            </div>

            <div className="selected-workflow-note">
              <span className="workflow-glyph" aria-hidden="true">
                {selectedWorkflow.glyph}
              </span>
              <div>
                <span>{selectedWorkflow.category}</span>
                <strong>{selectedWorkflow.summary}</strong>
              </div>
            </div>

            <div className="form-grid">
              <label className="field">
                <span>Subject / teaching area</span>
                <select
                  id="field-subject"
                  value={form.subject}
                  onChange={updateField("subject")}
                >
                  {SUBJECTS.map((subject) => (
                    <option key={subject}>{subject}</option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Learner level</span>
                <select
                  id="field-level"
                  value={form.level}
                  onChange={updateField("level")}
                >
                  {LEVELS.map((level) => (
                    <option key={level}>{level}</option>
                  ))}
                </select>
              </label>

              {form.subject === "Custom subject" && (
                <label className="field field-wide">
                  <span>Your subject or teaching area *</span>
                  <input
                    id="field-customSubject"
                    value={form.customSubject}
                    onChange={updateField("customSubject")}
                    placeholder="e.g. Marine engineering, Bharatanatyam, clinical communication"
                  />
                </label>
              )}

              {form.level === "Custom learner level" && (
                <label className="field field-wide">
                  <span>Your learner level or age range *</span>
                  <input
                    id="field-customLevel"
                    value={form.customLevel}
                    onChange={updateField("customLevel")}
                    placeholder="e.g. mixed-age adult beginners"
                  />
                </label>
              )}

              <label className="field field-wide">
                <span>Topic or scope *</span>
                <input
                  id="field-topic"
                  value={form.topic}
                  onChange={updateField("topic")}
                  placeholder="Be specific—an empty topic never means full syllabus"
                  aria-describedby="topic-note"
                />
                <FieldNote>
                  <span id="topic-note">
                    Name the chapter, skill, text, unit or communication topic.
                  </span>
                </FieldNote>
              </label>

              <label className="field field-wide">
                <span>Learning goal or purpose *</span>
                <textarea
                  id="field-objective"
                  rows={3}
                  value={form.objective}
                  onChange={updateField("objective")}
                  placeholder="What should learners understand, do or receive?"
                />
              </label>

              <label className="field">
                <span>Curriculum, standard or exam</span>
                <input
                  id="field-curriculum"
                  value={form.curriculum}
                  onChange={updateField("curriculum")}
                  placeholder="e.g. CBSE 2026, IB, custom"
                />
              </label>

              <label className="field">
                <span>Time available</span>
                <input
                  id="field-duration"
                  value={form.duration}
                  onChange={updateField("duration")}
                  placeholder="e.g. 45 minutes, 3 weeks"
                />
              </label>

              <label className="field field-wide">
                <span>Learner and class context</span>
                <textarea
                  id="field-learnerContext"
                  rows={2}
                  value={form.learnerContext}
                  onChange={updateField("learnerContext")}
                  placeholder="Class size, readiness, language and access needs—use no names or private data"
                />
                <FieldNote>
                  Keep learner information anonymous. Never paste names, contact
                  details, health records or identifiable IEP data.
                </FieldNote>
              </label>

              <label className="field field-wide">
                <span>{selectedWorkflow.detailLabel}</span>
                <textarea
                  id="field-details"
                  rows={3}
                  value={form.details}
                  onChange={updateField("details")}
                  placeholder={selectedWorkflow.detailPlaceholder}
                />
              </label>

              {mode === "Advanced" && (
                <div className="advanced-fields field-wide">
                  <div className="advanced-heading">
                    <span>Advanced context</span>
                    <small>Optional, but useful for higher-stakes work</small>
                  </div>

                  <label className="field field-wide">
                    <span>Prior knowledge or evidence</span>
                    <textarea
                      id="field-priorKnowledge"
                      rows={2}
                      value={form.priorKnowledge}
                      onChange={updateField("priorKnowledge")}
                      placeholder="What can learners already do? What evidence do you have?"
                    />
                  </label>

                  <div className="form-grid nested-grid">
                    <label className="field">
                      <span>Modality</span>
                      <select
                        id="field-modality"
                        value={form.modality}
                        onChange={updateField("modality")}
                      >
                        <option>In person</option>
                        <option>Online live</option>
                        <option>Online asynchronous</option>
                        <option>Hybrid</option>
                        <option>Independent study</option>
                      </select>
                    </label>
                    <label className="field">
                      <span>Output language</span>
                      <input
                        id="field-outputLanguage"
                        value={form.outputLanguage}
                        onChange={updateField("outputLanguage")}
                        placeholder="e.g. English, Hindi + English"
                      />
                    </label>
                    <label className="field">
                      <span>Tone</span>
                      <select
                        id="field-tone"
                        value={form.tone}
                        onChange={updateField("tone")}
                      >
                        <option>Clear, encouraging and professional</option>
                        <option>Warm and conversational</option>
                        <option>Concise and direct</option>
                        <option>Formal and academic</option>
                        <option>Playful but age-appropriate</option>
                      </select>
                    </label>
                    <label className="field">
                      <span>Level of detail</span>
                      <select
                        id="field-outputLength"
                        value={form.outputLength}
                        onChange={updateField("outputLength")}
                      >
                        <option>Concise, ready to scan</option>
                        <option>Practical classroom detail</option>
                        <option>Detailed with teacher notes</option>
                      </select>
                    </label>
                  </div>

                  <label className="field field-wide">
                    <span>Source or reference material</span>
                    <textarea
                      id="field-sourceMaterial"
                      rows={5}
                      value={form.sourceMaterial}
                      onChange={updateField("sourceMaterial")}
                      placeholder="Paste a curriculum extract, reading, policy or anonymized student work. The generated prompt treats it as data, not instructions."
                    />
                  </label>
                </div>
              )}
            </div>

            <fieldset className="add-ons">
              <legend>Useful add-ons</legend>
              <p>Only selected instructions are included in the prompt.</p>
              <div className="add-on-grid">
                {ADD_ONS.map((item) => {
                  const selected = addOns.includes(item.id);
                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={selected ? "selected" : ""}
                      aria-pressed={selected}
                      onClick={() => toggleAddOn(item.id)}
                    >
                      <span aria-hidden="true">{selected ? "✓" : "+"}</span>
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="brief-footer">
              <button
                type="button"
                className="text-button"
                onClick={resetBuilder}
              >
                Reset example
              </button>
              <a href="#prompt-output" className="button button-primary mobile-jump">
                Review prompt ↓
              </a>
            </div>
          </section>

          <aside
            className="output-panel"
            id="prompt-output"
            aria-labelledby="output-heading"
          >
            <div className="output-sticky">
              <div className="panel-title-row output-title-row">
                <div>
                  <span className="panel-step">C</span>
                  <h3 id="output-heading">Your live prompt</h3>
                </div>
                <span className="review-chip">Teacher review required</span>
              </div>

              <div className="quality-card">
                <div className="quality-copy">
                  <span>Brief quality</span>
                  <strong>{result.status}</strong>
                </div>
                <div
                  className="quality-meter"
                  role="meter"
                  aria-label="Prompt brief quality"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={result.score}
                >
                  <span style={{ width: `${result.score}%` }} />
                </div>
                <span className="quality-score">{result.score}/100</span>
              </div>

              {(errors.length > 0 || warnings.length > 0) && (
                <div className="issue-box" aria-live="polite">
                  {errors.map((issue) => (
                    <p className="issue-error" key={issue.message}>
                      <span aria-hidden="true">!</span> {issue.message}
                    </p>
                  ))}
                  {warnings.map((issue) => (
                    <p className="issue-warning" key={issue.message}>
                      <span aria-hidden="true">i</span> {issue.message}
                    </p>
                  ))}
                </div>
              )}

              <textarea
                ref={promptRef}
                className="prompt-preview"
                value={result.prompt}
                readOnly
                aria-label="Generated teacher prompt"
                spellCheck={false}
              />
              <pre className="print-prompt" aria-hidden="true">
                {result.prompt}
              </pre>

              <div className="output-actions">
                <button
                  type="button"
                  className="button button-primary copy-button"
                  onClick={copyPrompt}
                >
                  Copy prompt <span aria-hidden="true">⌘</span>
                </button>
                <button
                  type="button"
                  className="icon-button"
                  onClick={downloadPrompt}
                  aria-label="Download prompt as text file"
                  title="Download .txt"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => window.print()}
                  aria-label="Print or save prompt as PDF"
                  title="Print / save PDF"
                >
                  ⎙
                </button>
              </div>

              <p className="copy-status" aria-live="polite" role="status">
                {copyStatus || "Every edit updates this prompt immediately."}
              </p>

              <div className="privacy-note">
                <span aria-hidden="true">○</span>
                <p>
                  <strong>Private by design.</strong> This page builds text in
                  your browser. Review it, then choose where to paste it.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="coverage" aria-labelledby="coverage-title">
        <div className="coverage-heading">
          <span className="section-number">02</span>
          <p className="section-kicker">Designed around teacher work</p>
          <h2 id="coverage-title">One builder. The whole teaching cycle.</h2>
          <p>
            The old question-paper tool is now one specialist workflow inside a
            broader studio—from planning and explanation to feedback, family
            communication and professional reflection.
          </p>
        </div>
        <div className="coverage-grid">
          {WORKFLOW_CATEGORIES.map((item, index) => (
            <article key={item}>
              <span className="coverage-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{CATEGORY_META[item].label}</h3>
              <p>{CATEGORY_META[item].short}</p>
              <strong>
                {WORKFLOWS.filter((workflow) => workflow.category === item).length}
                <span> starters</span>
              </strong>
            </article>
          ))}
        </div>
      </section>

      <section className="principles" aria-labelledby="principles-title">
        <div className="principles-card">
          <div>
            <span className="section-number">03</span>
            <p className="section-kicker">Built-in guardrails</p>
            <h2 id="principles-title">Useful beats “perfect.”</h2>
            <p>
              No AI output is error-proof. Every prompt asks for checks,
              uncertainty flags, source honesty, accessible structure and a
              final teacher review.
            </p>
          </div>
          <ul>
            <li>
              <span>01</span>
              <div>
                <strong>No silent full-syllabus assumptions</strong>
                <p>Topic and purpose are required before copy or download.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>No stale output</strong>
                <p>The live prompt changes with every field and option.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>No invented official rules</strong>
                <p>Exam schemes, standards and sources must be supplied or verified.</p>
              </div>
            </li>
            <li>
              <span>04</span>
              <div>
                <strong>No private learner data</strong>
                <p>Feedback workflows explicitly require anonymized evidence.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <footer>
        <div className="brand footer-brand">
          <span className="brand-mark" aria-hidden="true">
            TP
          </span>
          <span>Teacher Prompt Studio</span>
        </div>
        <p>Created for teachers by Indrajeet Yadav · No login · No tracking</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
