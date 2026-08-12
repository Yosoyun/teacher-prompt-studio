import { createServer } from "vite";

const AUDIT_CASES = {
  "question-paper": {
    grade: 10,
    subject: "Biology",
    topic: "Genetics and inheritance",
    language: "Hindi + English",
    duration: "90 minutes",
    questionCount: 20,
    visualStyleId: "exam-clean",
    successEvidence:
      "Students accurately explain inheritance, solve genetics problems, justify reasoning and transfer concepts to an unfamiliar case.",
  },
  "daily-dpp": {
    grade: 10,
    subject: "Mathematics",
    topic: "Quadratic equations",
    language: "English",
    duration: "45 minutes",
    questionCount: 12,
    visualStyleId: "editorial-notebook",
    successEvidence:
      "Students select an efficient method, show valid working, diagnose common errors and solve one unfamiliar transfer problem independently.",
  },
  "theory-notes": {
    grade: 10,
    subject: "Physics",
    topic: "Current electricity",
    language: "Hindi + English",
    duration: "One chapter resource",
    visualStyleId: "academic-editorial",
    successEvidence:
      "Students can explain current, potential difference, resistance and circuit relationships, interpret diagrams and apply the ideas in short calculations.",
  },
  "slide-deck": {
    grade: 8,
    subject: "General science",
    topic: "Light and shadows",
    language: "English",
    duration: "45 minutes",
    visualStyleId: "technical-institute",
    successEvidence:
      "Students predict and explain shadow formation, distinguish transparent, translucent and opaque materials and apply the model to a novel arrangement.",
  },
  "interactive-simulation": {
    grade: 9,
    subject: "Physics",
    topic: "Newton's laws of motion",
    language: "English",
    duration: "30-minute guided exploration",
    visualStyleId: "stem-lab",
    successEvidence:
      "Students manipulate force and mass, predict motion, interpret feedback and use evidence from the simulation to explain all three laws.",
  },
};

const requestedRecipeId = process.argv[2];
if (!requestedRecipeId || !AUDIT_CASES[requestedRecipeId]) {
  throw new Error(`Choose one of: ${Object.keys(AUDIT_CASES).join(", ")}`);
}

const vite = await createServer({
  appType: "custom",
  configFile: false,
  logLevel: "silent",
  server: { middlewareMode: true },
});

try {
  const [promptEngine, promptData, artifactData, presets, assessment] = await Promise.all([
    vite.ssrLoadModule("/app/prompt-engine.ts"),
    vite.ssrLoadModule("/app/prompt-data.ts"),
    vite.ssrLoadModule("/app/artifact-data.ts"),
    vite.ssrLoadModule("/app/studio-presets.ts"),
    vite.ssrLoadModule("/app/assessment-spec.ts"),
  ]);

  const recipe = presets.STUDIO_RECIPES.find((item) => item.id === requestedRecipeId);
  if (!recipe) throw new Error(`Missing recipe: ${requestedRecipeId}`);
  const workflow = promptData.WORKFLOWS.find((item) => item.id === recipe.workflowId);
  if (!workflow) throw new Error(`Missing workflow: ${recipe.workflowId}`);
  const artifactId = artifactData.defaultArtifactId(recipe.id, workflow.id, workflow.category);
  const artifact = artifactData.getArtifactProfile(artifactId);
  const auditCase = AUDIT_CASES[requestedRecipeId];
  const visualStyle = artifactData.VISUAL_STYLES.find(
    (item) => item.id === auditCase.visualStyleId,
  );
  const assessmentProfile = artifactData.ASSESSMENT_PROFILES.find(
    (item) => item.id === "balanced-academic",
  );
  const assessmentSpec = ["quiz-test", "competitive-exam", "worksheet-homework", "question-bank"].includes(
    workflow.id,
  )
    ? assessment.buildAssessmentSpec(assessmentProfile, auditCase.questionCount)
    : undefined;
  const addOns = [...new Set([...workflow.defaultAddOns, ...recipe.addOns])];

  const result = promptEngine.buildTeacherPrompt({
    workflow,
    recipeId: recipe.id,
    recipeTitle: recipe.title,
    artifact,
    assessmentSpec,
    requiredOutputs: recipe.outputs,
    visualStyle: `${visualStyle.label}: ${visualStyle.description}`,
    interactionMode:
      "Guided exploration with meaningful feedback, clear progress and a reset path",
    creatorSignature: artifactData.CREATOR_SIGNATURE,
    creatorMarker: artifactData.CREATOR_MARKER,
    subject: auditCase.subject,
    customSubject: "",
    level: auditCase.grade <= 8 ? "Middle school" : "Secondary / high school",
    customLevel: "",
    topic: auditCase.topic,
    curriculum: "CBSE / NCERT",
    objective: recipe.objective,
    learnerContext: `Class ${auditCase.grade}, 40 learners. Mixed-readiness class with familiar school routines`,
    priorKnowledge: "",
    duration: auditCase.duration,
    modality: "In person",
    outputLanguage: auditCase.language,
    tone: "Clear, encouraging and professional",
    outputLength: "Detailed with teacher notes",
    details: `${recipe.details}\n\nTeacher-set controls: ${assessmentSpec
      ? `${assessmentSpec.profileLabel}; EXACTLY ${assessmentSpec.totalItems} items and ${assessmentSpec.totalMarks} marks using the structured assessment specification`
      : "no fixed assessment distribution"}; conceptual connections and explanation; polished production finish. Apply only controls that make sense for the selected artifact.`,
    sourceMaterial: "",
    taskMaterial: "",
    educatorRole: "Classroom teacher",
    teachingSetting: "Mainstream classroom",
    countryRegion: "India",
    pedagogyLens: "Balanced and evidence-informed",
    cognitiveDemand: "Conceptual connections and explanation",
    successEvidence: auditCase.successEvidence,
    resourceLimits: "Board, paper and commonly available classroom materials",
    mustAvoid: "Do not invent current board patterns, syllabus codes, marks or official claims.",
    powerMode: recipe.powerMode ?? "Expert",
    collaborationStyle: "Proceed intelligently with stated assumptions",
    outputForm:
      recipe.category === "Assess" || recipe.id.includes("paper")
        ? "Separate teacher and learner files"
        : "Ready-to-use final artifact",
    addOns,
  });

  process.stdout.write(JSON.stringify({
    id: requestedRecipeId,
    workflowId: workflow.id,
    artifactId,
    artifactLabel: result.artifactLabel,
    artifactManifest: result.artifactManifest,
    issues: result.issues,
    refinements: result.refinements,
    prompt: result.prompt,
  }));
} finally {
  await vite.close();
}
