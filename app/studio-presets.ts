export type RecipeCategory =
  | "Popular"
  | "Plan"
  | "Teach"
  | "Assess"
  | "Create"
  | "Support";

export type StudioRecipe = {
  id: string;
  title: string;
  shortTitle: string;
  glyph: string;
  category: RecipeCategory;
  workflowId: string;
  summary: string;
  explanation: string;
  objective: string;
  details: string;
  addOns: string[];
  outputs: string[];
  timeSaved: string;
  accent: "lime" | "coral" | "violet" | "cyan" | "amber";
  powerMode?: "Precision" | "Expert" | "Breakthrough";
};

export const RECIPE_CATEGORIES: RecipeCategory[] = [
  "Popular",
  "Plan",
  "Teach",
  "Assess",
  "Create",
  "Support",
];

export const STUDIO_RECIPES: StudioRecipe[] = [
  {
    id: "question-paper",
    title: "Blueprint-perfect question paper",
    shortTitle: "Question paper",
    glyph: "QP",
    category: "Popular",
    workflowId: "quiz-test",
    summary: "Paper, answer key, marking scheme and a final quality audit.",
    explanation:
      "Builds the blueprint first, then checks marks, coverage, ambiguity and answerability before returning the paper.",
    objective:
      "Create a fair, classroom-ready question paper that matches the selected class, board, topic, difficulty and time limit.",
    details:
      "Use a balanced mix of objective, short-answer, application and higher-order questions. Keep instructions unambiguous and verify every total.",
    addOns: ["answers", "rubric", "misconceptions", "integrity", "sources"],
    outputs: ["Assessment blueprint", "Student paper", "Answer key", "Marking scheme", "Quality audit"],
    timeSaved: "2–4 hours",
    accent: "lime",
    powerMode: "Expert",
  },
  {
    id: "daily-dpp",
    title: "Daily practice problem pack",
    shortTitle: "DPP",
    glyph: "DP",
    category: "Popular",
    workflowId: "worksheet-homework",
    summary: "A progressive DPP with solutions, hints and a transfer challenge.",
    explanation:
      "Sequences practice from confidence-building recall to exam-style application without repeating the same thinking.",
    objective:
      "Create a focused daily practice problem set that builds fluency, reasoning and independent problem solving.",
    details:
      "Use a deliberate easy-to-challenging progression, include space or cues for working, and finish with one transfer problem.",
    addOns: ["answers", "misconceptions", "extension", "time", "depth"],
    outputs: ["Student DPP", "Hints ladder", "Stepwise solutions", "Difficulty map", "Teacher notes"],
    timeSaved: "60–90 min",
    accent: "cyan",
    powerMode: "Expert",
  },
  {
    id: "theory-notes",
    title: "Crystal-clear theory notes",
    shortTitle: "Theory notes",
    glyph: "TN",
    category: "Popular",
    workflowId: "study-notes",
    summary: "Concepts, definitions, examples, misconceptions and recall cues.",
    explanation:
      "Turns a chapter into a teachable explanation instead of a compressed wall of textbook language.",
    objective:
      "Create accurate, student-friendly theory notes that explain the big ideas and support later revision.",
    details:
      "Move from intuitive meaning to precise subject language. Use compact examples, visual-description cues and a final recall section.",
    addOns: ["examples", "misconceptions", "accessibility", "metacognition", "sources"],
    outputs: ["Big ideas", "Structured notes", "Worked example", "Common mistakes", "Rapid recall"],
    timeSaved: "90 min",
    accent: "violet",
    powerMode: "Expert",
  },
  {
    id: "mind-map",
    title: "Visual chapter mind map",
    shortTitle: "Mind map",
    glyph: "MM",
    category: "Popular",
    workflowId: "graphic-knowledge-organizer",
    summary: "A hierarchy of concepts, links, examples and misconceptions.",
    explanation:
      "Makes relationships visible and includes a text equivalent so the map remains usable and accessible.",
    objective:
      "Create a logically connected mind map that helps learners see how the chapter fits together.",
    details:
      "Use one central idea, meaningful branches, labelled relationships, cross-links, examples and a compact text-outline equivalent.",
    addOns: ["examples", "misconceptions", "accessibility", "depth"],
    outputs: ["Map architecture", "Node content", "Cross-links", "Visual build directions", "Text equivalent"],
    timeSaved: "45–60 min",
    accent: "coral",
    powerMode: "Breakthrough",
  },
  {
    id: "formula-sheet",
    title: "Formula and concept sheet",
    shortTitle: "Formula sheet",
    glyph: "FX",
    category: "Popular",
    workflowId: "flashcards-glossary",
    summary: "Formulae with meaning, conditions, units and quick checks.",
    explanation:
      "Prevents formula dumping by attaching every expression to meaning, valid conditions and a retrieval cue.",
    objective:
      "Create a concise formula and concept reference that supports correct selection, recall and application.",
    details:
      "For each formula include symbol meanings, units, conditions, one micro-example and a warning about a common misuse.",
    addOns: ["examples", "misconceptions", "answers", "metacognition"],
    outputs: ["Formula table", "Conditions and units", "Micro-examples", "Common traps", "Retrieval drill"],
    timeSaved: "45 min",
    accent: "amber",
    powerMode: "Precision",
  },
  {
    id: "complete-pack",
    title: "Complete chapter teaching pack",
    shortTitle: "Full chapter pack",
    glyph: "CP",
    category: "Popular",
    workflowId: "complete-teaching-pack",
    summary: "Plan, notes, activities, practice, assessment and answers—aligned.",
    explanation:
      "Creates one coherent system so the lesson, resource and assessment do not pull in different directions.",
    objective:
      "Create a complete, internally aligned teaching pack for the selected topic and classroom context.",
    details:
      "Include a lesson sequence, student notes, guided examples, independent practice, assessment, answers and teacher verification checkpoints.",
    addOns: ["success", "answers", "differentiation", "accessibility", "sources", "time"],
    outputs: ["Teaching sequence", "Student resources", "Practice set", "Assessment", "Answers and review"],
    timeSaved: "Half a day",
    accent: "lime",
    powerMode: "Breakthrough",
  },
  {
    id: "lesson-plan",
    title: "High-participation lesson flow",
    shortTitle: "Lesson plan",
    glyph: "LP",
    category: "Plan",
    workflowId: "lesson-plan",
    summary: "A timed lesson with teacher moves and checks for learning.",
    explanation:
      "Aligns every activity to observable evidence and keeps timing realistic for the selected class.",
    objective:
      "Plan a clear, engaging lesson that moves learners from prior knowledge to independent practice.",
    details:
      "Use a strong hook, explicit modelling, high-participation guided practice, independent application and an exit check.",
    addOns: ["success", "misconceptions", "differentiation", "time", "lowResource"],
    outputs: ["Learning outcomes", "Timed sequence", "Teacher moves", "Checks for learning", "Exit ticket"],
    timeSaved: "45–60 min",
    accent: "lime",
    powerMode: "Expert",
  },
  {
    id: "unit-plan",
    title: "Chapter or unit roadmap",
    shortTitle: "Unit roadmap",
    glyph: "UR",
    category: "Plan",
    workflowId: "unit-plan",
    summary: "A lesson sequence with dependencies, checkpoints and assessment.",
    explanation:
      "Plans backward from evidence and protects time for retrieval, reteaching and cumulative assessment.",
    objective:
      "Build a coherent chapter or unit sequence that develops understanding over time and ends in meaningful evidence of learning.",
    details:
      "Show prerequisite links, lesson-by-lesson progression, formative checkpoints, likely bottlenecks and the culminating assessment.",
    addOns: ["success", "time", "differentiation", "sources"],
    outputs: ["Unit map", "Lesson sequence", "Checkpoint plan", "Assessment plan", "Pacing risks"],
    timeSaved: "2–3 hours",
    accent: "cyan",
    powerMode: "Expert",
  },
  {
    id: "revision-sprint",
    title: "7-day revision sprint",
    shortTitle: "Revision plan",
    glyph: "7D",
    category: "Plan",
    workflowId: "revision-retrieval-plan",
    summary: "Spaced retrieval, interleaving and targeted repair—not rereading.",
    explanation:
      "Turns limited time into an evidence-led sequence and includes a decision rule for what to revisit.",
    objective:
      "Create a realistic revision sprint that strengthens recall, discrimination and exam-ready application.",
    details:
      "Use short retrieval blocks, interleaved practice, self-checks, error repair and one cumulative checkpoint.",
    addOns: ["time", "metacognition", "answers", "misconceptions"],
    outputs: ["Daily plan", "Retrieval prompts", "Practice rotation", "Error log", "Final checkpoint"],
    timeSaved: "60 min",
    accent: "amber",
    powerMode: "Expert",
  },
  {
    id: "board-work",
    title: "Board-work choreography",
    shortTitle: "Board plan",
    glyph: "BW",
    category: "Plan",
    workflowId: "lesson-plan",
    summary: "Exactly what to reveal, write, ask and leave visible.",
    explanation:
      "Designs the visual sequence of the board so explanations remain coherent and students can copy with understanding.",
    objective:
      "Create a board-work plan that makes the lesson logic visible and reduces cognitive overload.",
    details:
      "Divide the board into stable zones, specify the reveal order, diagrams, questions, colour-independent emphasis and the final summary state.",
    addOns: ["accessibility", "examples", "misconceptions", "time"],
    outputs: ["Board zones", "Reveal sequence", "Teacher questions", "Diagram cues", "Final board state"],
    timeSaved: "30–45 min",
    accent: "coral",
    powerMode: "Precision",
  },
  {
    id: "concept-explainer",
    title: "Concept explanation that sticks",
    shortTitle: "Explain a concept",
    glyph: "EX",
    category: "Teach",
    workflowId: "concept-explainer",
    summary: "Intuition, precise model, analogy limits and understanding check.",
    explanation:
      "Moves from what learners can picture to what the subject actually means—without letting the analogy become a misconception.",
    objective:
      "Explain the selected idea accurately, simply and memorably for the chosen learner level.",
    details:
      "Begin with an intuitive hook, build the formal model, use one analogy with clear limits, then check transfer to a new example.",
    addOns: ["examples", "misconceptions", "accessibility", "depth"],
    outputs: ["Big idea", "Explanation sequence", "Analogy and limits", "Examples", "Understanding check"],
    timeSaved: "30–45 min",
    accent: "violet",
    powerMode: "Breakthrough",
  },
  {
    id: "worked-solutions",
    title: "Stepwise worked solutions",
    shortTitle: "Worked solutions",
    glyph: "WS",
    category: "Teach",
    workflowId: "worked-examples",
    summary: "Expert thinking made visible, then support faded gradually.",
    explanation:
      "Shows why each step is chosen and builds from modelled examples to independent transfer.",
    objective:
      "Create rigorous worked examples that make strategic reasoning visible and prepare learners for independent solving.",
    details:
      "Include two fully modelled examples, two faded examples, one error analysis and a final transfer problem.",
    addOns: ["answers", "examples", "misconceptions", "metacognition", "depth"],
    outputs: ["Strategy overview", "Modelled solutions", "Faded examples", "Error clinic", "Transfer problem"],
    timeSaved: "60–90 min",
    accent: "cyan",
    powerMode: "Expert",
  },
  {
    id: "socratic-tutor",
    title: "Adaptive doubt-solving tutor",
    shortTitle: "Doubt solver",
    glyph: "ST",
    category: "Teach",
    workflowId: "adaptive-socratic-tutor",
    summary: "Diagnoses the stuck point, hints gradually and checks transfer.",
    explanation:
      "Prevents the AI from giving away the answer too early and adapts its next question to the learner response.",
    objective:
      "Create an adaptive tutor prompt that helps a learner overcome a specific doubt through diagnosis, hints and transfer checks.",
    details:
      "Ask one question at a time, diagnose the reasoning gap, use a three-level hint ladder, and reveal a full solution only after genuine attempts.",
    addOns: ["misconceptions", "metacognition", "answers", "accessibility"],
    outputs: ["Tutor opening", "Diagnostic branches", "Hint ladder", "Worked resolution", "Transfer check"],
    timeSaved: "Instant reuse",
    accent: "coral",
    powerMode: "Breakthrough",
  },
  {
    id: "case-study",
    title: "Competency and case-study set",
    shortTitle: "Case-study set",
    glyph: "CS",
    category: "Assess",
    workflowId: "question-bank",
    summary: "Original stimuli with competency-based questions and answers.",
    explanation:
      "Builds answerable, source-aware contexts and separates surface reading from genuine application.",
    objective:
      "Create original competency-based and case-study questions aligned to the selected topic and learner level.",
    details:
      "Use realistic but non-sensitive stimuli, mix interpretation and application, avoid hidden assumptions, and verify every answer.",
    addOns: ["answers", "depth", "misconceptions", "integrity", "sources"],
    outputs: ["Stimulus set", "Competency questions", "Answer key", "Reasoning guide", "Item audit"],
    timeSaved: "90 min",
    accent: "violet",
    powerMode: "Expert",
  },
  {
    id: "jee-neet-set",
    title: "JEE / NEET practice set",
    shortTitle: "JEE / NEET set",
    glyph: "JE",
    category: "Assess",
    workflowId: "competitive-exam",
    summary: "Original exam-inspired items with verified options and solutions.",
    explanation:
      "Requires a teacher-confirmed pattern and refuses to invent current official rules or label generated items as PYQs.",
    objective:
      "Create an original competitive-exam practice set with rigorous solutions and a verification ledger.",
    details:
      "Use original exam-inspired questions. State the assumed item mix and marking rules for teacher confirmation; verify options, units and totals.",
    addOns: ["answers", "depth", "integrity", "sources", "misconceptions"],
    outputs: ["Confirmed blueprint", "Practice paper", "Stepwise solutions", "Answer verification", "Teacher checklist"],
    timeSaved: "2–3 hours",
    accent: "amber",
    powerMode: "Breakthrough",
  },
  {
    id: "diagnostic",
    title: "5-minute misconception diagnostic",
    shortTitle: "Diagnostic check",
    glyph: "DG",
    category: "Assess",
    workflowId: "diagnostic-check",
    summary: "A tiny check that reveals what to reteach tomorrow.",
    explanation:
      "Maps each response to a prerequisite or possible misconception without over-diagnosing one answer.",
    objective:
      "Create a short low-stakes diagnostic that reveals prior knowledge and likely reasoning gaps.",
    details:
      "Keep it under five minutes. Use discriminating items and return a simple interpretation-to-action map.",
    addOns: ["answers", "misconceptions", "differentiation", "time"],
    outputs: ["Student check", "Coding guide", "Misconception map", "Grouping suggestion", "Next lesson moves"],
    timeSaved: "30 min",
    accent: "coral",
    powerMode: "Precision",
  },
  {
    id: "paper-audit",
    title: "Question-paper quality audit",
    shortTitle: "Paper audit",
    glyph: "QA",
    category: "Assess",
    workflowId: "assessment-quality-audit",
    summary: "Checks validity, bias, ambiguity, totals and answerability.",
    explanation:
      "Reviews the supplied paper before students see it and separates definite defects from items needing teacher judgement.",
    objective:
      "Audit an assessment for alignment, fairness, ambiguity, answerability and internal consistency.",
    details:
      "Check blueprint coverage, cognitive demand, duplicate cues, language load, marks, units, totals and answer-key consistency.",
    addOns: ["integrity", "sources", "accessibility", "depth"],
    outputs: ["Risk summary", "Item-level audit", "Totals check", "Bias and access review", "Corrected version"],
    timeSaved: "60–90 min",
    accent: "lime",
    powerMode: "Expert",
  },
  {
    id: "bilingual-paper",
    title: "Bilingual English + Indian language paper",
    shortTitle: "Bilingual paper",
    glyph: "BI",
    category: "Create",
    workflowId: "quiz-test",
    summary: "Locked notation, parallel meaning and marking consistency.",
    explanation:
      "Protects subject notation while asking the AI to keep both language versions semantically aligned.",
    objective:
      "Create a bilingual assessment whose two language versions have equivalent meaning, demand and marking.",
    details:
      "Present parallel language versions, lock symbols and formulae, flag untranslatable subject terms, and cross-check the answer key against both versions.",
    addOns: ["translation", "answers", "rubric", "accessibility", "sources"],
    outputs: ["Bilingual paper", "Terminology ledger", "Answer key", "Marking scheme", "Equivalence check"],
    timeSaved: "2–3 hours",
    accent: "cyan",
    powerMode: "Expert",
  },
  {
    id: "slide-deck",
    title: "Visual teaching slide deck",
    shortTitle: "Slide deck",
    glyph: "SL",
    category: "Create",
    workflowId: "slide-outline",
    summary: "A reveal-by-reveal deck with interaction, not walls of text.",
    explanation:
      "Gives each slide one job and inserts questions, pauses and visual directions at the right moments.",
    objective:
      "Create a visually guided teaching deck outline that supports explanation and active learner thinking.",
    details:
      "Use one idea per slide, concise copy, explicit visual directions, teacher narration cues and regular learner interactions.",
    addOns: ["examples", "accessibility", "time", "misconceptions"],
    outputs: ["Deck story arc", "Slide-by-slide plan", "Visual directions", "Speaker cues", "Interaction moments"],
    timeSaved: "90 min",
    accent: "violet",
    powerMode: "Breakthrough",
  },
  {
    id: "resource-fusion",
    title: "Resource fusion master pack",
    shortTitle: "Resource fusion",
    glyph: "RF",
    category: "Create",
    workflowId: "source-data-pack",
    summary: "Combines notes, PDFs, questions and references into one coherent pack.",
    explanation:
      "Treats pasted material as reference data, resolves overlaps and contradictions, and preserves source boundaries.",
    objective:
      "Amalgamate multiple teacher resources into a coherent, source-aware classroom pack without inventing missing content.",
    details:
      "Create a source inventory, deduplicate overlapping ideas, flag contradictions, preserve strong material, and build one aligned teacher-and-student pack.",
    addOns: ["sources", "accessibility", "success", "answers", "alternatives"],
    outputs: ["Source inventory", "Conflict map", "Unified resource", "Student version", "Verification ledger"],
    timeSaved: "Half a day",
    accent: "coral",
    powerMode: "Breakthrough",
  },
  {
    id: "video-script",
    title: "Microlecture or reel script",
    shortTitle: "Video script",
    glyph: "AV",
    category: "Create",
    workflowId: "video-audio-script",
    summary: "Hook, explanation, visual cues, captions and understanding check.",
    explanation:
      "Plans what learners hear and see together, while including pauses and caption-friendly language.",
    objective:
      "Create a concise educational video or audio script that teaches one clear idea and checks understanding.",
    details:
      "Open with a meaningful hook, use scene and on-screen visual cues, keep narration natural, and finish with an active recall prompt.",
    addOns: ["examples", "accessibility", "time", "translation"],
    outputs: ["Hook", "Narration script", "Visual storyboard", "Caption notes", "Recall prompt"],
    timeSaved: "60 min",
    accent: "amber",
    powerMode: "Expert",
  },
  {
    id: "remediation",
    title: "Misconception repair pathway",
    shortTitle: "Remediation",
    glyph: "RX",
    category: "Support",
    workflowId: "remediation",
    summary: "Diagnose, reteach differently, practise and check transfer.",
    explanation:
      "Builds a short repair path from evidence instead of simply repeating the original explanation more slowly.",
    objective:
      "Create a targeted reteach plan for a specific learning gap while preserving learner dignity and the core goal.",
    details:
      "Begin with a discriminating check, use a different representation, provide scaffolded practice, then test independent transfer.",
    addOns: ["misconceptions", "differentiation", "accessibility", "success", "answers"],
    outputs: ["Diagnostic probe", "Reteach model", "Guided practice", "Independent check", "Next-step rule"],
    timeSaved: "45–60 min",
    accent: "coral",
    powerMode: "Expert",
  },
  {
    id: "large-class",
    title: "Large-class, low-resource lesson",
    shortTitle: "Large-class mode",
    glyph: "60",
    category: "Support",
    workflowId: "large-class-low-resource",
    summary: "High participation without devices, printing or fragile logistics.",
    explanation:
      "Designs routines that make every learner think while keeping teacher attention and materials realistic.",
    objective:
      "Adapt the selected teaching goal for a large class with limited resources and high participation.",
    details:
      "Assume fixed seating, limited printing and one teacher. Use response routines, peer checking, board visibility and fast evidence collection.",
    addOns: ["lowResource", "accessibility", "differentiation", "time", "success"],
    outputs: ["Room routine", "Participation structure", "Low-tech materials", "Fast checks", "Fallback plan"],
    timeSaved: "60 min",
    accent: "lime",
    powerMode: "Expert",
  },
  {
    id: "whole-class-feedback",
    title: "Whole-class feedback from common errors",
    shortTitle: "Feedback clinic",
    glyph: "FC",
    category: "Support",
    workflowId: "whole-class-feedback",
    summary: "Patterns, reteach priorities and an improvement task—without names.",
    explanation:
      "Turns anonymised response patterns into teaching decisions instead of producing 40 repetitive comments.",
    objective:
      "Create concise whole-class feedback that identifies patterns and moves every learner toward improvement.",
    details:
      "Separate strengths, common gaps and priority misconceptions. Include one model, one correction routine and one improvement task.",
    addOns: ["privacy", "misconceptions", "differentiation", "success", "examples"],
    outputs: ["Pattern summary", "Strengths", "Priority reteach", "Model improvement", "Student action"],
    timeSaved: "90 min",
    accent: "cyan",
    powerMode: "Expert",
  },
  {
    id: "parent-message",
    title: "Parent or WhatsApp message",
    shortTitle: "Parent message",
    glyph: "PM",
    category: "Support",
    workflowId: "parent-message",
    summary: "Warm, specific and action-oriented communication.",
    explanation:
      "Keeps the message human, factual and easy to act on without exposing private information or sounding automated.",
    objective:
      "Draft a respectful family message that explains the situation clearly and gives one useful next step.",
    details:
      "Use plain language, supplied facts only, an empathetic tone, a concise action request and placeholders for any private details.",
    addOns: ["tone", "privacy", "translation", "accessibility"],
    outputs: ["Main message", "Short WhatsApp version", "Action requested", "Tone check", "Privacy review"],
    timeSaved: "20–30 min",
    accent: "violet",
    powerMode: "Precision",
  },
];

