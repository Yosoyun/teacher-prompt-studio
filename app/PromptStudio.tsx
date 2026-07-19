"use client";

import {
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  ADD_ONS,
  CATEGORY_META,
  COGNITIVE_DEMANDS,
  COLLABORATION_STYLES,
  OUTPUT_FORMS,
  PEDAGOGY_LENSES,
  SUBJECTS,
  WORKFLOW_CATEGORIES,
  WORKFLOWS,
  type PromptWorkflow,
  type WorkflowCategory,
} from "./prompt-data";
import { buildTeacherPrompt, type BuilderInput } from "./prompt-engine";
import {
  AI_PROVIDERS,
  BOARD_OPTIONS,
  DEPTH_OPTIONS,
  DIFFICULTY_OPTIONS,
  ECOSYSTEM_TOOLS,
  LANGUAGE_OPTIONS,
  RECIPE_CATEGORIES,
  STUDIO_RECIPES,
  SUBJECT_LAUNCHERS,
  TIME_OPTIONS,
  TOPIC_BANK,
  type RecipeCategory,
  type StudioRecipe,
} from "./studio-presets";

type CategoryFilter = "All" | WorkflowCategory;
type PromptView = "overview" | "full";
type AudienceMode = "school" | "early" | "undergraduate" | "vocational" | "adult";

const DEFAULT_RECIPE = STUDIO_RECIPES[0];
const DEFAULT_WORKFLOW = WORKFLOWS.find(
  (item) => item.id === DEFAULT_RECIPE.workflowId,
) as PromptWorkflow;

const initialForm = {
  subject: "Mathematics",
  customSubject: "",
  level: "Secondary / high school",
  customLevel: "",
  topic: "Quadratic equations",
  curriculum: "CBSE / NCERT",
  objective: DEFAULT_RECIPE.objective,
  learnerContext: "Class 10, mixed-readiness group of 40 learners",
  priorKnowledge: "",
  duration: "45 minutes",
  modality: "In person",
  outputLanguage: "English",
  tone: "Clear, encouraging and professional",
  outputLength: "Practical classroom detail",
  details: DEFAULT_RECIPE.details,
  sourceMaterial: "",
  taskMaterial: "",
  educatorRole: "Classroom teacher",
  teachingSetting: "Mainstream classroom",
  countryRegion: "India",
  pedagogyLens: "Balanced and evidence-informed",
  cognitiveDemand: DIFFICULTY_OPTIONS[1].value,
  successEvidence: "",
  resourceLimits: "Board, paper and commonly available classroom materials",
  mustAvoid: "Do not invent current board patterns, syllabus codes, marks or official claims.",
  powerMode: DEFAULT_RECIPE.powerMode ?? "Expert",
  collaborationStyle: "Proceed intelligently with stated assumptions",
  outputForm: "Teacher version and learner-facing version",
};

type FormState = typeof initialForm;

const unique = (items: string[]) => [...new Set(items)];

const gradeToLevel = (grade: number) => {
  if (grade <= 5) return "Primary / elementary";
  if (grade <= 8) return "Middle school";
  if (grade <= 10) return "Secondary / high school";
  return "Senior secondary / exam prep";
};

function HelpTip({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="help-tip">
      <summary aria-label={`Why ${title} matters`}>?</summary>
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </details>
  );
}

function OrbitVisual({ recipe }: { recipe: StudioRecipe | undefined }) {
  const orbitItems = [
    { label: "Paper + key", className: "orbit-card orbit-card-a", glyph: "QP" },
    { label: "Daily DPP", className: "orbit-card orbit-card-b", glyph: "DP" },
    { label: "Mind map", className: "orbit-card orbit-card-c", glyph: "MM" },
    { label: "Theory notes", className: "orbit-card orbit-card-d", glyph: "TN" },
    { label: "Formula sheet", className: "orbit-card orbit-card-e", glyph: "FX" },
    { label: "Doubt solver", className: "orbit-card orbit-card-f", glyph: "ST" },
  ];

  return (
    <div className="orbit-visual" aria-label="Teaching outcomes orbiting the prompt engine">
      <div className="orbit-glow" />
      <div className="orbit-ring orbit-ring-one" />
      <div className="orbit-ring orbit-ring-two" />
      <div className="orbit-ring orbit-ring-three" />
      <div className="engine-core">
        <span className="engine-kicker">शिक्षा × AI</span>
        <strong>{recipe?.glyph ?? "79"}</strong>
        <span>{recipe?.shortTitle ?? "expert workflows"}</span>
      </div>
      {orbitItems.map((item) => (
        <div className={item.className} key={item.label}>
          <span>{item.glyph}</span>
          <strong>{item.label}</strong>
        </div>
      ))}
      <div className="orbit-status">
        <i aria-hidden="true" />
        Classroom engine online
      </div>
    </div>
  );
}

function SliderCard({
  label,
  valueLabel,
  note,
  children,
}: {
  label: string;
  valueLabel: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <div className="slider-card">
      <div className="slider-card-head">
        <span>{label}</span>
        <strong>{valueLabel}</strong>
      </div>
      {children}
      <p>{note}</p>
    </div>
  );
}

