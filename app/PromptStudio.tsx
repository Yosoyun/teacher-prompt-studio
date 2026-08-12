"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { buildAssessmentSpec } from "./assessment-spec";
import {
  ARTIFACT_PROFILES,
  ASSESSMENT_PROFILES,
  CREATOR_MARKER,
  CREATOR_SIGNATURE,
  FINISH_LEVELS,
  FOLLOW_UP_PATHS,
  VISUAL_STYLES,
  defaultArtifactId,
  getArtifactProfile,
  type ArtifactId,
  type AssessmentProfileId,
} from "./artifact-data";
import {
  ADD_ONS,
  SUBJECTS,
  WORKFLOW_CATEGORIES,
  WORKFLOWS,
  type PromptWorkflow,
} from "./prompt-data";
import { buildTeacherPrompt, type BuilderInput } from "./prompt-engine";
import {
  AI_PROVIDERS,
  BOARD_OPTIONS,
  DEPTH_OPTIONS,
  DIFFICULTY_OPTIONS,
  LANGUAGE_OPTIONS,
  RECIPE_CATEGORIES,
  STUDIO_RECIPES,
  TIME_OPTIONS,
  TOPIC_BANK,
  type RecipeCategory,
  type StudioRecipe,
} from "./studio-presets";

type AudienceMode = "school" | "early" | "undergraduate" | "vocational" | "adult";
type StepId = 0 | 1 | 2;

const DEFAULT_RECIPE = STUDIO_RECIPES.find((item) => item.id === "question-paper") ?? STUDIO_RECIPES[0];
const DEFAULT_WORKFLOW = WORKFLOWS.find(
  (item) => item.id === DEFAULT_RECIPE.workflowId,
) as PromptWorkflow;
const DEFAULT_ARTIFACT = defaultArtifactId(
  DEFAULT_RECIPE.id,
  DEFAULT_WORKFLOW.id,
  DEFAULT_WORKFLOW.category,
);

const QUICK_RECIPE_IDS = [
  "question-paper",
  "daily-dpp",
  "theory-notes",
  "lesson-plan",
  "slide-deck",
  "interactive-simulation",
];

const QUICK_RECIPES = QUICK_RECIPE_IDS
  .map((id) => STUDIO_RECIPES.find((recipe) => recipe.id === id))
  .filter((recipe): recipe is StudioRecipe => Boolean(recipe));

const STRUCTURED_ITEM_WORKFLOW_IDS = new Set([
  "quiz-test",
  "competitive-exam",
  "worksheet-homework",
  "question-bank",
]);

const STEP_META: Array<{ id: StepId; label: string; hint: string }> = [
  { id: 0, label: "Choose", hint: "What to make" },
  { id: 1, label: "Class details", hint: "Who it is for" },
  { id: 2, label: "Create with AI", hint: "Review and open" },
];

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

const unique = (items: string[]) => [...new Set(items)];

const gradeToLevel = (grade: number) => {
  if (grade <= 5) return "Primary / elementary";
  if (grade <= 8) return "Middle school";
  if (grade <= 10) return "Secondary / high school";
  return "Senior secondary / exam prep";
};

const stageLabels: Record<Exclude<AudienceMode, "school">, string> = {
  early: "Pre-primary / early years",
  undergraduate: "College / undergraduate",
  vocational: "Vocational / skills training",
  adult: "Adult learning",
};

