export type ArtifactId =
  | "worksheet-bundle"
  | "print-pdf"
  | "editable-docx"
  | "slide-deck"
  | "visual-infographic"
  | "flowchart-map"
  | "interactive-website"
  | "branching-simulation"
  | "data-spreadsheet"
  | "media-storyboard"
  | "resource-bundle"
  | "brainstorm-canvas";

export type ArtifactFamily = "Print" | "Visual" | "Interactive" | "Planning";

export type ArtifactFile = {
  label: string;
  format: string;
  audience: string;
  required: boolean;
};

export type ArtifactProfile = {
  id: ArtifactId;
  label: string;
  shortLabel: string;
  glyph: string;
  family: ArtifactFamily;
  promise: string;
  actionLabel: string;
  canvas: string;
  formats: string[];
  files: ArtifactFile[];
  deliveryRules: string[];
  qualityGates: string[];
  recommendedProviders: string[];
  fallback: string;
  interactive: boolean;
};

export const CREATOR_SIGNATURE = "Indrajeet Yadav";
export const CREATOR_MARKER = "TPS-IY-79";

export const ARTIFACT_PROFILES: ArtifactProfile[] = [
  {
    id: "worksheet-bundle",
    label: "Printable classroom bundle",
    shortLabel: "PDF + DOCX bundle",
    glyph: "WB",
    family: "Print",
    promise: "A learner-ready PDF, editable source and separate answer support.",
    actionLabel: "Create my classroom bundle",
    canvas: "A4 · print-safe · low-ink option",
    formats: ["PDF", "DOCX", "ZIP"],
    files: [
      { label: "Learner copy", format: "PDF", audience: "Students", required: true },
      { label: "Editable master", format: "DOCX", audience: "Teacher", required: true },
      { label: "Answer key", format: "PDF", audience: "Teacher", required: true },
    ],
    deliveryRules: [
      "Create an A4 learner PDF, an editable DOCX master and a separate teacher answer-key PDF.",
      "Use controlled page breaks, generous answer space, consistent numbering and photocopy-safe contrast.",
      "Package multiple files with clear, versioned filenames and a one-page manifest when ZIP creation is available.",
    ],
    qualityGates: [
      "Recalculate every count, mark, answer, unit and cross-reference across all files.",
      "Check that no teacher answer, hint or scoring note leaks into the learner copy.",
      "Reject clipped tables, orphaned questions, tiny type and answer spaces that do not match the task.",
    ],
    recommendedProviders: ["chatgpt", "claude", "gemini"],
    fallback: "Create one downloadable self-contained HTML file with print styles for separate learner and teacher PDFs.",
    interactive: false,
  },
  {
    id: "print-pdf",
    label: "Designed print-ready PDF",
    shortLabel: "Designed PDF",
    glyph: "PDF",
    family: "Print",
    promise: "A polished A4 resource that is ready to print, project or share.",
    actionLabel: "Create my designed PDF",
    canvas: "A4 · selectable text · accessible",
    formats: ["PDF"],
    files: [
      { label: "Finished resource", format: "PDF", audience: "Classroom", required: true },
    ],
    deliveryRules: [
      "Create and attach an actual A4 PDF with selectable text, embedded fonts, page numbers and a coherent visual system.",
      "Use meaningful hierarchy, print-safe margins and diagrams or tables only when they improve understanding.",
      "Include a low-ink version when the design uses large colour fields.",
    ],
    qualityGates: [
      "Inspect every page for clipping, crowding, broken glyphs, awkward page breaks and unreadable grayscale contrast.",
      "Keep the resource usable from both a phone screen and a classroom photocopy.",
    ],
    recommendedProviders: ["chatgpt", "claude", "gemini"],
    fallback: "Create a downloadable self-contained HTML document with A4 print CSS and no prose outside the artifact.",
    interactive: false,
  },
  {
    id: "editable-docx",
    label: "Editable teaching document",
    shortLabel: "Editable DOCX",
    glyph: "DX",
    family: "Print",
    promise: "A styled document teachers can edit without rebuilding the layout.",
    actionLabel: "Create my editable document",
    canvas: "DOCX · real styles · reusable",
    formats: ["DOCX"],
    files: [
      { label: "Editable master", format: "DOCX", audience: "Teacher", required: true },
    ],
    deliveryRules: [
      "Create and attach an actual editable DOCX using native heading, list, table, caption and page-break styles.",
      "Keep teacher-editable fields obvious without simulating structure with spaces or manual formatting.",
      "Set document title, subject, creator and accessibility properties in native metadata.",
    ],
    qualityGates: [
      "Open the document structure mentally as an editor: headings must navigate, tables must reflow and page breaks must remain stable.",
      "Reject fake headings, text-box-heavy layouts and decorative elements that make editing fragile.",
    ],
    recommendedProviders: ["chatgpt", "claude", "copilot"],
    fallback: "Create a downloadable self-contained HTML document that opens cleanly in Word and preserves the full layout.",
    interactive: false,
  },
  {
    id: "slide-deck",
    label: "Visual teaching slide deck",
    shortLabel: "PPTX + handout",
    glyph: "SL",
    family: "Visual",
    promise: "A teachable slide story—not notes pasted onto coloured rectangles.",
    actionLabel: "Create my slide lesson",
    canvas: "16:9 · speaker notes · projector-safe",
    formats: ["PPTX", "PDF"],
    files: [
      { label: "Teaching deck", format: "PPTX", audience: "Classroom", required: true },
      { label: "Presenter handout", format: "PDF", audience: "Teacher", required: false },
    ],
    deliveryRules: [
      "Create and attach a 16:9 PPTX with native editable elements, purposeful reveals, speaker notes and accessible reading order.",
      "Give each slide one clear learning move; keep projected text concise and place explanation in notes.",
      "Use diagrams, worked reveals and retrieval moments instead of decorative stock imagery.",
    ],
    qualityGates: [
      "Check every slide from the back of a classroom: type, contrast, density and visual focus must remain clear.",
      "Reject repetitive title-and-bullets layouts and any slide that does not change learner thinking or action.",
    ],
    recommendedProviders: ["chatgpt", "gemini", "copilot"],
    fallback: "Create a downloadable self-contained HTML slide deck with keyboard controls, print-to-PDF support and speaker notes.",
    interactive: true,
  },
  {
    id: "visual-infographic",
    label: "Infographic or mind map",
    shortLabel: "PNG + PDF visual",
    glyph: "VI",
    family: "Visual",
    promise: "A rendered visual that makes the topic structure instantly understandable.",
    actionLabel: "Create my classroom visual",
    canvas: "High-resolution · A4 · phone-legible",
    formats: ["PNG", "PDF"],
    files: [
      { label: "High-resolution visual", format: "PNG", audience: "Students", required: true },
      { label: "Printable visual", format: "PDF", audience: "Classroom", required: true },
      { label: "Text equivalent", format: "DOCX", audience: "Accessibility", required: false },
    ],
    deliveryRules: [
      "Render and attach the actual high-resolution visual plus a print-ready PDF; do not merely describe the design.",
      "Use hierarchy, proximity, labels and relationships that reflect the topic's real conceptual structure.",
      "Provide a complete accessible text equivalent and do not encode meaning with colour alone.",
    ],
    qualityGates: [
      "Verify every arrow, grouping, icon and visual metaphor has a precise educational meaning.",
      "Test legibility at phone width and on an A4 grayscale print.",
    ],
    recommendedProviders: ["chatgpt", "gemini", "grok"],
    fallback: "Create a downloadable self-contained HTML/SVG visual with an accessible text panel and print CSS.",
    interactive: false,
  },
  {
    id: "flowchart-map",
    label: "Flowchart or decision map",
    shortLabel: "Visual flowchart",
    glyph: "FC",
    family: "Visual",
    promise: "A numbered, easy-to-follow route with clear decisions and next actions.",
    actionLabel: "Create my visual flowchart",
    canvas: "Landscape · labelled paths · accessible",
    formats: ["PNG", "PDF", "HTML"],
    files: [
      { label: "Visual flowchart", format: "PNG", audience: "Classroom", required: true },
      { label: "Print version", format: "PDF", audience: "Classroom", required: true },
      { label: "Editable route", format: "HTML", audience: "Teacher", required: true },
    ],
    deliveryRules: [
      "Create a left-to-right or top-to-bottom flow with action-led nodes, short labels and explicitly labelled decision arrows.",
      "Number the main route, minimise line crossings, keep branches visually distinct without relying on colour, and include a legend.",
      "Create an editable HTML version with clickable nodes and a complete numbered text route.",
    ],
    qualityGates: [
      "Walk every branch from start to finish; remove dead ends, ambiguous loops and choices without consequences.",
      "A teacher must understand the next action in under five seconds at every node.",
    ],
    recommendedProviders: ["claude", "chatgpt", "gemini"],
    fallback: "Create the complete flowchart as a downloadable self-contained interactive HTML file with print support.",
    interactive: true,
  },
  {
    id: "interactive-website",
    label: "Interactive learning website",
    shortLabel: "Learning website",
    glyph: "WEB",
    family: "Interactive",
    promise: "A responsive mini-site learners can open, explore and use immediately.",
    actionLabel: "Build my learning website",
    canvas: "Responsive · touch + keyboard · offline-safe",
    formats: ["HTML", "CSS", "JS"],
    files: [
      { label: "Runnable learning site", format: "HTML", audience: "Students", required: true },
    ],
    deliveryRules: [
      "Create one runnable, self-contained responsive HTML file with complete embedded CSS and JavaScript—not a wireframe, separate source fragments or code explanation.",
      "Make the primary learning path obvious, keep navigation shallow and provide progress, feedback, reset and print behavior where relevant.",
      "Use no trackers, logins or external services; keep the core experience usable offline and on a shared low-end phone.",
    ],
    qualityGates: [
      "Test keyboard, touch, narrow-screen, reduced-motion, reset and empty-state behavior.",
      "Every interaction must change understanding, evidence or feedback; remove decorative controls.",
    ],
    recommendedProviders: ["claude", "aistudio", "chatgpt"],
    fallback: "The primary format is already a downloadable self-contained HTML artifact; return that file and nothing resembling a prose tutorial.",
    interactive: true,
  },
  {
    id: "branching-simulation",
    label: "Interactive simulation",
    shortLabel: "Runnable simulation",
    glyph: "SIM",
    family: "Interactive",
    promise: "A working model with controls, consequences, feedback and a debrief.",
    actionLabel: "Build my simulation",
    canvas: "Live controls · reset · teacher mode",
    formats: ["HTML", "CSS", "JS"],
    files: [
      { label: "Runnable simulation", format: "HTML", audience: "Students", required: true },
      { label: "Teacher guide", format: "PDF", audience: "Teacher", required: false },
    ],
    deliveryRules: [
      "Create a complete self-contained HTML simulation with instructions, meaningful controls, visible state, feedback, reset and a rigorous debrief.",
      "For branching scenarios, make consequences plausible, preserve state coherently and prevent dead ends; for models, expose assumptions and valid ranges.",
      "Include a teacher mode or guide with learning purpose, facilitation moves and interpretation boundaries.",
    ],
    qualityGates: [
      "Test minimum, maximum, invalid, repeated and reset states plus every decision branch.",
      "Reject fake interactivity, random consequences and controls whose movement does not change the model or learning evidence.",
    ],
    recommendedProviders: ["claude", "aistudio", "chatgpt"],
    fallback: "Return the fully runnable self-contained HTML simulation file; never replace it with a scenario description.",
    interactive: true,
  },
  {
    id: "data-spreadsheet",
    label: "Smart spreadsheet or tracker",
    shortLabel: "XLSX tracker",
    glyph: "XL",
    family: "Planning",
    promise: "An editable workbook with formulas, checks and a useful teacher summary.",
    actionLabel: "Create my smart workbook",
    canvas: "XLSX · formulas · validation · dashboard",
    formats: ["XLSX"],
    files: [
      { label: "Teacher workbook", format: "XLSX", audience: "Teacher", required: true },
    ],
    deliveryRules: [
      "Create and attach an XLSX workbook with Instructions, Data and Analysis sheets plus a print-ready summary where useful.",
      "Use formulas, validation, frozen headers, filters, protected formula cells and editable input cells rather than hard-coded totals.",
      "Keep labels understandable to teachers and include an example row that can be safely deleted.",
    ],
    qualityGates: [
      "Test formulas on blank, partial, duplicate, minimum and maximum data; ensure errors do not cascade visibly.",
      "Reject decorative dashboards that do not support a real classroom decision.",
    ],
    recommendedProviders: ["chatgpt", "copilot", "gemini"],
    fallback: "Create a downloadable spreadsheet-compatible CSV bundle plus a self-contained HTML dashboard with formulas reproduced in JavaScript.",
    interactive: true,
  },
  {
    id: "media-storyboard",
    label: "Video or audio production pack",
    shortLabel: "Storyboard + script",
    glyph: "AV",
    family: "Visual",
    promise: "A production-ready script, storyboard, timing sheet and captions.",
    actionLabel: "Create my media pack",
    canvas: "Scenes · timings · captions · visual cues",
    formats: ["PDF", "DOCX", "SRT"],
    files: [
      { label: "Storyboard", format: "PDF", audience: "Creator", required: true },
      { label: "Production script", format: "DOCX", audience: "Creator", required: true },
      { label: "Captions", format: "SRT", audience: "Accessibility", required: true },
    ],
    deliveryRules: [
      "Create a timed storyboard PDF, editable production script and valid caption file with aligned timestamps.",
      "Coordinate narration, on-screen action, visuals, pauses, checks and audio cues scene by scene.",
      "Design for the actual duration and production limits rather than writing an essay with camera labels.",
    ],
    qualityGates: [
      "Read the script aloud against timestamps and repair unrealistic pacing, overloaded scenes and inaccessible visual-only information.",
      "Every shot or sound cue must clarify, demonstrate, contrast or prompt thinking.",
    ],
    recommendedProviders: ["gemini", "chatgpt", "claude"],
    fallback: "Create a downloadable self-contained HTML storyboard with print styles plus downloadable SRT caption data.",
    interactive: false,
  },
  {
    id: "resource-bundle",
    label: "Complete multi-file teaching pack",
    shortLabel: "Complete resource pack",
    glyph: "ZIP",
    family: "Planning",
    promise: "A coordinated set of learner, teacher, answer and visual resources.",
    actionLabel: "Create my complete pack",
    canvas: "Multi-file · aligned · versioned",
    formats: ["ZIP", "PDF", "DOCX", "PPTX"],
    files: [
      { label: "Learner resources", format: "PDF", audience: "Students", required: true },
      { label: "Teacher guide", format: "DOCX", audience: "Teacher", required: true },
      { label: "Teaching deck", format: "PPTX", audience: "Classroom", required: false },
      { label: "Pack manifest", format: "PDF", audience: "Teacher", required: true },
    ],
    deliveryRules: [
      "Create a clearly named, versioned bundle whose files share one terminology, visual system, learning sequence and answer logic.",
      "Include a manifest explaining what each file is for, when to use it and what must be verified locally.",
      "Do not duplicate the same prose across formats; recompose each item for its medium and audience.",
    ],
    qualityGates: [
      "Cross-check examples, terminology, timing, answers, page references and assumptions across every file.",
      "Reject any file that cannot be used independently at its stated classroom moment.",
    ],
    recommendedProviders: ["chatgpt", "claude", "gemini"],
    fallback: "Create one downloadable self-contained HTML resource hub with print-ready learner and teacher views and downloadable source data.",
    interactive: true,
  },
  {
    id: "brainstorm-canvas",
    label: "Visual brainstorm canvas",
    shortLabel: "Idea canvas",
    glyph: "IDEA",
    family: "Planning",
    promise: "A structured idea landscape that turns possibilities into decisions and next actions.",
    actionLabel: "Create my idea canvas",
    canvas: "Clusters · priorities · next moves",
    formats: ["HTML", "PDF"],
    files: [
      { label: "Interactive idea canvas", format: "HTML", audience: "Teacher", required: true },
      { label: "Shareable snapshot", format: "PDF", audience: "Team", required: true },
    ],
    deliveryRules: [
      "Create an interactive canvas that clusters ideas by educational value, effort, evidence and risk instead of returning a flat list.",
      "Allow ideas to be filtered, prioritised and converted into a short action path with owners or next steps.",
      "Include divergent possibilities, critical challenges and one recommended synthesis grounded in the classroom context.",
    ],
    qualityGates: [
      "Reject synonym lists, fashionable technology ideas without learning value and options that ignore the stated constraints.",
      "Every shortlisted idea must state why it matters, what it requires and what evidence would justify continuing.",
    ],
    recommendedProviders: ["claude", "chatgpt", "aistudio"],
    fallback: "Return the complete brainstorm as a downloadable self-contained HTML canvas with print-to-PDF support.",
    interactive: true,
  },
];