export default function PromptStudio() {
  const [selectedWorkflow, setSelectedWorkflow] =
    useState<PromptWorkflow>(DEFAULT_WORKFLOW);
  const [selectedRecipeId, setSelectedRecipeId] = useState(DEFAULT_RECIPE.id);
  const [recipeCategory, setRecipeCategory] =
    useState<RecipeCategory>("Popular");
  const [form, setForm] = useState<FormState>(initialForm);
  const [addOns, setAddOns] = useState<string[]>(
    unique([...DEFAULT_WORKFLOW.defaultAddOns, ...DEFAULT_RECIPE.addOns]),
  );
  const [boardId, setBoardId] = useState("cbse");
  const [grade, setGrade] = useState(10);
  const [audienceMode, setAudienceMode] = useState<AudienceMode>("school");
  const [classSize, setClassSize] = useState(40);
  const [timeIndex, setTimeIndex] = useState(3);
  const [difficultyIndex, setDifficultyIndex] = useState(1);
  const [depthIndex, setDepthIndex] = useState(1);
  const [questionCount, setQuestionCount] = useState(20);
  const [copyStatus, setCopyStatus] = useState("");
  const [promptView, setPromptView] = useState<PromptView>("overview");
  const [attemptedAction, setAttemptedAction] = useState(false);
  const [workflowSearch, setWorkflowSearch] = useState("");
  const [workflowCategory, setWorkflowCategory] =
    useState<CategoryFilter>("All");
  const [showAllRecipes, setShowAllRecipes] = useState(false);
  const [showAllAddOns, setShowAllAddOns] = useState(false);
  const [surpriseKey, setSurpriseKey] = useState(0);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  const selectedRecipe = STUDIO_RECIPES.find(
    (recipe) => recipe.id === selectedRecipeId,
  );
  const selectedBoard = BOARD_OPTIONS.find((board) => board.id === boardId);
  const topicSuggestions = TOPIC_BANK[form.subject] ?? [
    "Introduce a new concept",
    "Revision of a difficult chapter",
    "Application and problem solving",
    "End-of-unit assessment",
  ];

  const builderInput: BuilderInput = useMemo(
    () => ({
      workflow: selectedWorkflow,
      ...form,
      learnerContext:
        audienceMode === "school"
          ? `Class ${grade}, ${classSize} learners. ${form.learnerContext}`
          : `${form.level}, ${classSize} learners. ${form.learnerContext}`,
      details: `${form.details}\n\nPreset controls: target approximately ${questionCount} questions or learning checks when the artifact uses countable items; ${DIFFICULTY_OPTIONS[difficultyIndex].label.toLowerCase()} demand; ${DEPTH_OPTIONS[depthIndex].label.toLowerCase()} output depth. Treat these as design guidance, not a forced count where the chosen artifact is not item-based.`,
      addOns,
    }),
    [
      selectedWorkflow,
      form,
      grade,
      audienceMode,
      classSize,
      questionCount,
      difficultyIndex,
      depthIndex,
      addOns,
    ],
  );

  const deferredBuilderInput = useDeferredValue(builderInput);
  const result = useMemo(
    () => buildTeacherPrompt(deferredBuilderInput),
    [deferredBuilderInput],
  );

  const errors = result.issues.filter((issue) => issue.severity === "error");
  const warnings = result.issues.filter(
    (issue) => issue.severity === "warning",
  );

  const visibleRecipes = useMemo(() => {
    const filtered = STUDIO_RECIPES.filter(
      (recipe) => recipe.category === recipeCategory,
    );
    return showAllRecipes ? filtered : filtered.slice(0, 6);
  }, [recipeCategory, showAllRecipes]);

  const filteredWorkflows = useMemo(() => {
    const tokens = workflowSearch.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return WORKFLOWS.filter((workflow) => {
      if (workflowCategory !== "All" && workflow.category !== workflowCategory) {
        return false;
      }
      if (!tokens.length) return true;
      const haystack = [
        workflow.title,
        workflow.summary,
        workflow.category,
        ...(workflow.aliases ?? []),
        ...workflow.taskRules,
      ]
        .join(" ")
        .toLowerCase();
      return tokens.every((token) => haystack.includes(token));
    });
  }, [workflowCategory, workflowSearch]);

  const recommendedAddOns = useMemo(() => {
    const priority = new Set([
      ...selectedWorkflow.defaultAddOns,
      ...addOns,
      ...(selectedRecipe?.addOns ?? []),
    ]);
    const ordered = [
      ...ADD_ONS.filter((item) => priority.has(item.id)),
      ...ADD_ONS.filter((item) => !priority.has(item.id)),
    ];
    return showAllAddOns ? ordered : ordered.slice(0, 8);
  }, [addOns, selectedRecipe, selectedWorkflow, showAllAddOns]);

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

  const applyRecipe = (recipe: StudioRecipe) => {
    const workflow = WORKFLOWS.find((item) => item.id === recipe.workflowId);
    if (!workflow) return;
    setSelectedRecipeId(recipe.id);
    setSelectedWorkflow(workflow);
    setForm((current) => ({
      ...current,
      objective: recipe.objective,
      details: recipe.details,
      powerMode: recipe.powerMode ?? "Expert",
      outputForm:
        recipe.category === "Assess" || recipe.id.includes("paper")
          ? "Teacher version and learner-facing version"
          : current.outputForm,
    }));
    setAddOns(unique([...workflow.defaultAddOns, ...recipe.addOns]));
    setPromptView("overview");
    setCopyStatus(`${recipe.shortTitle} recipe loaded. Your prompt is already taking shape.`);
  };

  const chooseWorkflow = (workflow: PromptWorkflow) => {
    setSelectedRecipeId("");
    setSelectedWorkflow(workflow);
    setForm((current) => ({
      ...current,
      objective: workflow.defaultGoal,
      details: "",
    }));
    setAddOns(workflow.defaultAddOns);
    setCopyStatus(`${workflow.title} expert workflow loaded.`);
    document.getElementById("builder")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const chooseBoard = (id: string) => {
    const resolvedId =
      id === "icse" && grade > 10
        ? "isc"
        : id === "isc" && grade <= 10
          ? "icse"
          : id;
    const board = BOARD_OPTIONS.find((item) => item.id === resolvedId);
    if (!board) return;
    setBoardId(resolvedId);
    setForm((current) => ({
      ...current,
      curriculum: board.value,
      countryRegion: "India",
    }));
    setCopyStatus(
      resolvedId !== id
        ? `${board.label} selected to match Class ${grade}.`
        : "",
    );
  };

  const chooseSubject = (subject: string) => {
    const firstTopic = TOPIC_BANK[subject]?.[0] ?? form.topic;
    setForm((current) => ({
      ...current,
      subject,
      topic: firstTopic,
    }));
    setCopyStatus("");
  };

  const chooseLanguage = (language: string) => {
    setForm((current) => ({ ...current, outputLanguage: language }));
    if (language !== "English") {
      setAddOns((current) => unique([...current, "translation"]));
    }
    setCopyStatus("");
  };

  const changeGrade = (event: ChangeEvent<HTMLInputElement>) => {
    const nextGrade = Number(event.target.value);
    setGrade(nextGrade);
    setAudienceMode("school");
    const nextBoardId =
      nextGrade > 10 && boardId === "icse"
        ? "isc"
        : nextGrade <= 10 && boardId === "isc"
          ? "icse"
          : boardId;
    const nextBoard = BOARD_OPTIONS.find((item) => item.id === nextBoardId);
    setBoardId(nextBoardId);
    setForm((current) => ({
      ...current,
      level: gradeToLevel(nextGrade),
      curriculum: nextBoard?.value ?? current.curriculum,
      learnerContext: `Mixed-readiness class with familiar school routines`,
    }));
    setCopyStatus("");
  };

  const chooseAudienceMode = (mode: AudienceMode) => {
    const levelByMode: Record<Exclude<AudienceMode, "school">, string> = {
      early: "Early years / preschool",
      undergraduate: "Undergraduate",
      vocational: "Vocational / technical",
      adult: "Adult / professional learning",
    };
    if (mode === "school") {
      setAudienceMode("school");
      setForm((current) => ({ ...current, level: gradeToLevel(grade) }));
      return;
    }
    setAudienceMode(mode);
    setForm((current) => ({
      ...current,
      level: levelByMode[mode],
      learnerContext: "Mixed-readiness learners with varied prior experience",
    }));
    setCopyStatus("");
  };

  const changeClassSize = (event: ChangeEvent<HTMLInputElement>) => {
    setClassSize(Number(event.target.value));
    setCopyStatus("");
  };

  const changeTime = (event: ChangeEvent<HTMLInputElement>) => {
    const nextIndex = Number(event.target.value);
    setTimeIndex(nextIndex);
    setForm((current) => ({
      ...current,
      duration: `${TIME_OPTIONS[nextIndex]} minutes`,
    }));
    setCopyStatus("");
  };

  const changeDifficulty = (event: ChangeEvent<HTMLInputElement>) => {
    const nextIndex = Number(event.target.value);
    setDifficultyIndex(nextIndex);
    setForm((current) => ({
      ...current,
      cognitiveDemand: DIFFICULTY_OPTIONS[nextIndex].value,
    }));
    setCopyStatus("");
  };

  const changeDepth = (event: ChangeEvent<HTMLInputElement>) => {
    const nextIndex = Number(event.target.value);
    setDepthIndex(nextIndex);
    setForm((current) => ({
      ...current,
      powerMode: DEPTH_OPTIONS[nextIndex].powerMode,
      outputLength: DEPTH_OPTIONS[nextIndex].length,
    }));
    setCopyStatus("");
  };

  const toggleAddOn = (id: string) => {
    setAddOns((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
    setCopyStatus("");
  };

  const focusIssue = (field?: keyof BuilderInput) => {
    if (!field) return;
    window.setTimeout(() => {
      const target = document.getElementById(`field-${field}`);
      target?.focus();
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  const currentPromptResult = () => buildTeacherPrompt(builderInput);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const textarea = promptRef.current;
      if (!textarea) return false;
      textarea.focus();
      textarea.select();
      return document.execCommand("copy");
    }
  };

  const copyPrompt = async () => {
    setAttemptedAction(true);
    const current = currentPromptResult();
    const currentErrors = current.issues.filter(
      (issue) => issue.severity === "error",
    );
    if (currentErrors.length) {
      setCopyStatus("One essential detail is missing. Tap the message to fix it.");
      focusIssue(currentErrors[0].field);
      return;
    }
    const copied = await copyText(current.prompt);
    setCopyStatus(
      copied
        ? "Prompt copied. Choose an AI below or paste it wherever you work."
        : "Copy was blocked. The full prompt is selected for manual copying.",
    );
  };

  const prepareProvider = (
    event: MouseEvent<HTMLAnchorElement>,
    providerName: string,
  ) => {
    setAttemptedAction(true);
    const current = currentPromptResult();
    const currentErrors = current.issues.filter(
      (issue) => issue.severity === "error",
    );
    if (currentErrors.length) {
      event.preventDefault();
      setCopyStatus("Add the missing essential detail before opening an AI tool.");
      focusIssue(currentErrors[0].field);
      return;
    }

    void copyText(current.prompt).then((copied) => {
      setCopyStatus(
        copied
          ? `${providerName} opened in a new tab. Your prompt is copied—paste once to begin.`
          : `Copy was blocked. Use Copy prompt, then open ${providerName} again.`,
      );
    });
  };

  const downloadPrompt = () => {
    setAttemptedAction(true);
    const current = currentPromptResult();
    if (current.issues.some((issue) => issue.severity === "error")) {
      setCopyStatus("Complete the essential details before downloading.");
      return;
    }
    const blob = new Blob([current.prompt], {
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
    const copied = await copyText(prompt);
    setCopyStatus(
      copied
        ? `${label} follow-up copied.`
        : "Could not copy that follow-up. Open the full prompt and copy manually.",
    );
  };

  const surpriseMe = () => {
    const recipe = STUDIO_RECIPES[Math.floor(Math.random() * STUDIO_RECIPES.length)];
    const subject =
      SUBJECT_LAUNCHERS[Math.floor(Math.random() * SUBJECT_LAUNCHERS.length)].label;
    const topicList = TOPIC_BANK[subject] ?? ["A high-value teaching topic"];
    const topic = topicList[Math.floor(Math.random() * topicList.length)];
    const nextGrade = 6 + Math.floor(Math.random() * 7);
    const nextDifficulty = Math.floor(Math.random() * DIFFICULTY_OPTIONS.length);
    const nextDepth = 1 + Math.floor(Math.random() * 3);
    const workflow = WORKFLOWS.find((item) => item.id === recipe.workflowId);
    if (!workflow) return;

    setSelectedRecipeId(recipe.id);
    setSelectedWorkflow(workflow);
    setGrade(nextGrade);
    setAudienceMode("school");
    setDifficultyIndex(nextDifficulty);
    setDepthIndex(nextDepth);
    setRecipeCategory(recipe.category);
    setForm((current) => ({
      ...current,
      subject,
      topic,
      level: gradeToLevel(nextGrade),
      objective: recipe.objective,
      details: recipe.details,
      cognitiveDemand: DIFFICULTY_OPTIONS[nextDifficulty].value,
      powerMode: DEPTH_OPTIONS[nextDepth].powerMode,
      outputLength: DEPTH_OPTIONS[nextDepth].length,
    }));
    setAddOns(unique([...workflow.defaultAddOns, ...recipe.addOns]));
    setSurpriseKey((current) => current + 1);
    setCopyStatus(
      `Surprise recipe: ${recipe.shortTitle} for Class ${nextGrade} ${subject}.`,
    );
  };

  const resetBuilder = () => {
    setSelectedWorkflow(DEFAULT_WORKFLOW);
    setSelectedRecipeId(DEFAULT_RECIPE.id);
    setRecipeCategory("Popular");
    setForm(initialForm);
    setAddOns(unique([...DEFAULT_WORKFLOW.defaultAddOns, ...DEFAULT_RECIPE.addOns]));
    setBoardId("cbse");
    setGrade(10);
    setAudienceMode("school");
    setClassSize(40);
    setTimeIndex(3);
    setDifficultyIndex(1);
    setDepthIndex(1);
    setQuestionCount(20);
    setPromptView("overview");
    setAttemptedAction(false);
    setCopyStatus("Starter restored.");
  };

  const readinessStyle = {
    "--readiness": `${result.score * 3.6}deg`,
  } as CSSProperties;

  return (
    <main className="command-shell">
      <a className="skip-link" href="#builder">
        Skip to prompt builder
      </a>

      <div className="ambient-grid" aria-hidden="true" />
      <header className="command-nav">
        <a className="command-brand" href="#top" aria-label="Teacher Prompt Studio home">
          <span className="brand-orbit" aria-hidden="true">
            <i />
            TP
          </span>
          <span>
            <strong>Teacher Prompt Studio</strong>
            <small>Indian classroom command centre</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#recipes">Recipes</a>
          <a href="#builder">Build</a>
          <a href="#workflow-vault">79 workflows</a>
        </nav>
        <div className="nav-actions">
          <span className="privacy-pill">
            <i aria-hidden="true" /> Nothing is sent or stored
          </span>
          <button type="button" className="surprise-mini" onClick={surpriseMe}>
            <span aria-hidden="true">✦</span> Surprise me
          </button>
        </div>
      </header>

      <section className="beast-hero" id="top" aria-labelledby="hero-title">
        <div className="hero-radiance hero-radiance-one" aria-hidden="true" />
        <div className="hero-radiance hero-radiance-two" aria-hidden="true" />
        <div className="beast-hero-copy">
          <div className="hero-badge">
            <span>Built for India</span>
            <i />
            CBSE · ICSE · ISC · State · IB · Cambridge
          </div>
          <h1 id="hero-title">
            From classroom idea to <em>AI-ready masterpiece</em> in under a minute.
          </h1>
          <p>
            Pick an outcome. Tap your class and board. Slide the depth. The studio
            builds the pedagogy, blueprint, safeguards, answers and quality checks
            for you—no prompt-engineering knowledge needed.
          </p>
          <div className="hero-actions">
            <a className="beast-button beast-button-primary" href="#recipes">
              Choose a ready recipe <span aria-hidden="true">↓</span>
            </a>
            <button type="button" className="beast-button beast-button-ghost" onClick={surpriseMe}>
              <span aria-hidden="true">✦</span> Generate a random mission
            </button>
          </div>
          <div className="hero-trust" aria-label="Product promises">
            <span><strong>79</strong> expert engines</span>
            <span><strong>5</strong> quick choices</span>
            <span><strong>0</strong> data uploaded</span>
          </div>
        </div>
        <div className="hero-orbit-wrap" key={surpriseKey}>
          <OrbitVisual recipe={selectedRecipe} />
        </div>
      </section>

      <div className="kinetic-strip" aria-hidden="true">
        <div>
          <span>QUESTION PAPERS</span><i>✦</i><span>DPPs</span><i>✦</i>
          <span>THEORY NOTES</span><i>✦</i><span>MIND MAPS</span><i>✦</i>
          <span>FORMULA SHEETS</span><i>✦</i><span>LESSON PACKS</span><i>✦</i>
          <span>QUESTION PAPERS</span><i>✦</i><span>DPPs</span><i>✦</i>
          <span>THEORY NOTES</span><i>✦</i><span>MIND MAPS</span><i>✦</i>
          <span>FORMULA SHEETS</span><i>✦</i><span>LESSON PACKS</span><i>✦</i>
        </div>
      </div>

      <section className="recipe-launcher" id="recipes" aria-labelledby="recipes-title">
        <div className="section-heading section-heading-light">
          <div>
            <span className="step-chip">01 · Start with the finish</span>
            <h2 id="recipes-title">What do you want ready today?</h2>
            <p>
              Every card is a complete expert recipe. Tap once and the right workflow,
              checks, output sections and power-ups load automatically.
            </p>
          </div>
          <button type="button" className="random-card-button" onClick={surpriseMe}>
            <span aria-hidden="true">✦</span>
            <strong>Random mission</strong>
            <small>Let the studio surprise you</small>
          </button>
        </div>

        <div className="recipe-tabs" role="tablist" aria-label="Recipe categories">
          {RECIPE_CATEGORIES.map((category) => (
            <button
              type="button"
              key={category}
              role="tab"
              aria-selected={recipeCategory === category}
              className={recipeCategory === category ? "active" : ""}
              onClick={() => {
                setRecipeCategory(category);
                setShowAllRecipes(false);
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="recipe-grid">
          {visibleRecipes.map((recipe) => {
            const selected = selectedRecipeId === recipe.id;
            return (
              <article
                key={recipe.id}
                className={`recipe-card accent-${recipe.accent} ${selected ? "selected" : ""}`}
              >
                <button
                  type="button"
                  className="recipe-select"
                  aria-pressed={selected}
                  onClick={() => applyRecipe(recipe)}
                >
                  <span className="recipe-topline">
                    <span className="recipe-glyph">{recipe.glyph}</span>
                    <span className="recipe-time">Saves {recipe.timeSaved}</span>
                  </span>
                  <strong>{recipe.shortTitle}</strong>
                  <span className="recipe-summary">{recipe.summary}</span>
                  <span className="recipe-deliverables">
                    {recipe.outputs.slice(0, 3).join(" · ")}
                  </span>
                  <span className="recipe-cta">
                    {selected ? "Loaded ✓" : "Build this"} <i aria-hidden="true">→</i>
                  </span>
                </button>
                <details className="recipe-explanation">
                  <summary>Why this recipe works</summary>
                  <p>{recipe.explanation}</p>
                </details>
              </article>
            );
          })}
        </div>

        {STUDIO_RECIPES.filter((recipe) => recipe.category === recipeCategory).length > 6 && (
          <button
            type="button"
            className="show-more-recipes"
            onClick={() => setShowAllRecipes((current) => !current)}
          >
            {showAllRecipes ? "Show the essentials" : `Show every ${recipeCategory.toLowerCase()} recipe`}
          </button>
        )}
      </section>

      <section className="studio-command" id="builder" aria-labelledby="builder-title">
        <div className="command-heading">
          <div>
            <span className="step-chip step-chip-dark">02 · Make it yours</span>
            <h2 id="builder-title">Your classroom command deck</h2>
            <p>Most teachers only need the highlighted controls. Everything else is already intelligently set.</p>
          </div>
          <div className="journey-track" aria-label="Four-step creation journey">
            <span className="done"><i>1</i> Outcome</span>
            <span className="active"><i>2</i> Class</span>
            <span><i>3</i> Tune</span>
            <span><i>4</i> Launch</span>
          </div>
        </div>

        <div className="command-layout">
          <div className="control-deck">
            <section className="control-block" aria-labelledby="classroom-fit-title">
              <div className="control-block-heading">
                <div>
                  <span className="control-number">A</span>
                  <div>
                    <h3 id="classroom-fit-title">Fit my classroom</h3>
                    <p>Tap your system, class and subject. The prompt rewrites itself live.</p>
                  </div>
                </div>
                <HelpTip title="Classroom fit">
                  Board, stage and subject change language, examples, workload and verification boundaries. Exact official patterns still require a current teacher-supplied blueprint.
                </HelpTip>
              </div>

              <div className="choice-group">
                <div className="choice-label">
                  <span>Board or programme</span>
                  <small>{selectedBoard?.help}</small>
                </div>
                <div className="choice-pills board-pills" role="radiogroup" aria-label="Board or programme">
                  {BOARD_OPTIONS.map((board) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={boardId === board.id}
                      className={boardId === board.id ? "selected" : ""}
                      key={board.id}
                      onClick={() => chooseBoard(board.id)}
                    >
                      <i aria-hidden="true" /> {board.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="dual-sliders">
                <SliderCard
                  label="Learner stage"
                  valueLabel={audienceMode === "school" ? `Class ${grade}` : form.level}
                  note={audienceMode === "school" ? (grade <= 5 ? "Primary stage" : grade <= 8 ? "Middle stage" : grade <= 10 ? "Secondary stage" : "Senior secondary stage") : "The workflow will use age- and setting-appropriate conventions."}
                >
                  <input
                    type="range"
                    min={1}
                    max={12}
                    step={1}
                    value={grade}
                    onChange={changeGrade}
                    aria-label="Class level"
                  />
                  <div className="range-ticks"><span>1</span><span>6</span><span>10</span><span>12</span></div>
                </SliderCard>
                <SliderCard
                  label="Class size"
                  valueLabel={`${classSize} learners`}
                  note={classSize >= 45 ? "Large-class routines will be prioritised." : "Grouping and teacher attention will be planned realistically."}
                >
                  <input
                    type="range"
                    min={10}
                    max={60}
                    step={5}
                    value={classSize}
                    onChange={changeClassSize}
                    aria-label="Class size"
                  />
                  <div className="range-ticks"><span>10</span><span>30</span><span>45</span><span>60</span></div>
                </SliderCard>
              </div>

              <div className="stage-shortcuts" role="radiogroup" aria-label="Alternative learner stages">
                <span>Beyond school?</span>
                {([
                  ["early", "Pre-primary"],
                  ["undergraduate", "College"],
                  ["vocational", "Vocational"],
                  ["adult", "Adult learning"],
                ] as [AudienceMode, string][]).map(([mode, label]) => (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={audienceMode === mode}
                    className={audienceMode === mode ? "selected" : ""}
                    key={mode}
                    onClick={() => chooseAudienceMode(mode)}
                  >
                    {label}
                  </button>
                ))}
                {audienceMode !== "school" && (
                  <button type="button" onClick={() => chooseAudienceMode("school")}>Use Class {grade}</button>
                )}
              </div>

              <div className="choice-group">
                <div className="choice-label">
                  <span>Subject</span>
                  <small>Popular Indian classroom subjects are one tap away.</small>
                </div>
                <div className="subject-grid" role="radiogroup" aria-label="Subject">
                  {SUBJECT_LAUNCHERS.map((subject) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={form.subject === subject.label}
                      className={`subject-chip tone-${subject.tone} ${form.subject === subject.label ? "selected" : ""}`}
                      key={subject.label}
                      onClick={() => chooseSubject(subject.label)}
                    >
                      <span aria-hidden="true">{subject.glyph}</span>
                      {subject.label.replace(" / literature", "").replace(" / ICT", "")}
                    </button>
                  ))}
                </div>
                <label className="compact-select">
                  <span>Another subject</span>
                  <select value={form.subject} onChange={updateField("subject")}>
                    {SUBJECTS.map((subject) => <option key={subject}>{subject}</option>)}
                  </select>
                </label>
                {form.subject === "Custom subject" && (
                  <label className="topic-input custom-subject-input">
                    <span className="sr-only">Custom subject or teaching area</span>
                    <input
                      id="field-customSubject"
                      value={form.customSubject}
                      onChange={updateField("customSubject")}
                      aria-invalid={attemptedAction && !form.customSubject.trim()}
                      placeholder="Type your subject or teaching area…"
                    />
                  </label>
                )}
              </div>

              <div className="topic-builder">
                <div className="choice-label">
                  <span>Chapter or topic</span>
                  <small>Pick a suggestion or type the one thing only you know.</small>
                </div>
                <div className="topic-chips">
                  {topicSuggestions.slice(0, 6).map((topic) => (
                    <button
                      type="button"
                      key={topic}
                      className={form.topic === topic ? "selected" : ""}
                      aria-pressed={form.topic === topic}
                      onClick={() => setForm((current) => ({ ...current, topic }))}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
                <label className="topic-input">
                  <span className="sr-only">Custom topic or chapter</span>
                  <input
                    id="field-topic"
                    value={form.topic}
                    onChange={updateField("topic")}
                    aria-invalid={attemptedAction && !form.topic.trim()}
                    placeholder="Type a different chapter or topic…"
                  />
                  <span aria-hidden="true">↵</span>
                </label>
              </div>

              <div className="choice-group language-group">
                <div className="choice-label">
                  <span>Output language</span>
                  <small>Bilingual mode preserves technical terms and notation.</small>
                </div>
                <div className="choice-pills language-pills" role="radiogroup" aria-label="Output language">
                  {LANGUAGE_OPTIONS.map((language) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={form.outputLanguage === language}
                      className={form.outputLanguage === language ? "selected" : ""}
                      key={language}
                      onClick={() => chooseLanguage(language)}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="control-block" aria-labelledby="tune-title">
              <div className="control-block-heading">
                <div>
                  <span className="control-number">B</span>
                  <div>
                    <h3 id="tune-title">Tune the intelligence</h3>
                    <p>Move a slider. The prompt architecture—not just the word count—changes.</p>
                  </div>
                </div>
                <HelpTip title="Intelligence controls">
                  These controls shape cognitive demand, feasibility and how deeply the AI diagnoses, compares and verifies its own result.
                </HelpTip>
              </div>

              <div className="tuning-grid">
                <SliderCard
                  label="Time available"
                  valueLabel={`${TIME_OPTIONS[timeIndex]} min`}
                  note="The studio protects the essential learning when time is tight."
                >
                  <input
                    type="range"
                    min={0}
                    max={TIME_OPTIONS.length - 1}
                    step={1}
                    value={timeIndex}
                    onChange={changeTime}
                    aria-label="Time available"
                  />
                  <div className="range-ticks"><span>15</span><span>40</span><span>60</span><span>90</span></div>
                </SliderCard>
                <SliderCard
                  label="Thinking level"
                  valueLabel={DIFFICULTY_OPTIONS[difficultyIndex].label}
                  note={DIFFICULTY_OPTIONS[difficultyIndex].note}
                >
                  <input
                    type="range"
                    min={0}
                    max={DIFFICULTY_OPTIONS.length - 1}
                    step={1}
                    value={difficultyIndex}
                    onChange={changeDifficulty}
                    aria-label="Thinking level"
                  />
                  <div className="range-ticks"><span>Build</span><span>Explain</span><span>Apply</span><span>Transfer</span></div>
                </SliderCard>
                <SliderCard
                  label="Prompt power"
                  valueLabel={DEPTH_OPTIONS[depthIndex].label}
                  note={DEPTH_OPTIONS[depthIndex].note}
                >
                  <input
                    type="range"
                    min={0}
                    max={DEPTH_OPTIONS.length - 1}
                    step={1}
                    value={depthIndex}
                    onChange={changeDepth}
                    aria-label="Prompt power"
                  />
                  <div className="range-ticks"><span>Fast</span><span>Ready</span><span>Deep</span><span>Beast</span></div>
                </SliderCard>
                <SliderCard
                  label="Practice volume"
                  valueLabel={`${questionCount} items`}
                  note="Used where the selected outcome contains countable questions or checks."
                >
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={5}
                    value={questionCount}
                    onChange={(event) => setQuestionCount(Number(event.target.value))}
                    aria-label="Approximate question or learning-check count"
                  />
                  <div className="range-ticks"><span>5</span><span>20</span><span>35</span><span>50</span></div>
                </SliderCard>
              </div>
            </section>

            <section className="control-block" aria-labelledby="powerups-title">
              <div className="control-block-heading">
                <div>
                  <span className="control-number">C</span>
                  <div>
                    <h3 id="powerups-title">Add classroom superpowers</h3>
                    <p>Recommended boosts are already selected for this outcome.</p>
                  </div>
                </div>
                <HelpTip title="Power-ups">
                  Every selected boost adds both an instruction and a required output section, so it cannot disappear inside a vague prompt.
                </HelpTip>
              </div>
              <div className="powerup-grid">
                {recommendedAddOns.map((item) => {
                  const selected = addOns.includes(item.id);
                  return (
                    <button
                      type="button"
                      className={selected ? "selected" : ""}
                      aria-pressed={selected}
                      key={item.id}
                      onClick={() => toggleAddOn(item.id)}
                    >
                      <span aria-hidden="true">{selected ? "✓" : "+"}</span>
                      <strong>{item.label}</strong>
                      <small>{item.outputSection}</small>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                className="all-powerups"
                onClick={() => setShowAllAddOns((current) => !current)}
              >
                {showAllAddOns ? "Show recommended boosts" : `Explore all ${ADD_ONS.length} superpowers`}
              </button>
            </section>

            <details className="blueprint-lab" open={selectedWorkflow.sourcePolicy === "required"}>
              <summary>
                <span>
                  <i aria-hidden="true">＋</i>
                  <strong>Open the expert blueprint</strong>
                  <small>Optional goals, exact source material, pedagogy and constraints</small>
                </span>
                <span>{selectedWorkflow.sourcePolicy === "required" ? "Material needed" : "Only when you need precision"}</span>
              </summary>
              <div className="blueprint-content">
                <div className="blueprint-intro">
                  <strong>Nothing here is required for a normal classroom prompt.</strong>
                  <p>Use this layer for high-stakes papers, source transformation, exact policies or a very specific teaching design.</p>
                </div>
                <div className="advanced-grid">
                  <label className="advanced-field advanced-wide">
                    <span>Exact goal</span>
                    <textarea
                      id="field-objective"
                      rows={3}
                      value={form.objective}
                      onChange={updateField("objective")}
                      aria-invalid={attemptedAction && !form.objective.trim()}
                    />
                  </label>
                  <label className="advanced-field advanced-wide">
                    <span>Non-negotiables or preferred approach</span>
                    <textarea id="field-details" rows={3} value={form.details} onChange={updateField("details")} />
                  </label>
                  <label className="advanced-field">
                    <span>Pedagogical lens</span>
                    <select value={form.pedagogyLens} onChange={updateField("pedagogyLens")}>
                      {PEDAGOGY_LENSES.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="advanced-field">
                    <span>Cognitive demand</span>
                    <select value={form.cognitiveDemand} onChange={updateField("cognitiveDemand")}>
                      {COGNITIVE_DEMANDS.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="advanced-field">
                    <span>Learner context</span>
                    <textarea rows={3} value={form.learnerContext} onChange={updateField("learnerContext")} />
                  </label>
                  <label className="advanced-field">
                    <span>Resources and limits</span>
                    <textarea rows={3} value={form.resourceLimits} onChange={updateField("resourceLimits")} />
                  </label>
                  <label className="advanced-field">
                    <span>Prior knowledge or evidence</span>
                    <textarea rows={3} value={form.priorKnowledge} onChange={updateField("priorKnowledge")} />
                  </label>
                  <label className="advanced-field">
                    <span>What success should look like</span>
                    <textarea rows={3} value={form.successEvidence} onChange={updateField("successEvidence")} />
                  </label>
                  <label className="advanced-field">
                    <span>Output form</span>
                    <select value={form.outputForm} onChange={updateField("outputForm")}>
                      {OUTPUT_FORMS.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="advanced-field">
                    <span>AI collaboration style</span>
                    <select value={form.collaborationStyle} onChange={updateField("collaborationStyle")}>
                      {COLLABORATION_STYLES.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="advanced-field advanced-wide">
                    <span>Material to analyse or transform</span>
                    <textarea
                      id="field-taskMaterial"
                      rows={6}
                      value={form.taskMaterial}
                      onChange={updateField("taskMaterial")}
                      placeholder="Paste an anonymised paper, draft, student response or resource. The prompt treats it as untrusted reference data."
                    />
                  </label>
                  <label className="advanced-field advanced-wide">
                    <span>Authoritative source or current blueprint</span>
                    <textarea
                      id="field-sourceMaterial"
                      rows={6}
                      value={form.sourceMaterial}
                      onChange={updateField("sourceMaterial")}
                      placeholder="Paste the current syllabus extract, official blueprint, rubric or verified source when exact alignment matters."
                    />
                  </label>
                  <label className="advanced-field advanced-wide">
                    <span>Must avoid or preserve</span>
                    <textarea rows={3} value={form.mustAvoid} onChange={updateField("mustAvoid")} />
                  </label>
                </div>
              </div>
            </details>

            <div className="control-footer">
              <button type="button" onClick={resetBuilder}>Reset starter</button>
              <a href="#prompt-output">Jump to my prompt ↓</a>
            </div>
          </div>

          <aside className="result-console" id="prompt-output" aria-labelledby="result-title">
            <div className="result-sticky">
              <div className="result-head">
                <div>
                  <span className="live-indicator"><i /> LIVE</span>
                  <h3 id="result-title">Your AI mission is ready</h3>
                  <p>{selectedRecipe?.shortTitle ?? selectedWorkflow.title} · Class {grade} · {form.subject}</p>
                </div>
                <div className="readiness-ring" style={readinessStyle} aria-label={`Prompt readiness ${result.score} percent`}>
                  <div><strong>{result.score}</strong><span>ready</span></div>
                </div>
              </div>

              <div className="result-dna" aria-label="Prompt readiness dimensions">
                {result.readiness.map((dimension) => (
                  <button
                    type="button"
                    key={dimension.id}
                    className={dimension.ready ? "ready" : "needs-work"}
                    onClick={() => {
                      if (!dimension.ready) {
                        const issue = result.issues.find((item) => item.field);
                        focusIssue(issue?.field);
                      }
                    }}
                  >
                    <i aria-hidden="true">{dimension.ready ? "✓" : "·"}</i>
                    {dimension.label}
                  </button>
                ))}
              </div>

              {(errors.length > 0 || warnings.length > 0) && (
                <div className="result-issues" aria-live="polite">
                  {errors.map((issue) => (
                    <button type="button" key={issue.message} onClick={() => focusIssue(issue.field)}>
                      <strong>Fix</strong> {issue.message}
                    </button>
                  ))}
                  {warnings.slice(0, 2).map((issue) => (
                    <button type="button" className="warning" key={issue.message} onClick={() => focusIssue(issue.field)}>
                      <strong>Check</strong> {issue.message}
                    </button>
                  ))}
                </div>
              )}

              <div className="result-tabs" role="tablist" aria-label="Prompt preview">
                <button
                  type="button"
                  role="tab"
                  aria-selected={promptView === "overview"}
                  className={promptView === "overview" ? "active" : ""}
                  onClick={() => setPromptView("overview")}
                >
                  Outcome preview
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={promptView === "full"}
                  className={promptView === "full" ? "active" : ""}
                  onClick={() => setPromptView("full")}
                >
                  Full expert prompt
                </button>
              </div>

              {promptView === "overview" ? (
                <div className="outcome-preview">
                  <div className="mission-summary">
                    <span>{selectedRecipe?.glyph ?? selectedWorkflow.glyph}</span>
                    <div>
                      <small>Current mission</small>
                      <strong>{selectedRecipe?.title ?? selectedWorkflow.title}</strong>
                      <p>{form.topic}</p>
                    </div>
                  </div>
                  <div className="output-manifest">
                    <div className="manifest-heading">
                      <span>What the AI will return</span>
                      <small>{(selectedRecipe?.outputs ?? selectedWorkflow.outputSections).length} aligned parts</small>
                    </div>
                    <ol>
                      {(selectedRecipe?.outputs ?? selectedWorkflow.outputSections).map((output) => (
                        <li key={output}><span aria-hidden="true">✓</span>{output}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="architecture-preview">
                    <span>Built into the prompt</span>
                    <div>
                      <i>Board boundary</i>
                      <i>Pedagogy</i>
                      <i>Quality gates</i>
                      <i>Answer audit</i>
                      <i>Teacher verification</i>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="full-prompt-wrap">
                  <div className="prompt-meta">
                    <span>{result.prompt.length.toLocaleString()} characters</span>
                    <span>{selectedWorkflow.title}</span>
                  </div>
                  <textarea
                    className="prompt-preview"
                    value={result.prompt}
                    readOnly
                    aria-label="Generated teacher prompt"
                    spellCheck={false}
                  />
                </div>
              )}
              <textarea
                ref={promptRef}
                className="clipboard-buffer"
                value={result.prompt}
                readOnly
                aria-hidden="true"
                tabIndex={-1}
              />
              <pre className="print-prompt" aria-hidden="true">{result.prompt}</pre>

              <div className="primary-result-actions">
                <button type="button" className="copy-master" onClick={copyPrompt}>
                  <span>
                    <strong>Copy expert prompt</strong>
                    <small>Ready for any capable AI</small>
                  </span>
                  <i aria-hidden="true">⧉</i>
                </button>
                <button type="button" onClick={downloadPrompt} aria-label="Download prompt as text file">
                  <span aria-hidden="true">↓</span><small>Download</small>
                </button>
                <button type="button" onClick={() => window.print()} aria-label="Print or save prompt as PDF">
                  <span aria-hidden="true">▤</span><small>PDF</small>
                </button>
              </div>

              <p className="copy-status" aria-live="polite" role="status">
                {copyStatus || "Every tap updates this mission immediately."}
              </p>

              <div className="ai-launch-dock">
                <div className="launch-heading">
                  <span>Launch in your favourite AI</span>
                  <small>One click copies the prompt and opens a fresh chat.</small>
                </div>
                <div className="provider-grid">
                  {AI_PROVIDERS.map((provider) => (
                    <a
                      key={provider.id}
                      href={provider.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => prepareProvider(event, provider.name)}
                      title={provider.note}
                    >
                      <span className={`provider-glyph provider-${provider.id}`}>{provider.glyph}</span>
                      <strong>{provider.name}</strong>
                      <i aria-hidden="true">↗</i>
                    </a>
                  ))}
                </div>
                <p>
                  Your prompt is copied on this device; it is not placed inside the provider URL.
                  Review it and remove learner names or confidential details before sending.
                </p>
              </div>

              <details className="refinement-pack">
                <summary>
                  <span><strong>Improve the AI&apos;s result</strong><small>Six follow-up moves without starting over</small></span>
                  <i aria-hidden="true">＋</i>
                </summary>
                <div className="refinement-grid">
                  {result.refinements.map((refinement) => (
                    <button
                      type="button"
                      key={refinement.id}
                      onClick={() => copyRefinement(refinement.label, refinement.prompt)}
                    >
                      <strong>{refinement.label}</strong>
                      <span>{refinement.description}</span>
                    </button>
                  ))}
                </div>
              </details>
            </div>
          </aside>
        </div>
      </section>

      <section className="workflow-vault" id="workflow-vault" aria-labelledby="vault-title">
        <div className="vault-heading">
          <div>
            <span className="step-chip">03 · Go beyond the presets</span>
            <h2 id="vault-title">The 79-engine teacher vault</h2>
            <p>Every teaching job has its own method and quality gates. Search in normal teacher language.</p>
          </div>
          <div className="vault-count"><strong>{WORKFLOWS.length}</strong><span>specialist workflows</span></div>
        </div>
        <div className="vault-controls">
          <label>
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={workflowSearch}
              onChange={(event) => setWorkflowSearch(event.target.value)}
              placeholder="Try paper, DPP, rubric, JEE, parent message…"
              aria-label="Search all teaching workflows"
            />
          </label>
          <div className="vault-categories" aria-label="Workflow categories">
            {(["All", ...WORKFLOW_CATEGORIES] as CategoryFilter[]).map((category) => (
              <button
                type="button"
                key={category}
                aria-pressed={workflowCategory === category}
                className={workflowCategory === category ? "selected" : ""}
                onClick={() => setWorkflowCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="vault-result-line" aria-live="polite">
          <span>{filteredWorkflows.length} workflows found</span>
          <span>{workflowCategory === "All" ? "Across the full teaching cycle" : CATEGORY_META[workflowCategory].short}</span>
        </div>
        <div className="vault-grid">
          {filteredWorkflows.map((workflow) => (
            <button
              type="button"
              key={workflow.id}
              className={selectedWorkflow.id === workflow.id ? "selected" : ""}
              aria-pressed={selectedWorkflow.id === workflow.id}
              onClick={() => chooseWorkflow(workflow)}
            >
              <span>{workflow.glyph}</span>
              <div>
                <small>{workflow.category}</small>
                <strong>{workflow.title}</strong>
                <p>{workflow.summary}</p>
              </div>
              <i aria-hidden="true">→</i>
            </button>
          ))}
        </div>
      </section>

      <section className="ecosystem" aria-labelledby="ecosystem-title">
        <div className="ecosystem-heading">
          <span className="step-chip step-chip-dark">04 · Your creator ecosystem</span>
          <h2 id="ecosystem-title">The best of your previous studios—connected.</h2>
          <p>
            The new recipes borrow the strongest patterns from the maths library, prompt vault,
            problem atlas and visual hero system. Open a specialist tool when you want to go even deeper.
          </p>
        </div>
        <div className="ecosystem-grid">
          {ECOSYSTEM_TOOLS.map((tool) => (
            <a href={tool.url} target="_blank" rel="noopener noreferrer" key={tool.title}>
              <span>{tool.glyph}</span>
              <div><small>{tool.metric}</small><strong>{tool.title}</strong><p>{tool.description}</p></div>
              <i aria-hidden="true">↗</i>
            </a>
          ))}
        </div>
      </section>

      <section className="trust-architecture" aria-labelledby="trust-title">
        <div>
          <span>Deep intelligence. Visible confidence.</span>
          <h2 id="trust-title">Beast-level does not mean reckless.</h2>
          <p>
            Every mission gets an instruction hierarchy, source boundary, feasibility check,
            internal repair pass and teacher verification ledger before the AI returns its artifact.
          </p>
        </div>
        <div className="trust-grid">
          <article><span>01</span><strong>Diagnose</strong><p>Find missing facts and risky assumptions.</p></article>
          <article><span>02</span><strong>Design</strong><p>Align goals, evidence and classroom reality.</p></article>
          <article><span>03</span><strong>Stress-test</strong><p>Check truth, access, timing and totals.</p></article>
          <article><span>04</span><strong>Repair</strong><p>Fix weak sections before returning.</p></article>
        </div>
      </section>

      <footer className="command-footer">
        <div className="command-brand footer-brand">
          <span className="brand-orbit" aria-hidden="true"><i />TP</span>
          <span><strong>Teacher Prompt Studio</strong><small>Built for real Indian classrooms</small></span>
        </div>
        <p>No login · No tracking · No learner data uploaded</p>
        <a href="#top">Back to command centre ↑</a>
      </footer>
    </main>
  );
}