export default function PromptStudio() {
  const [activeStep, setActiveStep] = useState<StepId>(0);
  const [maxStep, setMaxStep] = useState<StepId>(0);
  const [selectedWorkflow, setSelectedWorkflow] = useState<PromptWorkflow>(DEFAULT_WORKFLOW);
  const [selectedRecipeId, setSelectedRecipeId] = useState(DEFAULT_RECIPE.id);
  const [moreCategory, setMoreCategory] = useState<RecipeCategory>("Popular");
  const [form, setForm] = useState<FormState>(initialForm);
  const [addOns, setAddOns] = useState<string[]>(
    unique([...DEFAULT_WORKFLOW.defaultAddOns, ...DEFAULT_RECIPE.addOns]),
  );
  const [artifactId, setArtifactId] = useState<ArtifactId>(DEFAULT_ARTIFACT);
  const [visualStyleId, setVisualStyleId] = useState("academic-editorial");
  const [finishId, setFinishId] = useState("polished");
  const [assessmentProfileId, setAssessmentProfileId] =
    useState<AssessmentProfileId>("balanced-academic");
  const [interactionMode, setInteractionMode] = useState(
    "Guided exploration with meaningful feedback, clear progress and a reset path",
  );
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
  const [launched, setLaunched] = useState(false);
  const [launchStatus, setLaunchStatus] = useState("");
  const [launchingProviderId, setLaunchingProviderId] = useState<string | null>(null);
  const [manualProviderId, setManualProviderId] = useState<string | null>(null);
  const [manualCopyText, setManualCopyText] = useState("");
  const [manualCopyLabel, setManualCopyLabel] = useState("Build instructions");
  const [showMoreProviders, setShowMoreProviders] = useState(false);
  const [followUpTrail, setFollowUpTrail] = useState<string[]>([]);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const advancedDetailsRef = useRef<HTMLDetailsElement>(null);
  const technicalPromptRef = useRef<HTMLDetailsElement>(null);
  const promptTextareaRef = useRef<HTMLTextAreaElement>(null);
  const firstStepChange = useRef(true);

  const selectedRecipe = STUDIO_RECIPES.find((recipe) => recipe.id === selectedRecipeId);
  const selectedBoard = BOARD_OPTIONS.find((board) => board.id === boardId) ?? BOARD_OPTIONS[0];
  const artifact = getArtifactProfile(artifactId);
  const selectedProvider =
    AI_PROVIDERS.find((provider) => provider.id === selectedProviderId) ?? AI_PROVIDERS[0];
  const manualProvider = manualProviderId
    ? AI_PROVIDERS.find((provider) => provider.id === manualProviderId)
    : undefined;
  const visualStyle =
    VISUAL_STYLES.find((style) => style.id === visualStyleId) ?? VISUAL_STYLES[0];
  const finish = FINISH_LEVELS.find((item) => item.id === finishId) ?? FINISH_LEVELS[1];
  const selectedAssessmentProfile =
    ASSESSMENT_PROFILES.find((profile) => profile.id === assessmentProfileId) ??
    ASSESSMENT_PROFILES[0];
  const usesAssessmentArchitecture = STRUCTURED_ITEM_WORKFLOW_IDS.has(selectedWorkflow.id);
  const assessmentSpec = useMemo(
    () =>
      usesAssessmentArchitecture
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
  const stageValue = audienceMode === "school" ? `school-${grade}` : audienceMode;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem("teacher-prompt-studio-classroom");
        if (saved) {
          const profile = JSON.parse(saved) as {
            boardId?: string;
            grade?: number;
            subject?: string;
            topic?: string;
            outputLanguage?: string;
            classSize?: number;
          };
          const savedBoard = BOARD_OPTIONS.find((item) => item.id === profile.boardId);
          const savedSubject = SUBJECTS.includes(profile.subject ?? "")
            ? profile.subject
            : undefined;
          const savedLanguage = LANGUAGE_OPTIONS.includes(profile.outputLanguage ?? "")
            ? profile.outputLanguage
            : undefined;
          const savedGrade = Math.min(12, Math.max(1, Number(profile.grade) || 10));
          const subjectForTopic = savedSubject ?? initialForm.subject;
          const validSavedTopic =
            typeof profile.topic === "string" && profile.topic.trim()
              ? profile.topic.trim()
              : TOPIC_BANK[subjectForTopic]?.[0] ?? initialForm.topic;
          setBoardId(savedBoard?.id ?? "cbse");
          setGrade(savedGrade);
          setClassSize(Math.min(60, Math.max(10, Number(profile.classSize) || 40)));
          setForm((current) => ({
            ...current,
            curriculum: savedBoard?.value ?? current.curriculum,
            subject: savedSubject ?? current.subject,
            topic: validSavedTopic,
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
        JSON.stringify({
          boardId,
          grade,
          subject: form.subject,
          topic: form.topic,
          outputLanguage: form.outputLanguage,
          classSize,
        }),
      );
    } catch {
      // Private browsing can block local preferences; the maker still works.
    }
  }, [boardId, classSize, form.outputLanguage, form.subject, form.topic, grade, profileReady]);

  useEffect(() => {
    if (firstStepChange.current) {
      firstStepChange.current = false;
      return;
    }
    window.setTimeout(() => {
      stepHeadingRef.current?.focus();
      document.getElementById("studio")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }, [activeStep]);

  const builderInput: BuilderInput = useMemo(
    () => ({
      workflow: selectedWorkflow,
      recipeId: selectedRecipeId,
      recipeTitle: selectedRecipe?.title ?? selectedWorkflow.title,
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
      details: `${form.details}\n\nTeacher-set controls: ${
        assessmentSpec
          ? `${assessmentSpec.profileLabel}; EXACTLY ${assessmentSpec.totalItems} items and ${assessmentSpec.totalMarks} marks using the structured assessment specification`
          : "no fixed assessment distribution"
      }; ${DIFFICULTY_OPTIONS[difficultyIndex].label.toLowerCase()} cognitive demand; ${finish.label.toLowerCase()} production finish. Apply only controls that make sense for the selected artifact.`,
      addOns,
    }),
    [
      selectedWorkflow,
      selectedRecipeId,
      artifact,
      assessmentSpec,
      selectedRecipe,
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

  const result = useMemo(() => buildTeacherPrompt(builderInput), [builderInput]);
  const errors = result.issues.filter((issue) => issue.severity === "error");
  const warnings = result.issues.filter((issue) => issue.severity === "warning");
  const recommendedAddOns = useMemo(() => {
    const priority = new Set([
      ...selectedWorkflow.defaultAddOns,
      ...addOns,
      ...(selectedRecipe?.addOns ?? []),
    ]);
    return [
      ...ADD_ONS.filter((item) => priority.has(item.id)),
      ...ADD_ONS.filter((item) => !priority.has(item.id)),
    ].slice(0, 8);
  }, [addOns, selectedRecipe, selectedWorkflow]);

  const updateField =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setCopyStatus("");
      setLaunchStatus("");
      setManualProviderId(null);
      setManualCopyText("");
      setLaunched(false);
      setFollowUpTrail([]);
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

  const resetHandoff = () => {
    setLaunched(false);
    setLaunchStatus("");
    setLaunchingProviderId(null);
    setManualProviderId(null);
    setManualCopyText("");
    setFollowUpTrail([]);
  };

  const applyRecipe = (recipe: StudioRecipe) => {
    const workflow = WORKFLOWS.find((item) => item.id === recipe.workflowId);
    if (!workflow) return;
    const nextArtifactId = defaultArtifactId(recipe.id, workflow.id, workflow.category);
    const nextArtifact = getArtifactProfile(nextArtifactId);
    setSelectedRecipeId(recipe.id);
    setSelectedWorkflow(workflow);
    setArtifactId(nextArtifactId);
    setSelectedProviderId(nextArtifact.recommendedProviders[0] ?? "chatgpt");
    setForm((current) => ({
      ...current,
      objective: recipe.objective,
      details: recipe.details,
      powerMode: recipe.powerMode ?? "Expert",
      outputForm:
        recipe.category === "Assess" || recipe.id.includes("paper")
          ? "Separate teacher and learner files"
          : "Ready-to-use final artifact",
    }));
    setAddOns(unique([...workflow.defaultAddOns, ...recipe.addOns]));
    resetHandoff();
    setCopyStatus(`${recipe.shortTitle} selected. The best file type is already chosen.`);
    advanceTo(1);
  };

  const chooseWorkflow = (workflow: PromptWorkflow) => {
    const nextArtifactId = defaultArtifactId("", workflow.id, workflow.category);
    const nextArtifact = getArtifactProfile(nextArtifactId);
    setSelectedRecipeId("");
    setSelectedWorkflow(workflow);
    setArtifactId(nextArtifactId);
    setSelectedProviderId(nextArtifact.recommendedProviders[0] ?? "chatgpt");
    setForm((current) => ({
      ...current,
      objective: workflow.defaultGoal,
      details: "",
      outputForm: workflow.flags?.includes("assessment")
        ? "Separate teacher and learner files"
        : "Ready-to-use final artifact",
    }));
    setAddOns(workflow.defaultAddOns);
    resetHandoff();
    setCopyStatus(`${workflow.title} selected. The output settings are ready.`);
    advanceTo(1);
  };

  const chooseBoard = (id: string) => {
    const resolvedId =
      id === "icse" && grade > 10 ? "isc" : id === "isc" && grade <= 10 ? "icse" : id;
    const board = BOARD_OPTIONS.find((item) => item.id === resolvedId);
    if (!board) return;
    setBoardId(resolvedId);
    setForm((current) => ({ ...current, curriculum: board.value, countryRegion: "India" }));
    resetHandoff();
  };

  const chooseGrade = (nextGrade: number) => {
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
    }));
    resetHandoff();
  };

  const chooseStage = (value: string) => {
    if (value.startsWith("school-")) {
      chooseGrade(Number(value.replace("school-", "")));
      return;
    }
    const mode = value as Exclude<AudienceMode, "school">;
    setAudienceMode(mode);
    setForm((current) => ({
      ...current,
      level: stageLabels[mode],
      learnerContext: "Mixed-readiness learners with varied prior experience",
    }));
    resetHandoff();
  };

  const chooseSubject = (subject: string) => {
    const firstTopic = TOPIC_BANK[subject]?.[0] ?? "Introduce a new concept";
    setForm((current) => ({ ...current, subject, topic: firstTopic }));
    setCopyStatus("");
    resetHandoff();
  };

  const chooseLanguage = (language: string) => {
    setForm((current) => ({ ...current, outputLanguage: language }));
    setAddOns((current) =>
      language === "English"
        ? current.filter((id) => id !== "translation")
        : unique([...current, "translation"]),
    );
    resetHandoff();
  };

  const chooseArtifact = (id: ArtifactId) => {
    const next = getArtifactProfile(id);
    setArtifactId(id);
    setSelectedProviderId(next.recommendedProviders[0] ?? "chatgpt");
    resetHandoff();
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
    resetHandoff();
  };

  const toggleAddOn = (id: string) => {
    setAddOns((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    resetHandoff();
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

  const revealPromptForManualCopy = (text: string, label = "Build instructions") => {
    setManualCopyText(text);
    setManualCopyLabel(label);
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
    const advancedFields = new Set<keyof BuilderInput>([
      "objective",
      "details",
      "priorKnowledge",
      "successEvidence",
      "taskMaterial",
      "sourceMaterial",
      "mustAvoid",
    ]);
    const targetStep: StepId = advancedFields.has(field) ? 2 : 1;
    setMaxStep((current) => Math.max(current, targetStep) as StepId);
    setActiveStep(targetStep);
    window.setTimeout(() => {
      if (advancedFields.has(field) && advancedDetailsRef.current) {
        advancedDetailsRef.current.open = true;
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
    setManualCopyText("");
    setAttemptedAction(true);
    const current = currentPromptResult();
    const currentErrors = current.issues.filter((issue) => issue.severity === "error");
    if (currentErrors.length) {
      const message = "One detail needs attention before the AI can open.";
      setLaunched(false);
      setLaunchStatus(message);
      setCopyStatus(message);
      return;
    }

    const launchWindow = window.open("about:blank", "_blank");
    if (launchWindow) {
      try {
        launchWindow.opener = null;
        launchWindow.document.title = `Preparing ${provider.name}…`;
        launchWindow.document.body.style.cssText =
          "margin:0;display:grid;min-height:100vh;place-items:center;background:#17211d;color:#fffdf7;font:700 18px system-ui,sans-serif;text-align:center;padding:24px";
        launchWindow.document.body.textContent = `Preparing ${provider.name} and copying your instructions…`;
      } catch {
        // The reserved tab can still be navigated if its temporary page cannot be styled.
      }
    }

    setLaunchingProviderId(provider.id);
    setLaunchStatus(`Copying instructions and opening ${provider.name}…`);
    const copied = await copyText(current.prompt);
    try {
      if (copied) {
        setManualCopyText("");
        if (launchWindow && !launchWindow.closed) {
          launchWindow.location.replace(provider.url);
          launchWindow.focus();
          setLaunched(true);
          const message = `${provider.name} opened. Paste once to create your files.`;
          setLaunchStatus(message);
          setCopyStatus(message);
        } else {
          setLaunched(false);
          setManualProviderId(provider.id);
          const message = `Instructions copied. Your browser blocked the new tab—open ${provider.name} below, then paste once.`;
          setLaunchStatus(message);
          setCopyStatus(message);
        }
      } else {
        launchWindow?.close();
        setLaunched(false);
        setManualProviderId(provider.id);
        const message = "Clipboard access was blocked. The instructions are selected below for manual copying.";
        setLaunchStatus(message);
        setCopyStatus(message);
        revealPromptForManualCopy(current.prompt);
      }
    } catch {
      launchWindow?.close();
      setLaunched(false);
      setManualProviderId(provider.id);
      const message = `The ${provider.name} handoff could not finish. Copy the selected instructions below, then open the AI.`;
      setLaunchStatus(message);
      setCopyStatus(message);
      revealPromptForManualCopy(current.prompt);
    } finally {
      setLaunchingProviderId(null);
    }
  };

  const copyPrompt = async () => {
    const current = currentPromptResult();
    const currentErrors = current.issues.filter((issue) => issue.severity === "error");
    if (currentErrors.length) {
      setAttemptedAction(true);
      setLaunched(false);
      const message = "One required or privacy-sensitive detail needs attention before copying.";
      setLaunchStatus(message);
      setCopyStatus(message);
      return;
    }
    const copied = await copyText(current.prompt);
    const message = copied
      ? "Instructions copied. Open any AI and paste once to create the files."
      : "Copy was blocked. The instructions are open and selected below.";
    setManualProviderId(copied ? null : selectedProvider.id);
    setLaunchStatus(message);
    setCopyStatus(message);
    if (!copied) revealPromptForManualCopy(current.prompt);
  };

  const copyVisibleInstructions = async () => {
    if (!manualCopyText) {
      await copyPrompt();
      return;
    }
    const copied = await copyText(manualCopyText);
    const message = copied
      ? `${manualCopyLabel} copied. Paste it into the same AI chat.`
      : `${manualCopyLabel} remains selected. Use your device copy command.`;
    setCopyStatus(message);
    setLaunchStatus(message);
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
    const current = currentPromptResult();
    const refinement = current.refinements.find((item) => item.id === map[id]);
    if (!refinement) return;
    const copied = await copyText(refinement.prompt);
    if (copied) {
      setFollowUpTrail((trail) => [...trail, refinement.label]);
      setCopyStatus(`${refinement.label} copied. Paste it in the same AI chat.`);
      setLaunchStatus(`${refinement.label} copied. Paste it in the same AI chat.`);
    } else {
      revealPromptForManualCopy(refinement.prompt, `${refinement.label} follow-up`);
      setCopyStatus("The exact follow-up is selected below for manual copying.");
    }
  };

  const continueToReview = () => {
    if (!form.topic.trim()) {
      setAttemptedAction(true);
      setCopyStatus("Choose or type a chapter first.");
      document.getElementById("field-topic")?.focus();
      return;
    }
    const current = currentPromptResult();
    const currentErrors = current.issues.filter((issue) => issue.severity === "error");
    if (currentErrors.length) {
      setAttemptedAction(true);
      setCopyStatus(currentErrors[0].message);
      focusIssue(currentErrors[0].field);
      return;
    }
    setAttemptedAction(false);
    advanceTo(2);
  };

  const resetBuilder = () => {
    setActiveStep(0);
    setMaxStep(0);
    setSelectedWorkflow(DEFAULT_WORKFLOW);
    setSelectedRecipeId(DEFAULT_RECIPE.id);
    setMoreCategory("Popular");
    setForm((current) => ({
      ...initialForm,
      subject: current.subject,
      customSubject: current.customSubject,
      level: current.level,
      customLevel: current.customLevel,
      topic: current.topic,
      curriculum: current.curriculum,
      learnerContext: current.learnerContext,
      outputLanguage: current.outputLanguage,
    }));
    setAddOns(unique([...DEFAULT_WORKFLOW.defaultAddOns, ...DEFAULT_RECIPE.addOns]));
    setArtifactId(DEFAULT_ARTIFACT);
    setVisualStyleId("academic-editorial");
    setFinishId("polished");
    setAssessmentProfileId("balanced-academic");
    setSelectedProviderId("chatgpt");
    setTimeIndex(3);
    setDifficultyIndex(1);
    setQuestionCount(20);
    setShowMoreProviders(false);
    setAttemptedAction(false);
    resetHandoff();
    setCopyStatus("");
  };

  return (
    <main className="studio-shell">
      <a className="skip-link" href="#studio">Skip to the maker</a>

      <header className="studio-header">
        <a className="studio-brand" href="#studio" aria-label="Teacher Prompt Studio home">
          <span aria-hidden="true">T</span>
          <div>
            <strong>Teacher Prompt Studio</strong>
            <small>Ready-to-use files, not generic chat</small>
          </div>
        </a>
        <div className="privacy-pill"><i aria-hidden="true" /> Your work stays in this browser</div>
        {activeStep > 0 && (
          <button type="button" className="reset-button" onClick={resetBuilder}>Start over</button>
        )}
      </header>

      <section className="studio" id="studio" aria-label="Teaching material maker">
        <nav className="simple-steps" aria-label="Three creation steps">
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
                <span><strong>{step.label}</strong><small>{step.hint}</small></span>
              </button>
            );
          })}
        </nav>

        {activeStep === 0 && (
          <section className="step-panel choose-panel" aria-labelledby="step-title">
            <div className="step-intro">
              <span>For teachers · about 30 seconds</span>
              <h1 id="step-title" tabIndex={-1} ref={stepHeadingRef}>What do you want to make today?</h1>
              <p>Tap one. We choose the file type, quality checks and expert instructions for you.</p>
            </div>

            <div className="quick-recipes">
              {QUICK_RECIPES.map((recipe) => (
                <button type="button" key={recipe.id} onClick={() => applyRecipe(recipe)}>
                  <i aria-hidden="true">{recipe.glyph}</i>
                  <span><strong>{recipe.shortTitle}</strong><small>{recipe.summary}</small></span>
                  <b aria-hidden="true">→</b>
                </button>
              ))}
            </div>

            <details className="more-materials">
              <summary>
                <span><strong>See more teaching materials</strong><small>{STUDIO_RECIPES.length} ready templates and {WORKFLOWS.length} specialist jobs</small></span>
                <i aria-hidden="true">＋</i>
              </summary>
              <div className="more-materials-body">
                <label className="simple-field compact-field">
                  <span>Show templates for</span>
                  <select value={moreCategory} onChange={(event) => setMoreCategory(event.target.value as RecipeCategory)}>
                    {RECIPE_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
                  </select>
                </label>
                <div className="more-recipe-grid">
                  {STUDIO_RECIPES.filter((recipe) => recipe.category === moreCategory).map((recipe) => (
                    <button type="button" onClick={() => applyRecipe(recipe)} key={recipe.id}>
                      <i>{recipe.glyph}</i><span><strong>{recipe.shortTitle}</strong><small>{recipe.summary}</small></span><b>→</b>
                    </button>
                  ))}
                </div>
                <label className="specialist-picker">
                  <span><strong>Can&apos;t find it?</strong><small>Choose from the complete specialist library.</small></span>
                  <select value="" onChange={(event) => {
                    const workflow = WORKFLOWS.find((item) => item.id === event.target.value);
                    if (workflow) chooseWorkflow(workflow);
                  }}>
                    <option value="">Choose a specialist teacher job…</option>
                    {WORKFLOW_CATEGORIES.map((category) => (
                      <optgroup label={category} key={category}>
                        {WORKFLOWS.filter((workflow) => workflow.category === category).map((workflow) => (
                          <option value={workflow.id} key={workflow.id}>{workflow.title}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </label>
              </div>
            </details>

            <div className="quiet-proof">
              <span><i>✓</i> Every build asks for finished PDF, DOCX, slides, image or website files—not an ordinary text answer.</span>
              <a href="./samples/class-10-quadratics-student-bilingual.pdf" target="_blank" rel="noopener noreferrer">See a finished example ↗</a>
            </div>
          </section>
        )}

        {activeStep === 1 && (
          <section className="step-panel class-panel" aria-labelledby="step-title">
            <div className="step-intro compact">
              <span>Step 2 · {selectedRecipe?.shortTitle ?? selectedWorkflow.title}</span>
              <h1 id="step-title" tabIndex={-1} ref={stepHeadingRef}>Tell us about your class</h1>
              <p>Five simple choices. We remember them on this device for next time.</p>
            </div>

            {profileLoaded && <p className="saved-note"><i>✓</i> Your last classroom is ready. Change only what is different today.</p>}

            <div className="class-form">
              <label className="simple-field">
                <span>Board or programme</span>
                <select value={boardId} onChange={(event) => chooseBoard(event.target.value)}>
                  {BOARD_OPTIONS.map((board) => <option value={board.id} key={board.id}>{board.label}</option>)}
                </select>
                <small>{selectedBoard.help}</small>
              </label>

              <label className="simple-field">
                <span>Class or learner stage</span>
                <select value={stageValue} onChange={(event) => chooseStage(event.target.value)}>
                  {Array.from({ length: 12 }, (_, index) => index + 1).map((item) => (
                    <option value={`school-${item}`} key={item}>Class {item}</option>
                  ))}
                  <option value="early">Pre-primary / early years</option>
                  <option value="undergraduate">College / undergraduate</option>
                  <option value="vocational">Vocational / skills training</option>
                  <option value="adult">Adult learning</option>
                </select>
                <small>We adjust vocabulary, pacing and support.</small>
              </label>

              <label className="simple-field">
                <span>Subject</span>
                <select value={form.subject} onChange={(event) => chooseSubject(event.target.value)}>
                  {SUBJECTS.map((subject) => <option key={subject}>{subject}</option>)}
                </select>
                <small>Chapter suggestions change automatically.</small>
              </label>

              <label className="simple-field">
                <span>Language</span>
                <select value={form.outputLanguage} onChange={(event) => chooseLanguage(event.target.value)}>
                  {LANGUAGE_OPTIONS.map((language) => <option key={language}>{language}</option>)}
                </select>
                <small>Multilingual files include font checks.</small>
              </label>
            </div>

            {form.subject === "Custom subject" && (
              <label className="simple-field full-field">
                <span>Your subject</span>
                <input id="field-customSubject" value={form.customSubject} onChange={updateField("customSubject")} placeholder="Type the teaching area" />
              </label>
            )}

            <div className="topic-picker">
              <div><strong>Chapter or topic</strong><small>Tap a suggestion or type your own.</small></div>
              <div className="topic-buttons">
                {topicSuggestions.slice(0, 6).map((topic) => (
                  <button type="button" className={form.topic === topic ? "selected" : ""} onClick={() => {
                    setForm((current) => ({ ...current, topic }));
                    resetHandoff();
                  }} key={topic}>{topic}</button>
                ))}
              </div>
              <label>
                <span>Or type another chapter</span>
                <input id="field-topic" value={form.topic} onChange={updateField("topic")} onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    continueToReview();
                  }
                }} aria-invalid={attemptedAction && !form.topic.trim()} aria-describedby={attemptedAction && !form.topic.trim() ? "topic-error" : undefined} placeholder="For example: Human reproduction" />
                {attemptedAction && !form.topic.trim() && <small className="field-error" id="topic-error">Choose or type a chapter to continue.</small>}
              </label>
            </div>

            <details className="small-options">
              <summary><span><strong>Optional class details</strong><small>Only if you want to change the class size</small></span><i>＋</i></summary>
              <label className="range-field">
                <span><strong>Class size</strong><b>{classSize} learners</b></span>
                <input type="range" min="10" max="60" step="5" value={classSize} aria-valuetext={`${classSize} learners`} onChange={(event) => {
                  setClassSize(Number(event.target.value));
                  resetHandoff();
                }} />
              </label>
            </details>

            <div className="step-actions">
              <button type="button" className="secondary-action" onClick={() => moveToStep(0)}>← Back</button>
              <p aria-live="polite">{copyStatus || `${selectedBoard.label} · ${classLabel} · ${form.subject}`}</p>
              <button type="button" className="primary-action" onClick={continueToReview}>Review and create →</button>
            </div>
          </section>
        )}

        {activeStep === 2 && (
          <section className="step-panel review-panel" aria-labelledby="step-title">
            <div className="step-intro compact">
              <span>Step 3 · Ready to create</span>
              <h1 id="step-title" tabIndex={-1} ref={stepHeadingRef}>Review, then open your AI</h1>
              <p>No prompt writing. Choose an AI, click once, then paste the copied instructions.</p>
            </div>

            <div className="review-grid">
              <div className="review-main">
                <section className="build-summary" aria-labelledby="summary-title">
                  <div className="summary-heading">
                    <span><i aria-hidden="true">{selectedRecipe?.glyph ?? selectedWorkflow.glyph}</i><small>Your teaching material</small></span>
                    <button type="button" onClick={() => moveToStep(1)}>Edit class details</button>
                  </div>
                  <h2 id="summary-title">{selectedRecipe?.shortTitle ?? selectedWorkflow.title}</h2>
                  <p>{classLabel} · {selectedBoard.label} · {form.subject} · {form.topic} · {form.outputLanguage}</p>
                  <div className="files-heading"><strong>Files you&apos;ll get</strong><small>The AI is instructed to return files, not a normal chat answer.</small></div>
                  <div className="file-list">
                    {result.artifactManifest.map((file) => (
                      <span key={`${file.label}-${file.format}`}><i>{file.format}</i><b>{file.label}</b><small>{file.audience}</small></span>
                    ))}
                  </div>
                </section>

                <details className="customise-panel" ref={advancedDetailsRef}>
                  <summary><span><strong>Customise output</strong><small>Optional—the recommended settings are already applied</small></span><i>＋</i></summary>
                  <div className="customise-body">
                    <div className="customise-grid">
                      <label className="simple-field">
                        <span>File type</span>
                        <select value={artifactId} onChange={(event) => chooseArtifact(event.target.value as ArtifactId)}>
                          {ARTIFACT_PROFILES.map((profile) => <option value={profile.id} key={profile.id}>{profile.label}</option>)}
                        </select>
                      </label>
                      <label className="simple-field">
                        <span>Finish</span>
                        <select value={finishId} onChange={(event) => chooseFinish(event.target.value)}>
                          {FINISH_LEVELS.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}
                        </select>
                      </label>
                      <label className="simple-field">
                        <span>Visual style</span>
                        <select value={visualStyleId} onChange={(event) => {
                          setVisualStyleId(event.target.value);
                          resetHandoff();
                        }}>
                          {VISUAL_STYLES.map((style) => <option value={style.id} key={style.id}>{style.label}</option>)}
                        </select>
                      </label>
                      {usesAssessmentArchitecture && (
                        <label className="simple-field">
                          <span>Question mix</span>
                          <select value={assessmentProfileId} onChange={(event) => {
                            setAssessmentProfileId(event.target.value as AssessmentProfileId);
                            resetHandoff();
                          }}>
                            {ASSESSMENT_PROFILES.map((profile) => <option value={profile.id} key={profile.id}>{profile.label}</option>)}
                          </select>
                        </label>
                      )}
                    </div>

                    <div className="range-grid">
                      <label className="range-field">
                        <span><strong>Time</strong><b>{TIME_OPTIONS[timeIndex]} min</b></span>
                        <input type="range" min="0" max={TIME_OPTIONS.length - 1} step="1" value={timeIndex} aria-label="Time available" aria-valuetext={`${TIME_OPTIONS[timeIndex]} minutes`} onChange={(event) => {
                          const index = Number(event.target.value);
                          setTimeIndex(index);
                          setForm((current) => ({ ...current, duration: `${TIME_OPTIONS[index]} minutes` }));
                          resetHandoff();
                        }} />
                      </label>
                      <label className="range-field">
                        <span><strong>Difficulty</strong><b>{DIFFICULTY_OPTIONS[difficultyIndex].label}</b></span>
                        <input type="range" min="0" max={DIFFICULTY_OPTIONS.length - 1} step="1" value={difficultyIndex} aria-label="Difficulty" aria-valuetext={DIFFICULTY_OPTIONS[difficultyIndex].label} onChange={(event) => {
                          const index = Number(event.target.value);
                          setDifficultyIndex(index);
                          setForm((current) => ({ ...current, cognitiveDemand: DIFFICULTY_OPTIONS[index].value }));
                          resetHandoff();
                        }} />
                      </label>
                      {usesAssessmentArchitecture && (
                        <label className="range-field">
                          <span><strong>Questions</strong><b>{questionCount}</b></span>
                          <input type="range" min="5" max="50" step="5" value={questionCount} aria-label="Question count" aria-valuetext={`${questionCount} questions`} onChange={(event) => {
                            setQuestionCount(Number(event.target.value));
                            resetHandoff();
                          }} />
                        </label>
                      )}
                    </div>

                    {artifact.interactive && (
                      <label className="simple-field full-field">
                        <span>Interaction style</span>
                        <select value={interactionMode} onChange={(event) => {
                          setInteractionMode(event.target.value);
                          resetHandoff();
                        }}>
                          <option>Guided exploration with meaningful feedback, clear progress and a reset path</option>
                          <option>Open exploration with visible variables, model assumptions and a reflection trail</option>
                          <option>Challenge mode with adaptive hints, multiple attempts and evidence-based feedback</option>
                        </select>
                      </label>
                    )}

                    <fieldset className="extras-field">
                      <legend>Also include</legend>
                      <div>
                        {recommendedAddOns.map((item) => (
                          <label key={item.id}><input type="checkbox" checked={addOns.includes(item.id)} onChange={() => toggleAddOn(item.id)} /><span><strong>{item.label}</strong><small>{item.outputSection}</small></span></label>
                        ))}
                      </div>
                    </fieldset>

                    <details className="expert-details">
                      <summary>Advanced details for a precise source or brief</summary>
                      <div>
                        <label><span>Exact goal</span><textarea id="field-objective" rows={3} value={form.objective} onChange={updateField("objective")} /></label>
                        <label><span>Non-negotiables</span><textarea id="field-details" rows={3} value={form.details} onChange={updateField("details")} /></label>
                        <label><span>Prior knowledge</span><textarea id="field-priorKnowledge" rows={3} value={form.priorKnowledge} onChange={updateField("priorKnowledge")} /></label>
                        <label><span>Success evidence</span><textarea id="field-successEvidence" rows={3} value={form.successEvidence} onChange={updateField("successEvidence")} /></label>
                        <label className="wide"><span>Material to transform</span><textarea id="field-taskMaterial" rows={5} value={form.taskMaterial} onChange={updateField("taskMaterial")} placeholder="Paste an anonymised paper, draft or resource" /></label>
                        <label className="wide"><span>Verified source or blueprint</span><textarea id="field-sourceMaterial" rows={5} value={form.sourceMaterial} onChange={updateField("sourceMaterial")} placeholder="Paste a current syllabus extract or verified blueprint" /></label>
                        <p className="privacy-warning">Remove learner names, contact details, admission numbers, health information and identifiable student work before any AI handoff.</p>
                        <label className="wide"><span>Must avoid or preserve</span><textarea id="field-mustAvoid" rows={3} value={form.mustAvoid} onChange={updateField("mustAvoid")} /></label>
                      </div>
                    </details>
                  </div>
                </details>
              </div>

              <aside className="launch-card" id="launch-ai" data-testid="launch-ai-panel">
                <span className="launch-kicker">Create with AI</span>
                <h2>Choose where to build it</h2>
                <p>ChatGPT, Claude and Gemini are ready. Choose one, then use the single button below.</p>

                <div className="provider-picker" role="radiogroup" aria-label="Choose an AI provider">
                  {AI_PROVIDERS.slice(0, showMoreProviders ? AI_PROVIDERS.length : 3).map((provider) => (
                    <button type="button" role="radio" aria-checked={selectedProviderId === provider.id} className={selectedProviderId === provider.id ? "selected" : ""} onClick={() => {
                      setSelectedProviderId(provider.id);
                      setLaunched(false);
                      setLaunchStatus("");
                      setManualProviderId(null);
                    }} key={provider.id}>
                      <i>{provider.glyph}</i><span>{provider.name}</span><b>{selectedProviderId === provider.id ? "✓" : ""}</b>
                    </button>
                  ))}
                </div>
                {AI_PROVIDERS.length > 3 && (
                  <button type="button" className="more-ai-button" onClick={() => setShowMoreProviders((current) => !current)}>{showMoreProviders ? "Show fewer AI options" : `More AI options (${AI_PROVIDERS.length - 3})`}</button>
                )}

                {errors.length > 0 && (
                  <div className="launch-error" role="alert">
                    <span><strong>One detail is needed</strong><small>{errors[0].message}</small></span>
                    <button type="button" onClick={() => focusIssue(errors[0].field)}>Fix it</button>
                  </div>
                )}

                <button type="button" className="launch-button" disabled={Boolean(launchingProviderId) || errors.length > 0} onClick={() => void prepareProvider(selectedProvider.id)}>
                  <span><strong>{launchingProviderId ? `Opening ${selectedProvider.name}…` : `Copy instructions & open ${selectedProvider.name}`}</strong><small>Then paste once in the new chat</small></span><i>↗</i>
                </button>
                <button type="button" className="copy-button" onClick={() => void copyPrompt()} disabled={Boolean(launchingProviderId)}>Copy instructions only</button>

                <div className="three-moves" aria-label="What happens next">
                  <span><i>1</i><b>AI opens</b></span><em>→</em><span><i>2</i><b>Paste</b></span><em>→</em><span><i>3</i><b>Download files</b></span>
                </div>

                <p className="external-note">Your prompt is not uploaded by this site. The AI you open has its own privacy terms—never paste identifiable learner data. File creation can vary by AI provider, plan and model.</p>
                {launchStatus && <p className="launch-status" role="status" aria-live="polite">{launchStatus}</p>}

                {manualProvider && (
                  <a className="manual-open" href={manualProvider.url} target="_blank" rel="noopener noreferrer" onClick={() => {
                    setLaunched(true);
                    setManualProviderId(null);
                  }}>After copying, open {manualProvider.name} ↗</a>
                )}
              </aside>
            </div>

            {warnings.length > 0 && (
              <button type="button" className="helpful-check" onClick={() => focusIssue(warnings[0].field)}><strong>Helpful check:</strong> {warnings[0].message}</button>
            )}

            {launched && (
              <section className="after-launch" aria-labelledby="after-launch-title">
                <div>
                  <span>After the AI returns your file</span>
                  <h2 id="after-launch-title">Improve it without starting again</h2>
                  <p>Stay in the same AI chat. Tap what you need; the exact follow-up copies automatically.</p>
                </div>
                <div className="follow-up-grid">
                  {FOLLOW_UP_PATHS.slice(0, 4).map((path) => (
                    <button type="button" onClick={() => void copyFollowUp(path.id)} key={path.id}><i>{path.id === "repair" ? "↻" : path.id === "visual" ? "✦" : path.id === "adapt" ? "A" : "+"}</i><span><strong>{path.label}</strong><small>{path.description}</small></span><b>Copy →</b></button>
                  ))}
                </div>
                {followUpTrail.length > 0 && <p className="follow-trail">Copied: {followUpTrail.join(" → ")}</p>}
              </section>
            )}

            <details className="technical-prompt" ref={technicalPromptRef}>
              <summary><span><strong>Manual copy / advanced</strong><small>{manualCopyText ? `${manualCopyLabel} is selected below` : "Inspect the hidden build instructions only if needed"}</small></span><i>＋</i></summary>
              <div>
                <textarea ref={promptTextareaRef} value={manualCopyText || result.prompt} readOnly aria-label={manualCopyText ? manualCopyLabel : "Generated build instructions"} spellCheck={false} />
                <button type="button" onClick={() => void copyVisibleInstructions()}>Copy {manualCopyText ? manualCopyLabel.toLowerCase() : "instructions"}</button>
              </div>
            </details>

            <div className="review-back">
              <button type="button" className="secondary-action" onClick={() => moveToStep(1)}>← Back to class details</button>
              <p aria-live="polite">{copyStatus}</p>
            </div>
          </section>
        )}
      </section>

      <footer className="studio-footer">
        <strong>Teacher Prompt Studio</strong>
        <span>No login · no analytics · settings stay on this device</span>
      </footer>
    </main>
  );
}
