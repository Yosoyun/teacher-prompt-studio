"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import ArtifactStage from "./ArtifactStage";
import { buildAssessmentSpec } from "./assessment-spec";
import {
  ARTIFACT_FAMILIES,
  ARTIFACT_PROFILES,
  ASSESSMENT_PROFILES,
  CREATOR_MARKER,
  CREATOR_SIGNATURE,
  FINISH_LEVELS,
  FOLLOW_UP_PATHS,
  VISUAL_STYLES,
  defaultArtifactId,
  getArtifactProfile,
  type ArtifactFamily,
  type ArtifactId,
  type AssessmentProfileId,
} from "./artifact-data";
import {
  ADD_ONS,
  CATEGORY_META,
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
type AudienceMode = "school" | "early" | "undergraduate" | "vocational" | "adult";
type StepId = 0 | 1 | 2 | 3;

const DEFAULT_RECIPE = STUDIO_RECIPES[0];
const DEFAULT_WORKFLOW = WORKFLOWS.find(
  (item) => item.id === DEFAULT_RECIPE.workflowId,
) as PromptWorkflow;
const DEFAULT_ARTIFACT = defaultArtifactId(
  DEFAULT_RECIPE.id,
  DEFAULT_WORKFLOW.id,
  DEFAULT_WORKFLOW.category,
);

const STRUCTURED_ITEM_WORKFLOW_IDS = new Set([
  "quiz-test",
  "competitive-exam",
  "worksheet-homework",
  "question-bank",
]);

const initialForm = {
  subject: "Mathematics",
  customSubject: "",
  level: "Secondary / high school",
  customLevel: "",
  topic: "Quadratic equations",
  curriculum: "CBSE / NCERT",
  objective: DEFAULT_RECIPE.objective,
  learnerContext: "Mixed-readiness class with familiar school routines",
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
  outputForm: "Separate teacher and learner files",
};

type FormState = typeof initialForm;

const STEP_META: Array<{
  id: StepId;
  label: string;
  short: string;
  description: string;
}> = [
  { id: 0, label: "Choose", short: "What to make", description: "Pick a ready teaching mission" },
  { id: 1, label: "Fit", short: "Your classroom", description: "Board, class, subject and chapter" },
  { id: 2, label: "Finish", short: "Real files", description: "Choose format, polish and power-ups" },
  { id: 3, label: "Launch AI", short: "Create files", description: "Choose an AI, copy the instructions and create the artifact" },
];

const unique = (items: string[]) => [...new Set(items)];

const gradeToLevel = (grade: number) => {
  if (grade <= 5) return "Primary / elementary";
  if (grade <= 8) return "Middle school";
  if (grade <= 10) return "Secondary / high school";
  return "Senior secondary / exam prep";
};

function Insight({ children }: { children: ReactNode }) {
  return (
    <span className="insight">
      <i aria-hidden="true">i</i>
      {children}
    </span>
  );
}

export default function PromptStudio() {
  const [activeStep, setActiveStep] = useState<StepId>(0);
  const [maxStep, setMaxStep] = useState<StepId>(0);
  const [selectedWorkflow, setSelectedWorkflow] = useState<PromptWorkflow>(DEFAULT_WORKFLOW);
  const [selectedRecipeId, setSelectedRecipeId] = useState(DEFAULT_RECIPE.id);
  const [recipeCategory, setRecipeCategory] = useState<RecipeCategory>("Popular");
  const [form, setForm] = useState<FormState>(initialForm);
  const [addOns, setAddOns] = useState<string[]>(
    unique([...DEFAULT_WORKFLOW.defaultAddOns, ...DEFAULT_RECIPE.addOns]),
  );
  const [artifactId, setArtifactId] = useState<ArtifactId>(DEFAULT_ARTIFACT);
  const [artifactFamily, setArtifactFamily] = useState<ArtifactFamily>("Print");
  const [visualStyleId, setVisualStyleId] = useState("academic-editorial");
  const [finishId, setFinishId] = useState("polished");
  const [assessmentProfileId, setAssessmentProfileId] = useState<AssessmentProfileId>("balanced-academic");
  const [interactionMode, setInteractionMode] = useState("Guided exploration with meaningful feedback, clear progress and a reset path");
  const [selectedProviderId, setSelectedProviderId] = useState("chatgpt");
  const [boardId, setBoardId] = useState("cbse");
  const [grade, setGrade] = useState(10);
  const [audienceMode, setAudienceMode] = useState<AudienceMode>("school");
  const [classSize, setClassSize] = useState(40);
  const [timeIndex, setTimeIndex] = useState(3);
  const [difficultyIndex, setDifficultyIndex] = useState(1);
  const [questionCount, setQuestionCount] = useState(20);
  const [copyStatus, setCopyStatus] = useState("");
  const [attemptedAction, setAttemptedAction] = useState(false);
  const [workflowSearch, setWorkflowSearch] = useState("");
  const [workflowCategory, setWorkflowCategory] = useState<CategoryFilter>("All");
  const [showAllRecipes, setShowAllRecipes] = useState(false);
  const [showAllAddOns, setShowAllAddOns] = useState(false);
  const [showAllFormats, setShowAllFormats] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [launchStatus, setLaunchStatus] = useState("");
  const [launchingProviderId, setLaunchingProviderId] = useState<string | null>(null);
  const [manualProviderId, setManualProviderId] = useState<string | null>(null);
  const [followUpTrail, setFollowUpTrail] = useState<string[]>([]);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const expertDetailsRef = useRef<HTMLDetailsElement>(null);
  const launchPanelRef = useRef<HTMLElement>(null);
  const technicalPromptRef = useRef<HTMLDetailsElement>(null);
  const promptTextareaRef = useRef<HTMLTextAreaElement>(null);
  const firstStepChange = useRef(true);

  const selectedRecipe = STUDIO_RECIPES.find((recipe) => recipe.id === selectedRecipeId);
  const selectedBoard = BOARD_OPTIONS.find((board) => board.id === boardId) ?? BOARD_OPTIONS[0];
  const artifact = getArtifactProfile(artifactId);
  const selectedProvider = AI_PROVIDERS.find((provider) => provider.id === selectedProviderId) ?? AI_PROVIDERS[0];
  const manualProvider = manualProviderId
    ? AI_PROVIDERS.find((provider) => provider.id === manualProviderId)
    : undefined;
  const visualStyle = VISUAL_STYLES.find((style) => style.id === visualStyleId) ?? VISUAL_STYLES[0];
  const finish = FINISH_LEVELS.find((item) => item.id === finishId) ?? FINISH_LEVELS[1];
  const selectedAssessmentProfile = ASSESSMENT_PROFILES.find((profile) => profile.id === assessmentProfileId) ?? ASSESSMENT_PROFILES[0];
  const usesAssessmentArchitecture = STRUCTURED_ITEM_WORKFLOW_IDS.has(selectedWorkflow.id);
  const assessmentSpec = useMemo(
    () => usesAssessmentArchitecture
      ? buildAssessmentSpec(selectedAssessmentProfile, questionCount)
      : undefined,
    [questionCount, selectedAssessmentProfile, usesAssessmentArchitecture],
  );
  const topicSuggestions = TOPIC_BANK[form.subject] ?? [
    "Introduce a new concept",
    "Revision of a difficult chapter",
    "Application and problem solving",
    "End-of-unit assessment",
  ];
  const classLabel = audienceMode === "school" ? `Class ${grade}` : form.level;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem("teacher-prompt-studio-classroom");
        if (saved) {
          const profile = JSON.parse(saved) as {
            boardId?: string;
            grade?: number;
            subject?: string;
            outputLanguage?: string;
            classSize?: number;
          };
          const savedBoard = BOARD_OPTIONS.find((item) => item.id === profile.boardId);
          const savedSubject = SUBJECTS.includes(profile.subject ?? "") ? profile.subject : undefined;
          const savedLanguage = LANGUAGE_OPTIONS.includes(profile.outputLanguage ?? "") ? profile.outputLanguage : undefined;
          const savedGrade = Math.min(12, Math.max(1, Number(profile.grade) || 10));
          setBoardId(savedBoard?.id ?? "cbse");
          setGrade(savedGrade);
          setClassSize(Math.min(60, Math.max(10, Number(profile.classSize) || 40)));
          setForm((current) => ({
            ...current,
            curriculum: savedBoard?.value ?? current.curriculum,
            subject: savedSubject ?? current.subject,
            level: gradeToLevel(savedGrade),
            outputLanguage: savedLanguage ?? current.outputLanguage,
          }));
          setProfileLoaded(true);
        }
      } catch {
        setProfileLoaded(false);
      } finally {
        setProfileReady(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!profileReady) return;
    try {
      window.localStorage.setItem(
        "teacher-prompt-studio-classroom",
        JSON.stringify({ boardId, grade, subject: form.subject, outputLanguage: form.outputLanguage, classSize }),
      );
    } catch {
      // A private browsing setting may disable local preferences; the builder still works.
    }
  }, [boardId, classSize, form.outputLanguage, form.subject, grade, profileReady]);

  useEffect(() => {
    if (firstStepChange.current) {
      firstStepChange.current = false;
      return;
    }
    window.setTimeout(() => {
      if (activeStep === 3 && launchPanelRef.current) {
        launchPanelRef.current.focus();
        launchPanelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      stepHeadingRef.current?.focus();
    }, 0);
  }, [activeStep]);

  const builderInput: BuilderInput = useMemo(
    () => ({
      workflow: selectedWorkflow,
      recipeId: selectedRecipeId,
      artifact,
      assessmentSpec,
      requiredOutputs: selectedRecipe?.outputs ?? selectedWorkflow.outputSections,
      visualStyle: `${visualStyle.label}: ${visualStyle.description}`,
      interactionMode,
      creatorSignature: CREATOR_SIGNATURE,
      creatorMarker: CREATOR_MARKER,
      ...form,
      learnerContext:
        audienceMode === "school"
          ? `Class ${grade}, ${classSize} learners. ${form.learnerContext}`
          : `${form.level}, ${classSize} learners. ${form.learnerContext}`,
      details: `${form.details}\n\nTeacher-set controls: ${assessmentSpec ? `${assessmentSpec.profileLabel}; EXACTLY ${assessmentSpec.totalItems} items and ${assessmentSpec.totalMarks} marks using the structured assessment specification` : "no fixed assessment distribution"}; ${DIFFICULTY_OPTIONS[difficultyIndex].label.toLowerCase()} cognitive demand; ${finish.label.toLowerCase()} production finish. Apply only controls that make sense for the selected artifact.`,
      addOns,
    }),
    [
      selectedWorkflow,
      selectedRecipeId,
      selectedRecipe,
      artifact,
      assessmentSpec,
      visualStyle,
      interactionMode,
      form,
      audienceMode,
      grade,
      classSize,
      difficultyIndex,
      finish,
      addOns,
    ],
  );

  const deferredBuilderInput = useDeferredValue(builderInput);
  const result = useMemo(() => buildTeacherPrompt(deferredBuilderInput), [deferredBuilderInput]);
  const errors = result.issues.filter((issue) => issue.severity === "error");
  const warnings = result.issues.filter((issue) => issue.severity === "warning");

  const visibleRecipes = useMemo(() => {
    const filtered = STUDIO_RECIPES.filter((recipe) => recipe.category === recipeCategory);
    return showAllRecipes ? filtered : filtered.slice(0, 8);
  }, [recipeCategory, showAllRecipes]);

  const filteredWorkflows = useMemo(() => {
    const tokens = workflowSearch.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return WORKFLOWS.filter((workflow) => {
      if (workflowCategory !== "All" && workflow.category !== workflowCategory) return false;
      if (!tokens.length) return true;
      const haystack = [workflow.title, workflow.summary, workflow.category, ...(workflow.aliases ?? [])]
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
    return showAllAddOns ? ordered : ordered.slice(0, 6);
  }, [addOns, selectedRecipe, selectedWorkflow, showAllAddOns]);

  const recommendedProviders = artifact.recommendedProviders
    .map((id) => AI_PROVIDERS.find((provider) => provider.id === id))
    .filter((provider): provider is (typeof AI_PROVIDERS)[number] => Boolean(provider));
  const launchProviders = [
    ...recommendedProviders,
    ...AI_PROVIDERS.filter((provider) => !artifact.recommendedProviders.includes(provider.id)),
  ];

  const visibleArtifacts = useMemo(() => {
    const recommended = ARTIFACT_PROFILES.filter((profile) =>
      profile.id === artifactId || profile.family === artifact.family,
    );
    const all = unique([...recommended.map((item) => item.id), ...ARTIFACT_PROFILES.map((item) => item.id)])
      .map((id) => getArtifactProfile(id as ArtifactId));
    return showAllFormats
      ? all.filter((profile) => profile.family === artifactFamily)
      : all.slice(0, 6);
  }, [artifact.family, artifactFamily, artifactId, showAllFormats]);

  const updateField =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setCopyStatus("");
      setLaunchStatus("");
      setManualProviderId(null);
    };

  const moveToStep = (step: StepId) => {
    if (step > maxStep) return;
    setActiveStep(step);
    setCopyStatus("");
  };

  const advanceTo = (step: StepId) => {
    setMaxStep((current) => Math.max(current, step) as StepId);
    setActiveStep(step);
  };

  const applyRecipe = (recipe: StudioRecipe) => {
    const workflow = WORKFLOWS.find((item) => item.id === recipe.workflowId);
    if (!workflow) return;
    const nextArtifactId = defaultArtifactId(recipe.id, workflow.id, workflow.category);
    const nextArtifact = getArtifactProfile(nextArtifactId);
    setSelectedRecipeId(recipe.id);
    setSelectedWorkflow(workflow);
    setArtifactId(nextArtifactId);
    setArtifactFamily(nextArtifact.family);
    setSelectedProviderId(nextArtifact.recommendedProviders[0]);
    setForm((current) => ({
      ...current,
      objective: recipe.objective,
      details: recipe.details,
      powerMode: recipe.powerMode ?? "Expert",
      outputForm: recipe.category === "Assess" || recipe.id.includes("paper")
        ? "Separate teacher and learner files"
        : "Ready-to-use final artifact",
    }));
    setAddOns(unique([...workflow.defaultAddOns, ...recipe.addOns]));
    setLaunched(false);
    setLaunchStatus("");
    setManualProviderId(null);
    setFollowUpTrail([]);
    setCopyStatus(`${recipe.shortTitle} selected. The best file format is already recommended.`);
    advanceTo(1);
  };

  const chooseWorkflow = (workflow: PromptWorkflow) => {
    const nextArtifactId = defaultArtifactId("", workflow.id, workflow.category);
    const nextArtifact = getArtifactProfile(nextArtifactId);
    setSelectedRecipeId("");
    setSelectedWorkflow(workflow);
    setArtifactId(nextArtifactId);
    setArtifactFamily(nextArtifact.family);
    setSelectedProviderId(nextArtifact.recommendedProviders[0]);
    setForm((current) => ({
      ...current,
      objective: workflow.defaultGoal,
      details: "",
      outputForm: workflow.flags?.includes("assessment")
        ? "Separate teacher and learner files"
        : "Ready-to-use final artifact",
    }));
    setAddOns(workflow.defaultAddOns);
    setLaunched(false);
    setLaunchStatus("");
    setManualProviderId(null);
    setFollowUpTrail([]);
    setCopyStatus(`${workflow.title} loaded with a real-file delivery plan.`);
    advanceTo(1);
  };

  const chooseBoard = (id: string) => {
    const resolvedId = id === "icse" && grade > 10
      ? "isc"
      : id === "isc" && grade <= 10
        ? "icse"
        : id;
    const board = BOARD_OPTIONS.find((item) => item.id === resolvedId);
    if (!board) return;
    setBoardId(resolvedId);
    setForm((current) => ({ ...current, curriculum: board.value, countryRegion: "India" }));
    setCopyStatus(resolvedId !== id ? `${board.label} selected to match ${classLabel}.` : "");
  };

  const chooseSubject = (subject: string) => {
    const firstTopic = TOPIC_BANK[subject]?.[0] ?? form.topic;
    setForm((current) => ({ ...current, subject, topic: firstTopic }));
    setCopyStatus("");
  };

  const chooseLanguage = (language: string) => {
    setForm((current) => ({ ...current, outputLanguage: language }));
    setAddOns((current) => language === "English"
      ? current.filter((id) => id !== "translation")
      : unique([...current, "translation"]));
    setCopyStatus("");
  };

  const chooseGrade = (nextGrade: number) => {
    setGrade(nextGrade);
    setAudienceMode("school");
    const nextBoardId = nextGrade > 10 && boardId === "icse"
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
    }));
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
  };

  const chooseFinish = (id: string) => {
    const nextFinish = FINISH_LEVELS.find((item) => item.id === id);
    if (!nextFinish) return;
    setFinishId(id);
    setForm((current) => ({
      ...current,
      powerMode: DEPTH_OPTIONS[nextFinish.depthIndex].powerMode,
      outputLength: DEPTH_OPTIONS[nextFinish.depthIndex].length,
    }));
  };

  const chooseArtifact = (id: ArtifactId) => {
    const next = getArtifactProfile(id);
    setArtifactId(id);
    setArtifactFamily(next.family);
    setSelectedProviderId(next.recommendedProviders[0]);
    setLaunched(false);
    setLaunchStatus("");
    setManualProviderId(null);
    setCopyStatus(`${next.shortLabel} selected. The file contract and quality checks changed immediately.`);
  };

  const toggleAddOn = (id: string) => {
    setAddOns((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id]);
  };

  const currentPromptResult = () => buildTeacherPrompt(builderInput);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("aria-hidden", "true");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const copied = document.execCommand("copy");
        textarea.remove();
        return copied;
      } catch {
        return false;
      }
    }
  };

  const revealPromptForManualCopy = () => {
    if (technicalPromptRef.current) technicalPromptRef.current.open = true;
    window.setTimeout(() => {
      const textarea = promptTextareaRef.current;
      if (!textarea) return;
      textarea.focus();
      textarea.select();
      textarea.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  const focusIssue = (field?: keyof BuilderInput) => {
    if (!field) return;
    const expertFields = new Set<keyof BuilderInput>([
      "objective",
      "details",
      "priorKnowledge",
      "successEvidence",
      "taskMaterial",
      "sourceMaterial",
      "mustAvoid",
    ]);
    const targetStep: StepId = expertFields.has(field) ? 2 : 1;
    setMaxStep((current) => Math.max(current, targetStep) as StepId);
    setActiveStep(targetStep);
    window.setTimeout(() => {
      if (expertFields.has(field) && expertDetailsRef.current) {
        expertDetailsRef.current.open = true;
      }
      window.setTimeout(() => {
        const target = document.getElementById(`field-${String(field)}`);
        target?.focus();
        target?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 0);
    }, 0);
  };

  const prepareProvider = async (providerId: string) => {
    const provider = AI_PROVIDERS.find((item) => item.id === providerId) ?? selectedProvider;
    setSelectedProviderId(provider.id);
    setManualProviderId(null);
    setAttemptedAction(true);
    const current = currentPromptResult();
    const currentErrors = current.issues.filter((issue) => issue.severity === "error");
    if (currentErrors.length) {
      setLaunched(false);
      const message = "Launch is ready, but one required detail still needs your attention. Use the visible Fix this detail button; your AI choices will stay here.";
      setLaunchStatus(message);
      setCopyStatus(message);
      return;
    }

    // Reserve the tab during the trusted click. We only navigate it after the
    // instructions are safely copied, so a teacher never lands in an empty AI chat.
    const launchWindow = window.open("about:blank", "_blank");
    if (launchWindow) {
      try {
        launchWindow.opener = null;
        launchWindow.document.title = `Preparing ${provider.name}…`;
        launchWindow.document.body.style.cssText = "margin:0;display:grid;min-height:100vh;place-items:center;background:#0c1d19;color:#f8fff1;font:700 18px system-ui,sans-serif;text-align:center;padding:24px";
        launchWindow.document.body.textContent = `Preparing ${provider.name} and copying your build instructions…`;
        launchWindow.blur();
        window.focus();
      } catch {
        // The reserved tab is still safe to navigate even if its interim page cannot be styled.
      }
    }

    setLaunchingProviderId(provider.id);
    setLaunchStatus(`Copying the build instructions and starting ${provider.name}…`);
    const copied = await copyText(current.prompt);
    try {
      if (copied) {
        setLaunched(true);
        let providerOpened = false;
        if (launchWindow && !launchWindow.closed) {
          launchWindow.location.replace(provider.url);
          launchWindow.focus();
          providerOpened = true;
        } else {
          setManualProviderId(provider.id);
        }
        const message = providerOpened
          ? `${provider.name} is opening and the instructions are copied. Paste once in the new chat to create ${artifact.shortLabel}.`
          : `Instructions copied. Your browser blocked the new tab—use Open ${provider.name} below, then paste once.`;
        setLaunchStatus(message);
        setCopyStatus(message);
      } else {
        launchWindow?.close();
        window.focus();
        setLaunched(false);
        setManualProviderId(provider.id);
        const message = `Clipboard access was blocked, so ${provider.name} was not opened. The full instructions are selected below—copy them, then use Open ${provider.name}.`;
        setLaunchStatus(message);
        setCopyStatus(message);
        revealPromptForManualCopy();
      }
    } catch {
      launchWindow?.close();
      window.focus();
      setLaunched(false);
      setManualProviderId(provider.id);
      const message = `The ${provider.name} handoff could not finish. The full instructions are selected below—copy them, then use Open ${provider.name}.`;
      setLaunchStatus(message);
      setCopyStatus(message);
      revealPromptForManualCopy();
    } finally {
      setLaunchingProviderId(null);
    }
  };

  const copyPrompt = async () => {
    const copied = await copyText(currentPromptResult().prompt);
    const message = copied
      ? `Build instructions copied. Open any AI below and paste once to create ${artifact.shortLabel}.`
      : "Copy was blocked. The technical instructions are open and selected for manual copying.";
    setManualProviderId(copied ? null : selectedProvider.id);
    setLaunchStatus(message);
    setCopyStatus(message);
    if (!copied) revealPromptForManualCopy();
  };

  const copyFollowUp = async (id: string) => {
    const map: Record<string, string> = {
      repair: "audit-repair",
      visual: "visual",
      adapt: "adapt-access",
      deepen: "deepen",
      transform: "transform",
      share: "publish",
    };
    const refinement = result.refinements.find((item) => item.id === map[id]);
    if (!refinement) return;
    const copied = await copyText(refinement.prompt);
    if (copied) {
      setFollowUpTrail((current) => [...current, refinement.label]);
      setCopyStatus(`${refinement.label} copied. Paste it in the same AI chat so the artifact, class and topic stay intact.`);
    } else {
      setCopyStatus("Clipboard access was blocked. Open the technical instructions to copy manually.");
    }
  };

  const surpriseMe = () => {
    const recipe = STUDIO_RECIPES[Math.floor(Math.random() * STUDIO_RECIPES.length)];
    const subject = SUBJECT_LAUNCHERS[Math.floor(Math.random() * SUBJECT_LAUNCHERS.length)].label;
    const topicList = TOPIC_BANK[subject] ?? ["A high-value teaching topic"];
    const topic = topicList[Math.floor(Math.random() * topicList.length)];
    const nextGrade = 6 + Math.floor(Math.random() * 7);
    const workflow = WORKFLOWS.find((item) => item.id === recipe.workflowId);
    if (!workflow) return;
    const nextArtifactId = defaultArtifactId(recipe.id, workflow.id, workflow.category);
    const nextArtifact = getArtifactProfile(nextArtifactId);

    setSelectedRecipeId(recipe.id);
    setSelectedWorkflow(workflow);
    setArtifactId(nextArtifactId);
    setArtifactFamily(nextArtifact.family);
    setSelectedProviderId(nextArtifact.recommendedProviders[0]);
    setGrade(nextGrade);
    setAudienceMode("school");
    setRecipeCategory(recipe.category);
    setForm((current) => ({
      ...current,
      subject,
      topic,
      level: gradeToLevel(nextGrade),
      objective: recipe.objective,
      details: recipe.details,
      powerMode: recipe.powerMode ?? "Breakthrough",
    }));
    setAddOns(unique([...workflow.defaultAddOns, ...recipe.addOns]));
    setLaunched(false);
    setLaunchStatus("");
    setManualProviderId(null);
    setFollowUpTrail([]);
    setCopyStatus(`Surprise: ${recipe.shortTitle} · ${nextArtifact.shortLabel} · Class ${nextGrade} ${subject}.`);
    advanceTo(1);
  };

  const resetBuilder = () => {
    setActiveStep(0);
    setMaxStep(0);
    setSelectedWorkflow(DEFAULT_WORKFLOW);
    setSelectedRecipeId(DEFAULT_RECIPE.id);
    setRecipeCategory("Popular");
    setForm(initialForm);
    setAddOns(unique([...DEFAULT_WORKFLOW.defaultAddOns, ...DEFAULT_RECIPE.addOns]));
    setArtifactId(DEFAULT_ARTIFACT);
    setArtifactFamily("Print");
    setVisualStyleId("academic-editorial");
    setFinishId("polished");
    setAssessmentProfileId("balanced-academic");
    setBoardId("cbse");
    setGrade(10);
    setAudienceMode("school");
    setClassSize(40);
    setTimeIndex(3);
    setDifficultyIndex(1);
    setQuestionCount(20);
    setSelectedProviderId(getArtifactProfile(DEFAULT_ARTIFACT).recommendedProviders[0]);
    setLaunched(false);
    setLaunchStatus("");
    setLaunchingProviderId(null);
    setManualProviderId(null);
    setFollowUpTrail([]);
    setAttemptedAction(false);
    setCopyStatus("Fresh studio ready.");
  };

  const goNext = () => {
    if (activeStep === 0) {
      advanceTo(1);
      return;
    }
    if (activeStep === 1 && !form.topic.trim()) {
      setAttemptedAction(true);
      setCopyStatus("Choose or type one chapter so the artifact cannot become generic.");
      document.getElementById("field-topic")?.focus();
      return;
    }
    if (activeStep < 3) advanceTo((activeStep + 1) as StepId);
  };

  const stepHeading = STEP_META[activeStep];
  const nextLabel = activeStep === 0
    ? "Next: fit my classroom"
    : activeStep === 1
      ? "Next: choose the real files"
      : activeStep === 2
        ? "Next: create the artifact"
        : artifact.actionLabel;

  return (
    <main className="maker-shell">
      <a className="skip-link" href="#maker-workspace">Skip to artifact maker</a>

      <header className="maker-nav">
        <a className="maker-brand" href="#top" aria-label="Teacher Prompt Studio home">
          <span aria-hidden="true">TP</span>
          <div><strong>Teacher Prompt Studio</strong><small>Artifact maker for Indian teachers</small></div>
        </a>
        <div className="nav-proof"><i /> Nothing is sent by this site</div>
        <div className="nav-buttons">
          <button type="button" onClick={surpriseMe}>✦ Surprise me</button>
          <button type="button" onClick={resetBuilder}>Start fresh</button>
        </div>
      </header>

      <section className="maker-intro" id="top">
        <div>
          <span className="intro-kicker">No prompt writing · no blank page · real-file instructions</span>
          <h1>Choose it. Shape it. <em>Create the actual artifact.</em></h1>
          <p>
            The prompt stays backstage. You choose what the teacher needs; the studio prepares
            exact instructions for a PDF, DOCX, image, website, flowchart, workbook or simulation.
          </p>
        </div>
        <div className="intro-promise">
          <strong>3 taps for returning teachers</strong>
          <span>Mission → chapter → create</span>
          <i>Saved only on this device</i>
        </div>
      </section>

      <section className="maker-app" id="maker-workspace" aria-label="Artifact maker">
        <nav className="step-rail" aria-label="Creation steps">
          {STEP_META.map((step) => {
            const unlocked = step.id <= maxStep;
            const complete = step.id < activeStep || (step.id < maxStep && step.id !== activeStep);
            return (
              <button
                type="button"
                key={step.id}
                disabled={!unlocked}
                className={`${step.id === activeStep ? "active" : ""} ${complete ? "complete" : ""}`}
                aria-current={step.id === activeStep ? "step" : undefined}
                onClick={() => moveToStep(step.id)}
              >
                <i>{complete ? "✓" : step.id + 1}</i>
                <span><strong>{step.label}</strong><small>{step.short}</small></span>
              </button>
            );
          })}
        </nav>

        <div className="maker-body">
          <section className="decision-panel" aria-labelledby="step-title">
            <div className="decision-heading">
              <span>Step {activeStep + 1} of 4 · {stepHeading.label}</span>
              <h2 id="step-title" tabIndex={-1} ref={stepHeadingRef}>{stepHeading.description}</h2>
              <p>
                {activeStep === 0 && "Tap one outcome. Its expert method, file type and quality checks load automatically."}
                {activeStep === 1 && "Tell us only what changes the classroom result. Your usual profile is remembered on this device."}
                {activeStep === 2 && "Choose how it should arrive. Every option demands a real artifact—not a normal chat answer."}
                {activeStep === 3 && "Open an AI, paste once, and receive the requested files. Then use the visual follow-up path."}
              </p>
            </div>

            {activeStep === 0 && (
              <div className="step-content outcome-step">
                <div className="recipe-tabs" role="tablist" aria-label="Teaching outcome categories">
                  {RECIPE_CATEGORIES.map((category) => (
                    <button
                      type="button"
                      key={category}
                      role="tab"
                      aria-selected={recipeCategory === category}
                      className={recipeCategory === category ? "active" : ""}
                      onClick={() => { setRecipeCategory(category); setShowAllRecipes(false); }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <div className="outcome-grid">
                  {visibleRecipes.map((recipe) => {
                    const workflow = WORKFLOWS.find((item) => item.id === recipe.workflowId) ?? DEFAULT_WORKFLOW;
                    const recipeArtifact = getArtifactProfile(defaultArtifactId(recipe.id, workflow.id, workflow.category));
                    const selected = selectedRecipeId === recipe.id;
                    return (
                      <button
                        type="button"
                        key={recipe.id}
                        className={`outcome-card accent-${recipe.accent} ${selected ? "selected" : ""}`}
                        aria-pressed={selected}
                        onClick={() => applyRecipe(recipe)}
                      >
                        <span className="outcome-top"><i>{recipe.glyph}</i><small>Saves {recipe.timeSaved}</small></span>
                        <strong>{recipe.shortTitle}</strong>
                        <p>{recipe.summary}</p>
                        <span className="file-promise"><b>{recipeArtifact.glyph}</b>{recipeArtifact.shortLabel}</span>
                        <em>{selected ? "Selected ✓" : "Choose and continue →"}</em>
                      </button>
                    );
                  })}
                </div>
                {STUDIO_RECIPES.filter((recipe) => recipe.category === recipeCategory).length > 8 && (
                  <button type="button" className="quiet-button" onClick={() => setShowAllRecipes((current) => !current)}>
                    {showAllRecipes ? "Show essentials" : `Show every ${recipeCategory.toLowerCase()} outcome`}
                  </button>
                )}

                <details className="mission-vault">
                  <summary><span><strong>Need something else?</strong><small>Search all {WORKFLOWS.length} expert teacher missions</small></span><i>＋</i></summary>
                  <div className="vault-content">
                    <label className="vault-search">
                      <span aria-hidden="true">⌕</span>
                      <input type="search" value={workflowSearch} onChange={(event) => setWorkflowSearch(event.target.value)} placeholder="Try rubric, JEE, experiment, report, parent…" />
                    </label>
                    <div className="vault-filters">
                      {(["All", ...WORKFLOW_CATEGORIES] as CategoryFilter[]).map((category) => (
                        <button type="button" key={category} className={workflowCategory === category ? "active" : ""} onClick={() => setWorkflowCategory(category)}>{category}</button>
                      ))}
                    </div>
                    <p className="vault-result">{filteredWorkflows.length} missions · {workflowCategory === "All" ? "complete teaching cycle" : CATEGORY_META[workflowCategory].short}</p>
                    <div className="vault-list">
                      {filteredWorkflows.slice(0, workflowSearch ? 18 : 10).map((workflow) => (
                        <button type="button" onClick={() => chooseWorkflow(workflow)} key={workflow.id}>
                          <i>{workflow.glyph}</i><span><strong>{workflow.title}</strong><small>{workflow.summary}</small></span><b>→</b>
                        </button>
                      ))}
                    </div>
                  </div>
                </details>
              </div>
            )}

            {activeStep === 1 && (
              <div className="step-content classroom-step">
                <div className="saved-profile">
                  <span><i>✓</i><strong>{profileLoaded ? "Your saved classroom" : "Your classroom starter"}</strong></span>
                  <p>{selectedBoard.label} · {classLabel} · {form.subject} · {form.outputLanguage}</p>
                  <small>These preferences stay on this device and can be changed below.</small>
                </div>

                <div className="choice-section">
                  <div className="choice-heading"><span>Board or programme</span><Insight>{selectedBoard.help}</Insight></div>
                  <div className="chip-grid board-grid" role="radiogroup" aria-label="Board or programme">
                    {BOARD_OPTIONS.map((board) => (
                      <button type="button" role="radio" aria-checked={boardId === board.id} className={boardId === board.id ? "selected" : ""} onClick={() => chooseBoard(board.id)} key={board.id}>
                        <i aria-hidden="true" />{board.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="choice-section">
                  <div className="choice-heading"><span>Learner stage</span><small>{classLabel}</small></div>
                  <div className="class-grid" role="radiogroup" aria-label="Class level">
                    {Array.from({ length: 12 }, (_, index) => index + 1).map((item) => (
                      <button type="button" role="radio" aria-checked={audienceMode === "school" && grade === item} className={audienceMode === "school" && grade === item ? "selected" : ""} onClick={() => chooseGrade(item)} key={item}>{item}</button>
                    ))}
                  </div>
                  <div className="stage-alternatives" id="field-customLevel" tabIndex={-1}>
                    <span>Beyond school</span>
                    {([
                      ["early", "Pre-primary"],
                      ["undergraduate", "College"],
                      ["vocational", "Vocational"],
                      ["adult", "Adult learning"],
                    ] as [AudienceMode, string][]).map(([mode, label]) => (
                      <button type="button" className={audienceMode === mode ? "selected" : ""} onClick={() => chooseAudienceMode(mode)} key={mode}>{label}</button>
                    ))}
                  </div>
                </div>

                <div className="choice-section">
                  <div className="choice-heading"><span>Subject</span><small>One tap changes the chapter suggestions</small></div>
                  <div className="subject-grid" role="radiogroup" aria-label="Subject">
                    {SUBJECT_LAUNCHERS.map((subject) => (
                      <button type="button" role="radio" aria-checked={form.subject === subject.label} className={form.subject === subject.label ? "selected" : ""} onClick={() => chooseSubject(subject.label)} key={subject.label}>
                        <i>{subject.glyph}</i><span>{subject.label.replace(" / literature", "").replace(" / ICT", "")}</span>
                      </button>
                    ))}
                  </div>
                  <label className="compact-select"><span>Another subject</span><select value={form.subject} onChange={updateField("subject")}>{SUBJECTS.map((subject) => <option key={subject}>{subject}</option>)}</select></label>
                  {form.subject === "Custom subject" && (
                    <label className="wide-input"><span>Your subject</span><input id="field-customSubject" value={form.customSubject} onChange={updateField("customSubject")} placeholder="Type the teaching area…" /></label>
                  )}
                </div>

                <div className="choice-section topic-section">
                  <div className="choice-heading"><span>Chapter or topic</span><small>This is the only detail teachers may need to type</small></div>
                  <div className="topic-chips">
                    {topicSuggestions.slice(0, 6).map((topic) => (
                      <button type="button" key={topic} className={form.topic === topic ? "selected" : ""} onClick={() => setForm((current) => ({ ...current, topic }))}>{topic}</button>
                    ))}
                  </div>
                  <label className="wide-input topic-input"><span>Use another chapter</span><input id="field-topic" value={form.topic} onChange={updateField("topic")} aria-invalid={attemptedAction && !form.topic.trim()} placeholder="Type a different chapter or topic…" /></label>
                </div>

                <div className="choice-pair">
                  <div className="choice-section">
                    <div className="choice-heading"><span>Language</span></div>
                    <div className="language-grid" id="field-outputLanguage" role="radiogroup" aria-label="Output language" tabIndex={-1}>
                      {LANGUAGE_OPTIONS.map((language) => (
                        <button type="button" role="radio" aria-checked={form.outputLanguage === language} className={form.outputLanguage === language ? "selected" : ""} onClick={() => chooseLanguage(language)} key={language}>{language}</button>
                      ))}
                    </div>
                  </div>
                  <div className="choice-section compact-control">
                    <div className="choice-heading"><span>Class size</span><strong>{classSize} learners</strong></div>
                    <input type="range" min="10" max="60" step="5" value={classSize} onChange={(event) => setClassSize(Number(event.target.value))} aria-label="Class size" />
                    <p>{classSize >= 45 ? "Large-class routines and low-friction checks will be prioritised." : "Grouping and teacher attention will stay realistic."}</p>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="step-content finish-step">
                <div className="recommended-format">
                  <span>Recommended for {selectedRecipe?.shortTitle ?? selectedWorkflow.title}</span>
                  <strong>{artifact.label}</strong>
                  <p>{artifact.promise}</p>
                  <div>{artifact.formats.map((format) => <i key={format}>{format}</i>)}</div>
                </div>

                <div className="choice-section">
                  <div className="choice-heading"><span>Choose the actual deliverable</span><Insight>Every option has its own layout, accessibility, interaction and file-quality rules.</Insight></div>
                  {showAllFormats && (
                    <div className="format-families" role="tablist" aria-label="Artifact families">
                      {ARTIFACT_FAMILIES.map((family) => <button type="button" role="tab" aria-selected={artifactFamily === family} className={artifactFamily === family ? "active" : ""} onClick={() => setArtifactFamily(family)} key={family}>{family}</button>)}
                    </div>
                  )}
                  <div className="format-grid">
                    {visibleArtifacts.map((profile) => (
                      <button type="button" className={artifactId === profile.id ? "selected" : ""} onClick={() => chooseArtifact(profile.id)} key={profile.id}>
                        <i>{profile.glyph}</i>
                        <span><strong>{profile.shortLabel}</strong><small>{profile.promise}</small></span>
                        <em>{profile.formats.join(" · ")}</em>
                      </button>
                    ))}
                  </div>
                  <button type="button" className="quiet-button" onClick={() => setShowAllFormats((current) => !current)}>{showAllFormats ? "Show recommended formats" : `Explore all ${ARTIFACT_PROFILES.length} artifact types`}</button>
                </div>

                <div className="choice-section">
                  <div className="choice-heading"><span>Finish level</span><small>Simple teacher language; deep architecture underneath</small></div>
                  <div className="finish-grid" role="radiogroup" aria-label="Finish level">
                    {FINISH_LEVELS.map((item) => (
                      <button type="button" role="radio" aria-checked={finishId === item.id} className={finishId === item.id ? "selected" : ""} onClick={() => chooseFinish(item.id)} key={item.id}>
                        <span>{item.id === "ready" ? "01" : item.id === "polished" ? "02" : "03"}</span><strong>{item.label}</strong><p>{item.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="choice-section">
                  <div className="choice-heading"><span>Visual direction</span><small>Scholarly university is the default—original, never copied branding</small></div>
                  <div className="style-grid" role="radiogroup" aria-label="Visual direction">
                    {VISUAL_STYLES.map((style) => (
                      <button type="button" role="radio" aria-checked={visualStyleId === style.id} className={`${visualStyleId === style.id ? "selected" : ""} style-${style.id}`} onClick={() => setVisualStyleId(style.id)} key={style.id}>
                        <i aria-hidden="true"><b /><b /><b /></i><span><strong>{style.label}</strong><small>{style.description}</small></span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="smart-controls">
                  {usesAssessmentArchitecture && (
                    <div className="smart-control assessment-profile-control">
                      <span><strong>Paper architecture</strong><i>{assessmentSpec?.totalMarks} marks</i></span>
                      <div className="assessment-profile-buttons" role="radiogroup" aria-label="Assessment architecture">
                        {ASSESSMENT_PROFILES.map((profile) => (
                          <button
                            type="button"
                            role="radio"
                            aria-checked={assessmentProfileId === profile.id}
                            className={assessmentProfileId === profile.id ? "selected" : ""}
                            onClick={() => setAssessmentProfileId(profile.id)}
                            key={profile.id}
                          >
                            <strong>{profile.label}</strong>
                            <small>{profile.description}</small>
                          </button>
                        ))}
                      </div>
                      <p>Exact item and mark totals are calculated automatically—nothing is left for the AI to invent.</p>
                    </div>
                  )}
                  <div className="smart-control">
                    <span><strong>{selectedWorkflow.flags?.includes("assessment") ? "Paper duration" : "Classroom time"}</strong><i>{TIME_OPTIONS[timeIndex]} min</i></span>
                    <input type="range" min="0" max={TIME_OPTIONS.length - 1} step="1" value={timeIndex} aria-label={selectedWorkflow.flags?.includes("assessment") ? "Paper duration" : "Classroom time"} onChange={(event) => { const index = Number(event.target.value); setTimeIndex(index); setForm((current) => ({ ...current, duration: `${TIME_OPTIONS[index]} minutes` })); }} />
                    <p>The artifact protects the essentials when time is tight.</p>
                  </div>
                  <div className="smart-control">
                    <span><strong>Thinking demand</strong><i>{DIFFICULTY_OPTIONS[difficultyIndex].label}</i></span>
                    <input type="range" min="0" max={DIFFICULTY_OPTIONS.length - 1} step="1" value={difficultyIndex} aria-label="Thinking demand" onChange={(event) => { const index = Number(event.target.value); setDifficultyIndex(index); setForm((current) => ({ ...current, cognitiveDemand: DIFFICULTY_OPTIONS[index].value })); }} />
                    <p>{DIFFICULTY_OPTIONS[difficultyIndex].note}</p>
                  </div>
                  {usesAssessmentArchitecture && (
                    <div className="smart-control">
                      <span><strong>Question volume</strong><i>{questionCount} items</i></span>
                      <input type="range" min="5" max="50" step="5" value={questionCount} aria-label="Question volume" onChange={(event) => setQuestionCount(Number(event.target.value))} />
                      <p>Counts apply only where the artifact contains questions or checks.</p>
                    </div>
                  )}
                  {artifact.interactive && (
                    <div className="smart-control interaction-control">
                      <span><strong>Interaction style</strong><i>Choose one</i></span>
                      <div>
                        {[
                          "Guided exploration with meaningful feedback, clear progress and a reset path",
                          "Open exploration with visible variables, model assumptions and a reflection trail",
                          "Challenge mode with adaptive hints, multiple attempts and evidence-based feedback",
                        ].map((mode, index) => (
                          <button type="button" className={interactionMode === mode ? "selected" : ""} onClick={() => setInteractionMode(mode)} key={mode}>{["Guided", "Explore", "Challenge"][index]}</button>
                        ))}
                      </div>
                      <p>No fake buttons: every interaction must change understanding, evidence or feedback.</p>
                    </div>
                  )}
                </div>

                <div className="choice-section">
                  <div className="choice-heading"><span>Useful extras</span><small>Recommended ones are already on</small></div>
                  <div className="power-grid">
                    {recommendedAddOns.map((item) => {
                      const selected = addOns.includes(item.id);
                      return <button type="button" className={selected ? "selected" : ""} aria-pressed={selected} onClick={() => toggleAddOn(item.id)} key={item.id}><i>{selected ? "✓" : "+"}</i><span><strong>{item.label}</strong><small>{item.outputSection}</small></span></button>;
                    })}
                  </div>
                  <button type="button" className="quiet-button" onClick={() => setShowAllAddOns((current) => !current)}>{showAllAddOns ? "Show recommended extras" : `Show all ${ADD_ONS.length} extras`}</button>
                </div>

                <details className="expert-settings" ref={expertDetailsRef}>
                  <summary><span><strong>Optional expert details</strong><small>Exact material, goals and boundaries only when they matter</small></span><i>＋</i></summary>
                  <div className="expert-grid">
                    <label><span>Exact goal</span><textarea id="field-objective" rows={3} value={form.objective} onChange={updateField("objective")} /></label>
                    <label><span>Non-negotiables</span><textarea id="field-details" rows={3} value={form.details} onChange={updateField("details")} /></label>
                    <label><span>Prior knowledge</span><textarea id="field-priorKnowledge" rows={3} value={form.priorKnowledge} onChange={updateField("priorKnowledge")} /></label>
                    <label><span>Success evidence</span><textarea id="field-successEvidence" rows={3} value={form.successEvidence} onChange={updateField("successEvidence")} /></label>
                    <label className="wide"><span>Material to transform</span><textarea id="field-taskMaterial" rows={5} value={form.taskMaterial} onChange={updateField("taskMaterial")} placeholder="Paste an anonymised paper, draft, learner response or resource…" /></label>
                    <label className="wide"><span>Authoritative source or blueprint</span><textarea id="field-sourceMaterial" rows={5} value={form.sourceMaterial} onChange={updateField("sourceMaterial")} placeholder="Paste the current syllabus extract, verified blueprint or rubric…" /></label>
                    <label className="wide"><span>Must avoid or preserve</span><textarea id="field-mustAvoid" rows={3} value={form.mustAvoid} onChange={updateField("mustAvoid")} /></label>
                  </div>
                </details>
              </div>
            )}

            {activeStep === 3 && (
              <div className="step-content launch-step">
                <section ref={launchPanelRef} tabIndex={-1} className="provider-choice" id="launch-ai" data-testid="launch-ai-panel" aria-labelledby="launch-ai-title">
                  <div className="provider-launch-heading">
                    <span>Launch AI · final step</span>
                    <h3 id="launch-ai-title">Copy once. Open your AI. Paste.</h3>
                    <p>The studio has already written the technical instructions. Choose an AI below—you do not need to compose or edit a prompt.</p>
                  </div>

                  <div className="handoff-steps" aria-label="Three-step AI handoff">
                    <span><i>1</i><strong>Choose AI</strong><small>ChatGPT, Claude, Gemini or another</small></span>
                    <b aria-hidden="true">→</b>
                    <span><i>2</i><strong>Open + copy</strong><small>The instructions copy automatically</small></span>
                    <b aria-hidden="true">→</b>
                    <span><i>3</i><strong>Paste once</strong><small>The AI builds the requested files</small></span>
                  </div>

                  {errors.length > 0 && (
                    <div className="launch-blocker" role="alert">
                      <span><i>!</i><strong>One detail is needed before launch</strong><small>{errors[0].message}</small></span>
                      <button type="button" onClick={() => focusIssue(errors[0].field)}>Fix this detail →</button>
                    </div>
                  )}

                  <button
                    type="button"
                    className={`create-artifact-button ${errors.length ? "blocked" : ""}`}
                    onClick={() => void prepareProvider(selectedProvider.id)}
                    disabled={Boolean(launchingProviderId)}
                  >
                    <span><strong>{launchingProviderId === selectedProvider.id ? `Preparing ${selectedProvider.name}…` : `Copy instructions & open ${selectedProvider.name}`}</strong><small>{errors.length ? "Fix the highlighted detail first—your AI choices will remain here" : `Start a fresh ${selectedProvider.name} chat for ${artifact.shortLabel}`}</small></span><i>↗</i>
                  </button>

                  <div className="provider-actions">
                    <div className="choice-heading"><span>Or open another AI directly</span><small>Recommended choices appear first; every option stays visible</small></div>
                    <button type="button" className="copy-only-button" onClick={copyPrompt} disabled={Boolean(launchingProviderId)}>Copy instructions only</button>
                  </div>
                  <div className="provider-cards" aria-label="Available AI providers">
                    {launchProviders.map((provider, index) => {
                      const recommended = artifact.recommendedProviders.includes(provider.id);
                      return (
                        <button
                          type="button"
                          data-provider={provider.id}
                          className={selectedProviderId === provider.id ? "selected" : ""}
                          onClick={() => void prepareProvider(provider.id)}
                          disabled={Boolean(launchingProviderId)}
                          key={provider.id}
                        >
                          <i>{provider.glyph}</i>
                          <span><strong>{provider.name}</strong><small>{provider.note}</small></span>
                          <em>{index === 0 ? "Best match" : recommended ? "Recommended" : "Available"}</em>
                          <b>{launchingProviderId === provider.id ? "Preparing…" : "Copy & open ↗"}</b>
                        </button>
                      );
                    })}
                  </div>
                  <p className="handoff-note">The selected AI opens in a new tab. Paste once; file-generation support can vary by provider, plan and model.</p>
                  {launchStatus && <p className="launch-status" role="status" aria-live="polite">{launchStatus}</p>}
                  {manualProvider && (
                    <div className="manual-launch-recovery" role="group" aria-label={`${manualProvider.name} manual launch recovery`}>
                      <span><strong>Safe fallback ready</strong><small>The full instructions are visible and selected. Copy them if needed before opening the AI.</small></span>
                      <a href={manualProvider.url} target="_blank" rel="noopener noreferrer" onClick={() => {
                        setLaunched(true);
                        setManualProviderId(null);
                        setLaunchStatus(`${manualProvider.name} opened. Paste the copied instructions once to create ${artifact.shortLabel}.`);
                      }}>After copying, open {manualProvider.name} ↗</a>
                    </div>
                  )}
                </section>

                <div className="launch-receipt">
                  <span>What the AI will create</span>
                  <h3>{classLabel} {form.topic} · {artifact.shortLabel}</h3>
                  <p>{artifact.promise}</p>
                  <div className="receipt-files">
                    {result.artifactManifest.map((file) => <span key={`${file.label}-${file.format}`}><i>{file.format}</i><strong>{file.label}</strong></span>)}
                  </div>
                  <ul>
                    <li>Rejects placeholders and incomplete options</li>
                    <li>{usesAssessmentArchitecture ? "Separates student and teacher files physically" : "Verifies every required file and audience boundary"}</li>
                    <li>Embeds and render-checks language fonts</li>
                    <li>Requires numeric PASS evidence before release</li>
                  </ul>
                </div>

                {warnings.length > 0 && (
                  <div className="launch-issues" aria-live="polite">
                    {warnings.slice(0, 2).map((issue) => <button type="button" className="warning" onClick={() => focusIssue(issue.field)} key={issue.message}><strong>Helpful check</strong>{issue.message}</button>)}
                  </div>
                )}

                <div className={`followup-map ${launched ? "active" : ""}`}>
                  <div className="followup-heading">
                    <span>{launched ? "AI opened · stay in the same chat" : "After the AI returns your file"}</span>
                    <h3>What should happen next?</h3>
                    <p>Tap the problem you see. The right follow-up is copied without losing your class, topic, format or creator mark.</p>
                  </div>
                  <div className="flow-spine" aria-label="Artifact improvement flow">
                    <span className="complete"><i>1</i>Choose</span><b>→</b>
                    <span className="complete"><i>2</i>Build</span><b>→</b>
                    <span className={launched ? "current" : ""}><i>3</i>Check</span><b>→</b>
                    <span><i>4</i>Improve</span><b>→</b>
                    <span><i>5</i>Share</span>
                  </div>
                  <div className="followup-grid">
                    {FOLLOW_UP_PATHS.map((path) => (
                      <button type="button" className={`followup-${path.accent}`} onClick={() => copyFollowUp(path.id)} key={path.id}>
                        <small>{path.question}</small><strong>{path.label}</strong><span>{path.description}</span><i>Copy same-chat move →</i>
                      </button>
                    ))}
                  </div>
                  {followUpTrail.length > 0 && (
                    <div className="followup-trail" aria-live="polite"><span>Your improvement trail</span>{followUpTrail.map((item, index) => <i key={`${item}-${index}`}>{index + 1}. {item}</i>)}<button type="button" onClick={() => setFollowUpTrail((current) => current.slice(0, -1))}>Undo last</button></div>
                  )}
                </div>

                <details className="technical-prompt" ref={technicalPromptRef}>
                  <summary><span><strong>Advanced · inspect build instructions</strong><small>The teacher never needs to edit this</small></span><i>＋</i></summary>
                  <div>
                    <p>{result.prompt.length.toLocaleString()} characters · hidden creator marker included · file-delivery contract active</p>
                    <textarea ref={promptTextareaRef} value={result.prompt} readOnly aria-label="Generated artifact build instructions" spellCheck={false} />
                    <button type="button" onClick={copyPrompt}>Copy build instructions</button>
                  </div>
                </details>
              </div>
            )}

          </section>

          <aside className="blueprint-panel">
            <ArtifactStage
              artifact={artifact}
              mission={selectedRecipe?.title ?? selectedWorkflow.title}
              topic={form.topic}
              subject={form.subject}
              classLabel={classLabel}
              board={selectedBoard.label}
              files={result.artifactManifest}
              assessmentMode={Boolean(selectedWorkflow.flags?.includes("assessment"))}
            />
            <div className="confidence-card">
              <div><span>Artifact confidence</span><strong>{result.score}%</strong></div>
              <i><b style={{ width: `${result.score}%` }} /></i>
              <p>{result.status}. {errors.length ? "One essential detail needs attention." : warnings.length ? "Ready with a helpful verification note." : "Ready for file creation."}</p>
            </div>
            <div className="blueprint-summary">
              <span>Built into every mission</span>
              <ul><li>Real-file delivery contract</li><li>Topic-specific originality test</li><li>Indian classroom constraints</li><li>Production and answer audit</li><li>Metadata-only creator signature</li></ul>
            </div>
          </aside>
        </div>

        <div className="maker-actions">
          <button type="button" className="back-button" onClick={() => moveToStep(Math.max(0, activeStep - 1) as StepId)} disabled={activeStep === 0}>← Back</button>
          <p aria-live="polite" role="status">{copyStatus || `${selectedRecipe?.shortTitle ?? selectedWorkflow.title} · ${classLabel} · ${artifact.shortLabel}`}</p>
          {activeStep < 3 ? (
            <button type="button" className="next-button" onClick={goNext}>{nextLabel} →</button>
          ) : (
            <button type="button" className="next-button" disabled={Boolean(launchingProviderId)} onClick={() => void prepareProvider(selectedProvider.id)}>{launchingProviderId === selectedProvider.id ? `Preparing ${selectedProvider.name}…` : `Copy & open ${selectedProvider.name} →`}</button>
          )}
        </div>
      </section>

      <section className="tool-shelf">
        <details>
          <summary><span><strong>Your connected teacher-tool shelf</strong><small>The strongest parts of your previous studios remain one tap away</small></span><i>＋</i></summary>
          <div>{ECOSYSTEM_TOOLS.map((tool) => <a href={tool.url} target="_blank" rel="noopener noreferrer" key={tool.title}><i>{tool.glyph}</i><span><small>{tool.metric}</small><strong>{tool.title}</strong><p>{tool.description}</p></span><b>↗</b></a>)}</div>
        </details>
      </section>

      <footer className="maker-footer">
        <span><strong>Teacher Prompt Studio</strong><small>Real artifacts. Deep prompts. Comfortable flow.</small></span>
        <p>No login · No tracking · No learner data uploaded</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