export const BOARD_OPTIONS = [
  {
    id: "cbse",
    label: "CBSE / NCERT",
    value: "CBSE / NCERT",
    help: "Use NCERT-aligned language; verify current circulars and official paper rules.",
  },
  {
    id: "icse",
    label: "ICSE",
    value: "CISCE — ICSE",
    help: "Designed for Class 10 and below; do not invent current council weightage or regulations.",
  },
  {
    id: "isc",
    label: "ISC",
    value: "CISCE — ISC",
    help: "Designed for Classes 11–12; use teacher-supplied current regulations when exact alignment matters.",
  },
  {
    id: "state",
    label: "State Board",
    value: "Indian State Board — state not yet specified",
    help: "Add the state only when it materially affects terminology, syllabus or paper pattern.",
  },
  {
    id: "cambridge",
    label: "Cambridge",
    value: "Cambridge International",
    help: "Treat syllabus codes and current assessment rules as teacher-confirmed inputs.",
  },
  {
    id: "ib",
    label: "IB",
    value: "International Baccalaureate",
    help: "Use inquiry and conceptual connections while keeping programme-specific claims verifiable.",
  },
  {
    id: "nios",
    label: "NIOS",
    value: "NIOS",
    help: "Prioritise self-study clarity, flexible pacing and accessible directions.",
  },
  {
    id: "other",
    label: "Other",
    value: "Custom or institution-specific programme",
    help: "Use neutral conventions until the teacher names an exact institution, framework or programme.",
  },
];