export const ARTIFACT_FAMILIES: ArtifactFamily[] = [
  "Print",
  "Visual",
  "Interactive",
  "Planning",
];

export const RECIPE_ARTIFACT_DEFAULTS: Record<string, ArtifactId> = {
  "question-paper": "worksheet-bundle",
  "daily-dpp": "worksheet-bundle",
  "theory-notes": "editable-docx",
  "mind-map": "visual-infographic",
  "formula-sheet": "visual-infographic",
  "complete-pack": "resource-bundle",
  "lesson-plan": "editable-docx",
  "unit-plan": "flowchart-map",
  "revision-sprint": "data-spreadsheet",
  "board-work": "visual-infographic",
  "concept-explainer": "interactive-website",
  "worked-solutions": "print-pdf",
  "socratic-tutor": "branching-simulation",
  "case-study": "worksheet-bundle",
  "jee-neet-set": "worksheet-bundle",
  diagnostic: "worksheet-bundle",
  "paper-audit": "data-spreadsheet",
  "bilingual-paper": "worksheet-bundle",
  "slide-deck": "slide-deck",
  "resource-fusion": "resource-bundle",
  "video-script": "media-storyboard",
  remediation: "flowchart-map",
  "large-class": "editable-docx",
  "whole-class-feedback": "editable-docx",
  "parent-message": "visual-infographic",
  "interactive-simulation": "branching-simulation",
  "learning-website": "interactive-website",
  "visual-flowchart": "flowchart-map",
  "brainstorm-lab": "brainstorm-canvas",
};

