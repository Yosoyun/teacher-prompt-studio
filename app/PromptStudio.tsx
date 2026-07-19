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
  COGNITIVE_DEMANDS,
  COLLABORATION_STYLES,
  EDUCATOR_ROLES,
  LEVELS,
  OUTPUT_FORMS,
  PEDAGOGY_LENSES,
  POWER_MODES,
  SUBJECTS,
  TEACHING_SETTINGS,
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
  taskMaterial: "",
  educatorRole: "Classroom teacher",
  teachingSetting: "Mainstream classroom",
  countryRegion: "",
  pedagogyLens: "Balanced and evidence-informed",
  cognitiveDemand: "Strategic application and reasoning",
  successEvidence: "",
  resourceLimits: "",
  mustAvoid: "",
  powerMode: "Expert",
  collaborationStyle: "Proceed intelligently with stated assumptions",
  outputForm: "Ready-to-use final artifact",
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
  const [showAllAddOns, setShowAllAddOns] = useState(false);
  const [workflowDrafts, setWorkflowDrafts] = useState<
    Record<string, Partial<FormState>>
  >({});
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
      const searchable = [
        item.title,
        item.summary,
        item.category,
        ...(item.aliases ?? []),
        ...item.taskRules,
        ...(item.expertMethod ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!query || searchable.includes(query));
    });
  }, [category, search]);

  const visibleAddOns = useMemo(() => {
    const priorityIds = new Set([
      ...selectedWorkflow.defaultAddOns,
      ...addOns,
      ...(selectedWorkflow.flags?.includes("assessment")
        ? ["integrity", "depth"]
        : []),
      ...(selectedWorkflow.flags?.includes("adaptation")
        ? ["accessibility", "culture"]
        : []),
      ...(selectedWorkflow.flags?.includes("sourceAware") ? ["sources"] : []),
    ]);
    const ordered = [
      ...ADD_ONS.filter((item) => priorityIds.has(item.id)),
      ...ADD_ONS.filter((item) => !priorityIds.has(item.id)),
    ];
    return showAllAddOns ? ordered : ordered.slice(0, 8);
  }, [addOns, selectedWorkflow, showAllAddOns]);

  const advancedSettingsActive = Boolean(
    form.priorKnowledge ||
      form.countryRegion ||
      form.successEvidence ||
      form.resourceLimits ||
      form.mustAvoid ||
      form.sourceMaterial ||
      form.taskMaterial ||
      form.collaborationStyle !== initialForm.collaborationStyle ||
      form.outputForm !== initialForm.outputForm,
  );

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
    const savedDraft = workflowDrafts[workflow.id];
    const classroomCategories = new Set([
      "Plan",
      "Teach",
      "Assess",
      "Resources",
      "Support",
      "Feedback",
    ]);
    const canCarryTeachingContext =
      classroomCategories.has(selectedWorkflow.category) &&
      classroomCategories.has(workflow.category);

    setWorkflowDrafts((current) => ({
      ...current,
      [selectedWorkflow.id]: {
        topic: form.topic,
        objective: form.objective,
        duration: form.duration,
        details: form.details,
        sourceMaterial: form.sourceMaterial,
        taskMaterial: form.taskMaterial,
        successEvidence: form.successEvidence,
        resourceLimits: form.resourceLimits,
        mustAvoid: form.mustAvoid,
      },
    }));
    setSelectedWorkflow(workflow);
    setForm((current) => ({
      ...current,
      topic: savedDraft?.topic ?? (canCarryTeachingContext ? current.topic : ""),
      objective: savedDraft?.objective ?? workflow.defaultGoal,
      duration:
        savedDraft?.duration ?? (canCarryTeachingContext ? current.duration : ""),
      details: savedDraft?.details ?? "",
      sourceMaterial: savedDraft?.sourceMaterial ?? "",
      taskMaterial: savedDraft?.taskMaterial ?? "",
      successEvidence: savedDraft?.successEvidence ?? "",
      resourceLimits: savedDraft?.resourceLimits ?? "",
      mustAvoid: savedDraft?.mustAvoid ?? "",
    }));
    setAddOns(workflow.defaultAddOns);
    setShowAllAddOns(false);
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
    focusIssue(first.field);
  };

  const focusIssue = (field?: keyof BuilderInput) => {
    if (!field) return;
    const advancedFields = new Set<keyof BuilderInput>([
      "priorKnowledge",
      "countryRegion",
      "successEvidence",
      "resourceLimits",
      "mustAvoid",
      "sourceMaterial",
      "taskMaterial",
      "collaborationStyle",
      "outputForm",
    ]);
    if (mode === "Quick" && advancedFields.has(field)) {
      setMode("Advanced");
    }
    window.setTimeout(() => {
      const target = document.getElementById(`field-${field}`);
      target?.focus();
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
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

  const copyRefinement = async (label: string, prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyStatus(`${label} follow-up copied.`);
    } catch {
      setCopyStatus("Could not copy the follow-up. Select and copy it manually from your browser.");
    }
  };

  const clearAdvancedSettings = () => {
    setForm((current) => ({
      ...current,
      priorKnowledge: "",
      countryRegion: "",
      successEvidence: "",
      resourceLimits: "",
      mustAvoid: "",
      sourceMaterial: "",
      taskMaterial: "",
      collaborationStyle: initialForm.collaborationStyle,
      outputForm: initialForm.outputForm,
    }));
    setCopyStatus("Advanced settings cleared.");
  };

  const resetBuilder = () => {
    setSelectedWorkflow(DEFAULT_WORKFLOW);
    setForm(initialForm);
    setAddOns(DEFAULT_WORKFLOW.defaultAddOns);
    setMode("Quick");
    setCategory("All");
    setSearch("");
    setShowAllAddOns(false);
    setWorkflowDrafts({});
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
            {WORKFLOWS.length} expert workflows
          </a>
        </div>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow">
            Adaptive prompt architecture <span aria-hidden="true">→</span> every teacher
          </div>
          <h1 id="hero-title">
            Describe the <em>teaching challenge.</em>
            <br />Get a prompt that thinks ahead.
          </h1>
          <p>
            The studio turns your context into an expert prompt with pedagogy,
            cognitive demand, evidence, constraints, source boundaries and a
            built-in audit—ready for any capable AI tool.
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
              <strong>Brainier by design</strong>
              <br />Diagnose, create, stress-test & repair
            </p>
          </div>
        </div>
      </section>

      <section className="studio" id="builder" aria-labelledby="builder-title">
        <div className="studio-heading">
          <div>
            <span className="section-number">01</span>
            <p className="section-kicker">Prompt workspace</p>
            <h2 id="builder-title">Engineer a remarkable teaching prompt</h2>
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

        {mode === "Quick" && advancedSettingsActive && (
          <div className="advanced-active-banner" role="status">
            <span>Advanced settings are still shaping this prompt.</span>
            <div>
              <button type="button" onClick={() => setMode("Advanced")}>
                Review
              </button>
              <button type="button" onClick={clearAdvancedSettings}>
                Clear
              </button>
            </div>
          </div>
        )}

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
              <span className="result-count" aria-live="polite">
                {filteredWorkflows.length}
                <span className="sr-only"> workflows found</span>
              </span>
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

            <fieldset className="power-mode-picker">
              <legend>Choose the prompt intelligence</legend>
              <p>Each level changes the reasoning architecture, not just the length.</p>
              <div className="power-mode-grid">
                {POWER_MODES.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={form.powerMode === item.id ? "selected" : ""}
                    aria-pressed={form.powerMode === item.id}
                    onClick={() => {
                      setForm((current) => ({ ...current, powerMode: item.id }));
                      setCopyStatus("");
                    }}
                  >
                    <strong>{item.title}</strong>
                    <span>{item.summary}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="form-grid">
              <label className="field">
                <span>Educator role</span>
                <input
                  id="field-educatorRole"
                  list="educator-role-options"
                  value={form.educatorRole}
                  onChange={updateField("educatorRole")}
                  placeholder="Choose or type any educator role"
                />
                <datalist id="educator-role-options">
                  {EDUCATOR_ROLES.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </datalist>
              </label>

              <label className="field">
                <span>Teaching setting</span>
                <input
                  id="field-teachingSetting"
                  list="teaching-setting-options"
                  value={form.teachingSetting}
                  onChange={updateField("teachingSetting")}
                  placeholder="Choose or type any setting"
                />
                <datalist id="teaching-setting-options">
                  {TEACHING_SETTINGS.map((setting) => (
                    <option key={setting}>{setting}</option>
                  ))}
                </datalist>
              </label>

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
                    required
                    aria-required="true"
                    aria-invalid={!form.customSubject}
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
                    required
                    aria-required="true"
                    aria-invalid={!form.customLevel}
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
                  required
                  aria-required="true"
                  aria-invalid={!form.topic.trim()}
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
                  required
                  aria-required="true"
                  aria-invalid={!form.objective.trim()}
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

              <label className="field">
                <span>Pedagogical lens</span>
                <select
                  id="field-pedagogyLens"
                  value={form.pedagogyLens}
                  onChange={updateField("pedagogyLens")}
                >
                  {PEDAGOGY_LENSES.map((lens) => (
                    <option key={lens}>{lens}</option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Cognitive demand</span>
                <select
                  id="field-cognitiveDemand"
                  value={form.cognitiveDemand}
                  onChange={updateField("cognitiveDemand")}
                >
                  {COGNITIVE_DEMANDS.map((demand) => (
                    <option key={demand}>{demand}</option>
                  ))}
                </select>
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

                  <label className="field field-wide">
                    <span>What would count as success?</span>
                    <textarea
                      id="field-successEvidence"
                      rows={2}
                      value={form.successEvidence}
                      onChange={updateField("successEvidence")}
                      placeholder="Name the observable learner action, audience response, product quality or decision the result should enable."
                    />
                  </label>

                  <div className="form-grid nested-grid">
                    <label className="field">
                      <span>Country, region or system</span>
                      <input
                        id="field-countryRegion"
                        value={form.countryRegion}
                        onChange={updateField("countryRegion")}
                        placeholder="e.g. India, Scotland, Ontario"
                      />
                    </label>
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

                  <div className="form-grid nested-grid">
                    <label className="field">
                      <span>Resources and practical limits</span>
                      <textarea
                        id="field-resourceLimits"
                        rows={3}
                        value={form.resourceLimits}
                        onChange={updateField("resourceLimits")}
                        placeholder="Space, materials, devices, bandwidth, staffing, budget or printing limits"
                      />
                    </label>
                    <label className="field">
                      <span>Must avoid or preserve</span>
                      <textarea
                        id="field-mustAvoid"
                        rows={3}
                        value={form.mustAvoid}
                        onChange={updateField("mustAvoid")}
                        placeholder="e.g. no invented citations; preserve the rubric; avoid public performance"
                      />
                    </label>
                    <label className="field">
                      <span>How should the AI collaborate?</span>
                      <select
                        id="field-collaborationStyle"
                        value={form.collaborationStyle}
                        onChange={updateField("collaborationStyle")}
                      >
                        {COLLABORATION_STYLES.map((style) => (
                          <option key={style}>{style}</option>
                        ))}
                      </select>
                    </label>
                    <label className="field">
                      <span>Output form</span>
                      <select
                        id="field-outputForm"
                        value={form.outputForm}
                        onChange={updateField("outputForm")}
                      >
                        {OUTPUT_FORMS.map((formName) => (
                          <option key={formName}>{formName}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="field field-wide">
                    <span>Task material to analyse or transform</span>
                    <textarea
                      id="field-taskMaterial"
                      rows={5}
                      value={form.taskMaterial}
                      onChange={updateField("taskMaterial")}
                      placeholder="Paste the anonymised student work, existing assessment, lesson, assignment, data or draft being analysed. It is encoded as untrusted reference data."
                    />
                  </label>

                  <label className="field field-wide">
                    <span>Authoritative source or reference material</span>
                    <textarea
                      id="field-sourceMaterial"
                      rows={5}
                      value={form.sourceMaterial}
                      onChange={updateField("sourceMaterial")}
                      placeholder="Paste a curriculum extract, reading, rubric, policy or verified reference. The generated prompt treats it as data, not instructions."
                    />
                  </label>
                </div>
              )}
            </div>

            <fieldset className="add-ons">
              <legend>Contextual power-ups</legend>
              <p>Recommended options appear first. Each selected power-up also updates the output contract.</p>
              <div className="add-on-grid">
                {visibleAddOns.map((item) => {
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
              <button
                type="button"
                className="more-add-ons"
                onClick={() => setShowAllAddOns((current) => !current)}
              >
                {showAllAddOns
                  ? "Show recommended only"
                  : `Show all ${ADD_ONS.length} power-ups`}
              </button>
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
                  <span>Brief readiness</span>
                  <strong>{result.status}</strong>
                </div>
                <div
                  className="quality-meter"
                  role="meter"
                  aria-label="Prompt brief readiness"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={result.score}
                >
                  <span style={{ width: `${result.score}%` }} />
                </div>
                <span className="quality-score">{result.score}/100</span>
              </div>

              <div className="prompt-dna" aria-label="Prompt readiness dimensions">
                {result.readiness.map((dimension) => (
                  <span
                    key={dimension.id}
                    className={dimension.ready ? "ready" : "needs-work"}
                    title={dimension.ready ? `${dimension.label} is ready` : dimension.hint}
                  >
                    <i aria-hidden="true">{dimension.ready ? "✓" : "·"}</i>
                    {dimension.label}
                  </span>
                ))}
              </div>

              {(errors.length > 0 || warnings.length > 0) && (
                <div className="issue-box" aria-live="polite">
                  {errors.map((issue) => (
                    <button
                      type="button"
                      className="issue-error"
                      key={issue.message}
                      onClick={() => focusIssue(issue.field)}
                    >
                      <span aria-hidden="true">!</span> {issue.message}
                    </button>
                  ))}
                  {warnings.map((issue) => (
                    <button
                      type="button"
                      className="issue-warning"
                      key={issue.message}
                      onClick={() => focusIssue(issue.field)}
                    >
                      <span aria-hidden="true">i</span> {issue.message}
                    </button>
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

              <div className="refinement-pack">
                <div className="refinement-heading">
                  <span>Follow-up prompt pack</span>
                  <strong>Go further without starting over</strong>
                </div>
                <div className="refinement-grid">
                  {result.refinements.map((refinement) => (
                    <button
                      type="button"
                      key={refinement.id}
                      onClick={() =>
                        copyRefinement(refinement.label, refinement.prompt)
                      }
                    >
                      <strong>{refinement.label}</strong>
                      <span>{refinement.description}</span>
                    </button>
                  ))}
                </div>
              </div>

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

      <section className="intelligence" aria-labelledby="intelligence-title">
        <div className="intelligence-heading">
          <span className="section-number">02</span>
          <p className="section-kicker">The intelligence layer</p>
          <h2 id="intelligence-title">More than a longer prompt.</h2>
          <p>
            The compiler builds an instruction hierarchy, aligns the goal to
            evidence, applies a subject-appropriate method, then asks the AI to
            verify and repair its own result before returning it.
          </p>
        </div>
        <div className="intelligence-grid">
          <article>
            <span>01</span>
            <strong>Diagnose first</strong>
            <p>Finds missing facts, contradictions, source gaps and validity risks.</p>
          </article>
          <article>
            <span>02</span>
            <strong>Design with intent</strong>
            <p>Connects learner action, evidence, pedagogy and cognitive demand.</p>
          </article>
          <article>
            <span>03</span>
            <strong>Diverge intelligently</strong>
            <p>Breakthrough mode compares genuinely different routes before synthesising.</p>
          </article>
          <article>
            <span>04</span>
            <strong>Stress-test and repair</strong>
            <p>Checks truth, feasibility, access, totals and internal coherence.</p>
          </article>
        </div>
      </section>

      <section className="coverage" aria-labelledby="coverage-title">
        <div className="coverage-heading">
          <span className="section-number">03</span>
          <p className="section-kicker">Designed around teacher work</p>
          <h2 id="coverage-title">One builder. The whole teaching cycle.</h2>
          <p>
            From play-based learning and clinical skills to JEE practice,
            university courses, family conferences and action research—each
            workflow has its own method and quality gates.
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
            <span className="section-number">04</span>
            <p className="section-kicker">Built-in guardrails</p>
            <h2 id="principles-title">Useful beats “perfect.”</h2>
            <p>
              No AI output is error-proof. Every prompt now includes a trust
              boundary, uncertainty protocol, workflow-specific checks and a
              final teacher verification ledger.
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
                <strong>No hidden reference instructions</strong>
                <p>Pasted content is encoded as untrusted data, never command text.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>No one-pass complacency</strong>
                <p>Expert modes diagnose, build, stress-test and repair before returning.</p>
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