export const SUBJECT_LAUNCHERS = [
  { label: "Mathematics", glyph: "∑", tone: "lime" },
  { label: "Physics", glyph: "⚛", tone: "cyan" },
  { label: "Chemistry", glyph: "⌬", tone: "violet" },
  { label: "Biology", glyph: "✣", tone: "coral" },
  { label: "English / literature", glyph: "Aa", tone: "amber" },
  { label: "General science", glyph: "✦", tone: "cyan" },
  { label: "Social studies / civics", glyph: "◎", tone: "coral" },
  { label: "Computer science / ICT", glyph: "{ }", tone: "violet" },
  { label: "Economics / business", glyph: "₹", tone: "lime" },
  { label: "Accounting / commerce", glyph: "%", tone: "amber" },
];

export const TOPIC_BANK: Record<string, string[]> = {
  Mathematics: [
    "Quadratic equations",
    "Trigonometry",
    "Probability",
    "Coordinate geometry",
    "Limits and derivatives",
    "Matrices and determinants",
  ],
  Physics: [
    "Newton's laws of motion",
    "Work, energy and power",
    "Current electricity",
    "Ray optics",
    "Electrostatics",
    "Rotational motion",
  ],
  Chemistry: [
    "Chemical bonding",
    "Mole concept",
    "Thermodynamics",
    "Electrochemistry",
    "Organic reaction mechanisms",
    "Coordination compounds",
  ],
  Biology: [
    "Cell structure and function",
    "Human physiology",
    "Genetics and inheritance",
    "Photosynthesis",
    "Ecology",
    "Biotechnology",
  ],
  "English / literature": [
    "Close reading of a poem",
    "Persuasive writing",
    "Character analysis",
    "Grammar in context",
    "Reading comprehension",
    "Creative writing",
  ],
  "General science": [
    "Force and motion",
    "Matter and materials",
    "Light and shadows",
    "Electricity",
    "Living systems",
    "Environment and sustainability",
  ],
  "Social studies / civics": [
    "The Indian Constitution",
    "Federalism",
    "Nationalism in India",
    "Resources and development",
    "Democratic institutions",
    "Indian economy",
  ],
  "Computer science / ICT": [
    "Python programming",
    "Algorithms and flowcharts",
    "Database concepts",
    "Computer networks",
    "Cyber safety",
    "Artificial intelligence basics",
  ],
  "Economics / business": [
    "Demand and supply",
    "National income",
    "Market structures",
    "Indian economic development",
    "Business environment",
    "Marketing management",
  ],
  "Accounting / commerce": [
    "Journal and ledger",
    "Final accounts",
    "Partnership accounts",
    "Cash flow statement",
    "Company accounts",
    "Ratio analysis",
  ],
};