export const WORKFLOW_ARTIFACT_DEFAULTS: Record<string, ArtifactId> = {
  "branching-simulation": "branching-simulation",
  "adaptive-socratic-tutor": "branching-simulation",
  "graphic-knowledge-organizer": "flowchart-map",
  "slide-outline": "slide-deck",
  "video-audio-script": "media-storyboard",
  "assessment-data-analysis": "data-spreadsheet",
  "observation-checklist": "data-spreadsheet",
  "complete-teaching-pack": "resource-bundle",
  "worksheet-homework": "worksheet-bundle",
  "quiz-test": "worksheet-bundle",
};

export const VISUAL_STYLES = [
  {
    id: "exam-clean",
    label: "Exam clean",
    description: "Crisp hierarchy, low ink and zero decoration that competes with the work.",
  },
  {
    id: "editorial-notebook",
    label: "Editorial notebook",
    description: "Premium study-guide rhythm with annotations, callouts and confident whitespace.",
  },
  {
    id: "cinematic-concept",
    label: "Cinematic concept",
    description: "A memorable visual metaphor derived from the topic, not generic sci-fi effects.",
  },
  {
    id: "playful-primary",
    label: "Playful classroom",
    description: "Warm, friendly and age-aware while preserving serious learning value.",
  },
  {
    id: "stem-lab",
    label: "STEM lab",
    description: "Instrument-panel clarity, diagrams, measurements and responsive feedback.",
  },
  {
    id: "heritage-modern",
    label: "India modern",
    description: "Contemporary Indian editorial colour and pattern used with restraint and no stereotypes.",
  },
] as const;

export const FINISH_LEVELS = [
  {
    id: "ready",
    label: "Ready now",
    description: "Complete, clear and classroom-ready with essential checks.",
    depthIndex: 1,
  },
  {
    id: "polished",
    label: "Polished",
    description: "Stronger visual hierarchy, alternatives and a production audit.",
    depthIndex: 2,
  },
  {
    id: "showcase",
    label: "Showcase",
    description: "Three concepts considered privately; the strongest is built and stress-tested.",
    depthIndex: 3,
  },
] as const;

export type FollowUpId = "repair" | "visual" | "adapt" | "deepen" | "transform" | "share";

export const FOLLOW_UP_PATHS: Array<{
  id: FollowUpId;
  label: string;
  question: string;
  description: string;
  accent: string;
}> = [
  { id: "repair", label: "Fix the file", question: "AI gave text or a broken file?", description: "Force real file delivery and repair missing, clipped or incorrect parts.", accent: "coral" },
  { id: "visual", label: "Make it unforgettable", question: "Looks ordinary?", description: "Art-direct the same artifact without weakening clarity or learning.", accent: "violet" },
  { id: "adapt", label: "Fit my learners", question: "Needs easier access?", description: "Make it bilingual, accessible, simpler or more challenging.", accent: "cyan" },
  { id: "deepen", label: "Deepen the thinking", question: "Too generic or shallow?", description: "Add subject-native reasoning, misconception contrast and transfer.", accent: "lime" },
  { id: "transform", label: "Change the format", question: "Need another medium?", description: "Recompose it as slides, visual, PDF, site, simulation or workbook.", accent: "amber" },
  { id: "share", label: "Make share-ready", question: "Ready to use?", description: "Prepare the final print, phone, projector, LMS or offline version.", accent: "lime" },
];

export function getArtifactProfile(id: ArtifactId) {
  return ARTIFACT_PROFILES.find((profile) => profile.id === id) ?? ARTIFACT_PROFILES[0];
}

export function defaultArtifactId(
  recipeId: string,
  workflowId: string,
  category: string,
): ArtifactId {
  if (RECIPE_ARTIFACT_DEFAULTS[recipeId]) return RECIPE_ARTIFACT_DEFAULTS[recipeId];
  if (WORKFLOW_ARTIFACT_DEFAULTS[workflowId]) return WORKFLOW_ARTIFACT_DEFAULTS[workflowId];
  if (category === "Assess") return "worksheet-bundle";
  if (category === "Resources") return "editable-docx";
  if (category === "Feedback") return "data-spreadsheet";
  if (category === "Communicate") return "visual-infographic";
  return "editable-docx";
}