export const LANGUAGE_OPTIONS = [
  "English",
  "Hindi + English",
  "Hindi",
  "Bengali + English",
  "Marathi + English",
  "Tamil + English",
  "Telugu + English",
  "Kannada + English",
  "Gujarati + English",
];

export const AI_PROVIDERS = [
  { id: "chatgpt", name: "ChatGPT", glyph: "CG", url: "https://chatgpt.com/", note: "Open a new ChatGPT conversation" },
  { id: "claude", name: "Claude", glyph: "CL", url: "https://claude.ai/new", note: "Open a new Claude conversation" },
  { id: "gemini", name: "Gemini", glyph: "GE", url: "https://gemini.google.com/app", note: "Open Gemini" },
  { id: "aistudio", name: "AI Studio", glyph: "AI", url: "https://aistudio.google.com/", note: "Open Google AI Studio" },
  { id: "grok", name: "Grok", glyph: "GK", url: "https://grok.com/", note: "Open Grok" },
  { id: "perplexity", name: "Perplexity", glyph: "PX", url: "https://www.perplexity.ai/", note: "Open Perplexity" },
  { id: "copilot", name: "Copilot", glyph: "CO", url: "https://copilot.com/", note: "Open Microsoft Copilot" },
];

export const ECOSYSTEM_TOOLS = [
  {
    title: "Maths Prompt Studio",
    metric: "589 specialist prompts",
    description: "DPPs, handwritten solutions, papers, worksheets, visual maths and bilingual resources.",
    url: "https://yosoyun.github.io/math-prompt-studio/",
    glyph: "M+",
  },
  {
    title: "ProPrompt Vault",
    metric: "2,700+ prompts",
    description: "A broader searchable prompt universe for documents, research, images, strategy and more.",
    url: "https://getproprompt.com/",
    glyph: "PV",
  },
  {
    title: "JEE Problem Atlas",
    metric: "Chapter-wise problem trails",
    description: "Reliable external practice links across Physics, Chemistry, Mathematics and Biology.",
    url: "https://yosoyun.github.io/problem-atlas/",
    glyph: "PA",
  },
  {
    title: "HeroSmith",
    metric: "14 visual archetypes",
    description: "Cinematic, 3D and interaction-ready hero prompt architecture for ambitious visual work.",
    url: "https://yosoyun.github.io/herosmith/",
    glyph: "HS",
  },
];

export const TIME_OPTIONS = [15, 30, 40, 45, 60, 90];

export const DIFFICULTY_OPTIONS = [
  {
    label: "Foundation",
    value: "Foundational clarity and fluency",
    note: "Build confidence and secure the essentials.",
  },
  {
    label: "Standard",
    value: "Conceptual connections and explanation",
    note: "Connect ideas and explain reasoning.",
  },
  {
    label: "Advanced",
    value: "Strategic application and reasoning",
    note: "Apply ideas in unfamiliar situations.",
  },
  {
    label: "Competitive",
    value: "Transfer, critique and creation",
    note: "Demand multi-step transfer and strategic choice.",
  },
];

export const DEPTH_OPTIONS = [
  { label: "Fast", powerMode: "Precision", length: "Concise, ready to scan", note: "A focused, usable output." },
  { label: "Ready", powerMode: "Expert", length: "Practical classroom detail", note: "Diagnosed and classroom-ready." },
  { label: "Deep", powerMode: "Expert", length: "Detailed with teacher notes", note: "More rationale, examples and checks." },
  { label: "Beast", powerMode: "Breakthrough", length: "Detailed with teacher notes", note: "Compares bold routes, then synthesises." },
] as const;
