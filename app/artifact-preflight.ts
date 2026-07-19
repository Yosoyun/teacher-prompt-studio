import type { ArtifactFile, ArtifactProfile } from "./artifact-data";

export type GateStatus = "PASS" | "FAIL" | "NOT_RUN";

export type PreflightContext =
  | "global"
  | "assessment"
  | "multilingual"
  | "interactive"
  | "PDF"
  | "DOCX"
  | "PPTX"
  | "HTML"
  | "PNG"
  | "XLSX"
  | "ZIP";

export type PreflightGate = {
  id: string;
  title: string;
  appliesTo: PreflightContext[];
  severity: "release-blocker";
  passWhen: string;
  rejectWhen: string;
  repair: string;
  evidence: string;
};

export type LanguageFontProfile = {
  language: string;
  bcp47: string;
  script: string;
  headingFont: string;
  bodyFont: string;
  canary: string;
};

export const LANGUAGE_FONT_PROFILES: LanguageFontProfile[] = [
  { language: "Hindi", bcp47: "hi-IN", script: "Devanagari", headingFont: "Noto Serif Devanagari", bodyFont: "Noto Sans Devanagari", canary: "कक्षा में आनुवंशिकी के प्रश्न" },
  { language: "Marathi", bcp47: "mr-IN", script: "Devanagari", headingFont: "Noto Serif Devanagari", bodyFont: "Noto Sans Devanagari", canary: "विद्यार्थ्यांसाठी प्रश्न" },
  { language: "Bengali", bcp47: "bn-IN", script: "Bengali", headingFont: "Noto Serif Bengali", bodyFont: "Noto Sans Bengali", canary: "শিক্ষার্থীদের জন্য প্রশ্ন" },
  { language: "Tamil", bcp47: "ta-IN", script: "Tamil", headingFont: "Noto Serif Tamil", bodyFont: "Noto Sans Tamil", canary: "மாணவர்களுக்கான கேள்விகள்" },
  { language: "Telugu", bcp47: "te-IN", script: "Telugu", headingFont: "Noto Serif Telugu", bodyFont: "Noto Sans Telugu", canary: "విద్యార్థుల కోసం ప్రశ్నలు" },
  { language: "Kannada", bcp47: "kn-IN", script: "Kannada", headingFont: "Noto Serif Kannada", bodyFont: "Noto Sans Kannada", canary: "ವಿದ್ಯಾರ್ಥಿಗಳಿಗಾಗಿ ಪ್ರಶ್ನೆಗಳು" },
  { language: "Gujarati", bcp47: "gu-IN", script: "Gujarati", headingFont: "Noto Serif Gujarati", bodyFont: "Noto Sans Gujarati", canary: "વિદ્યાર્થીઓ માટે પ્રશ્નો" },
];

export const PREFLIGHT_GATES: PreflightGate[] = [
  {
    id: "G01_MANIFEST",
    title: "Manifest and openability",
    appliesTo: ["global"],
    severity: "release-blocker",
    passWhen: "every required file exists, has the promised format and reopens successfully",
    rejectWhen: "a file is absent, corrupt, empty, mislabeled or cannot reopen",
    repair: "rebuild the missing or invalid file and reopen it",
    evidence: "required-file count plus opened-file count",
  },
  {
    id: "G02_COMPLETENESS",
    title: "Content completeness",
    appliesTo: ["global"],
    severity: "release-blocker",
    passWhen: "every promised section, item, answer, stimulus, diagram and interaction is fully populated",
    rejectWhen: "declared and actual counts differ or any required content is missing",
    repair: "finish the artifact and reconcile all counts",
    evidence: "declared versus actual counts",
  },
  {
    id: "G03_PLACEHOLDERS",
    title: "Zero-placeholder scan",
    appliesTo: ["global"],
    severity: "release-blocker",
    passWhen: "the ready-to-use files contain zero unfinished or dummy tokens",
    rejectWhen: "TBD, TODO, FIXME, Lorem ipsum, {{tokens}}, [INSERT...], coming soon, sample text, or an option made only of ..., … or punctuation appears",
    repair: "replace every placeholder with complete subject-valid content",
    evidence: "placeholder scan count must equal zero",
  },
  {
    id: "G04_META_LEAKAGE",
    title: "No prompt or planning leakage",
    appliesTo: ["global"],
    severity: "release-blocker",
    passWhen: "learner-facing files contain only learner-safe artifact content",
    rejectWhen: "Assumption, observable success evidence, prompt instructions, AI commentary, blueprint notes, verification notes or production directions appear in learner material",
    repair: "move operational notes to the teacher-only file or remove them",
    evidence: "learner-file leakage count must equal zero",
  },
  {
    id: "G05_AUDIENCE_FIREWALL",
    title: "Physical audience separation",
    appliesTo: ["assessment"],
    severity: "release-blocker",
    passWhen: "student and teacher materials are separate physical files with the correct content boundary",
    rejectWhen: "one file is titled Teacher Version + Student Version or learner files contain answers, hints, rubrics, scoring notes, assumptions or quality audits",
    repair: "split, rename and re-export the files, then rescan the learner copy",
    evidence: "separate filenames plus learner/teacher leakage count",
  },
  {
    id: "G06_INTEGRITY",
    title: "Cross-file integrity",
    appliesTo: ["global"],
    severity: "release-blocker",
    passWhen: "IDs, numbering, terminology, marks, units, answers and cross-references agree everywhere",
    rejectWhen: "any total, key, formula, label, mark or reference conflicts",
    repair: "resolve the source of truth and regenerate dependent sections",
    evidence: "reconciled totals and cross-reference count",
  },
  {
    id: "G07_VISUAL_RENDER",
    title: "Rendered-page inspection",
    appliesTo: ["global"],
    severity: "release-blocker",
    passWhen: "every exported page, slide, screen and image state is inspected at 100% and 200%",
    rejectWhen: "text clips, overlaps, overflows or disappears; glyphs break; headings orphan; blank pages appear; or type becomes illegible",
    repair: "correct layout, re-export, reopen and inspect every rendered surface again",
    evidence: "rendered surfaces checked versus total surfaces",
  },
  {
    id: "G08_ACCESSIBILITY",
    title: "Accessible structure and contrast",
    appliesTo: ["global"],
    severity: "release-blocker",
    passWhen: "reading order, headings, labels, text alternatives and contrast remain usable without color alone",
    rejectWhen: "normal text contrast is below 4.5:1, structure is flattened, reading order is incoherent or meaning relies only on color",
    repair: "repair semantic structure, contrast, labels and text alternatives",
    evidence: "contrast and reading-order checks",
  },
  {
    id: "G09_PROFESSIONAL_LAYOUT",
    title: "Academic production quality",
    appliesTo: ["global"],
    severity: "release-blocker",
    passWhen: "the artifact uses a coherent grid, hierarchy, spacing system and medium-appropriate information architecture",
    rejectWhen: "the result is a raw text dump, repetitive title-and-bullets template, decorative dashboard, inconsistent hierarchy or untypeset chat transcript",
    repair: "recompose the artifact using the academic production standard",
    evidence: "page-grid, hierarchy and density review",
  },
  {
    id: "G10_EXPORT_ROUNDTRIP",
    title: "Export round-trip",
    appliesTo: ["global"],
    severity: "release-blocker",
    passWhen: "the exported file reopens and preserves text, fonts, media, links, formulas and layout",
    rejectWhen: "the export differs materially from source or was not visibly reopened",
    repair: "use a compatible export route and repeat final-file checks",
    evidence: "source/export comparison and reopen result",
  },
  {
    id: "G11_SOURCE_TRUTH",
    title: "Source and affiliation truth",
    appliesTo: ["global"],
    severity: "release-blocker",
    passWhen: "claims, patterns, citations and alignments are supplied or verifiable and no affiliation is implied",
    rejectWhen: "official patterns, current syllabus claims, citations, institutional affiliation or endorsement are invented",
    repair: "remove the claim or flag it for teacher verification",
    evidence: "source boundary and affiliation review",
  },
  {
    id: "G12_DELIVERY_EVIDENCE",
    title: "Evidence-backed receipt",
    appliesTo: ["global"],
    severity: "release-blocker",
    passWhen: "the receipt reports files opened, surfaces rendered, placeholder count, glyph result and audience-leak count",
    rejectWhen: "any required check is NOT_RUN or the receipt claims success without observable check counts; NOT_RUN is a failure",
    repair: "run the missing check; NOT_RUN is not a pass",
    evidence: "compact PASS/FAIL table with numeric counts",
  },
  {
    id: "G13_ASSESSMENT_VALIDITY",
    title: "Assessment validity",
    appliesTo: ["assessment"],
    severity: "release-blocker",
    passWhen: "every item maps to an outcome, construct, demand, evidence, mark value and estimated time",
    rejectWhen: "an item is ambiguous, unanswerable, duplicated, guessable from formatting, mis-keyed or tests incidental language instead of the construct",
    repair: "rewrite the item and its key together, then revalidate the blueprint",
    evidence: "item-map completion and independent answer check",
  },
  {
    id: "G14_MULTILINGUAL_RENDER",
    title: "Multilingual glyph and meaning parity",
    appliesTo: ["multilingual"],
    severity: "release-blocker",
    passWhen: "all target-script text is searchable, correctly shaped, font-embedded and equivalent in command, constraint, numeral, unit, option and mark",
    rejectWhen: "U+FFFD/�, □ tofu boxes, missing conjuncts, displaced matras, within-word font fallback, rasterized text or meaning drift appears",
    repair: "apply the script font profile, normalize to NFC, re-export and repeat glyph plus equivalence checks",
    evidence: "font names, embedded status, missing-glyph count and text round-trip result",
  },
  {
    id: "F01_PDF",
    title: "PDF package integrity",
    appliesTo: ["PDF"],
    severity: "release-blocker",
    passWhen: "fonts are embedded, text is selectable, metadata language/title exists, pages are numbered and full-page rendering succeeds",
    rejectWhen: "fonts are missing, text is raster-only, extraction loses content, page sizes vary or grayscale becomes unreadable",
    repair: "export from an accessible source using Save/Export to PDF, not print-to-PDF, then rerun checks",
    evidence: "font, extraction, metadata and render report",
  },
  {
    id: "F02_DOCX",
    title: "DOCX editing integrity",
    appliesTo: ["DOCX"],
    severity: "release-blocker",
    passWhen: "native styles, tables, lists, headings and complex-script fonts survive editing and PDF export",
    rejectWhen: "manual spacing, fragile text boxes, comments, tracked changes, overflow or missing complex-script font settings remain",
    repair: "rebuild with native document styles and pass a DOCX-to-PDF round-trip",
    evidence: "structure, comments and round-trip report",
  },
  {
    id: "F03_PPTX",
    title: "Presentation package integrity",
    appliesTo: ["PPTX"],
    severity: "release-blocker",
    passWhen: "editable slides open, read in order, project clearly and match PDF/image exports",
    rejectWhen: "empty placeholders, clipping, font substitution, notes leakage or mechanical layouts appear",
    repair: "repair native layouts and compare slide, PDF and image exports",
    evidence: "slide-open, reading-order and export comparison",
  },
  {
    id: "F04_HTML",
    title: "HTML runtime integrity",
    appliesTo: ["HTML"],
    severity: "release-blocker",
    passWhen: "the self-contained file works offline at 320, 768 and 1440 pixels with keyboard, zoom and print support",
    rejectWhen: "external dependencies, console errors, overflow, keyboard traps, dead branches, broken reset or network fonts exist",
    repair: "embed dependencies and repair responsive, keyboard, offline and print behavior",
    evidence: "viewport, keyboard, offline and console results",
  },
  {
    id: "F05_PNG",
    title: "Image render integrity",
    appliesTo: ["PNG"],
    severity: "release-blocker",
    passWhen: "the image has sufficient final-size resolution, crisp typeset text and a complete accessible equivalent",
    rejectWhen: "text was painted by an image model, OCR loses content, glyphs deform, text is too small or content is cropped",
    repair: "compose text with a real layout engine and rerender at the required size",
    evidence: "dimensions, OCR/source comparison and accessible-text result",
  },
  {
    id: "F06_XLSX",
    title: "Workbook integrity",
    appliesTo: ["XLSX"],
    severity: "release-blocker",
    passWhen: "the workbook opens and formulas, validation, protection, filters and print areas work on blank and boundary data",
    rejectWhen: "formulas error, totals are hard-coded, input cells are unclear or the print summary breaks",
    repair: "repair workbook logic and retest blank, partial, duplicate, minimum and maximum cases",
    evidence: "formula and boundary-case report",
  },
];

export const ACADEMIC_EDITORIAL_RULES = [
  "Create an original research-university editorial aesthetic: restrained, rigorous, legible, evidence-led and publication-ready. Do not name, copy or imply affiliation with Harvard, MIT or any institution; never use institutional logos, seals, signatures or exact brand systems.",
  "Use one modular grid, an 8-point spacing rhythm, generous whitespace and a predominantly white or warm-white canvas with near-black text, neutral rules and one original muted academic accent.",
  "Use at most two type families: a scholarly serif for title or major headings and a highly legible sans serif for body, instructions, tables and labels. Avoid display gimmicks, outline, shadow, stretching, faux condensing and decorative 3-D styling.",
  "For A4 print, use 18–22 mm margins, title 22–26 pt, section headings 13–18 pt, body and questions 11–12 pt, metadata no smaller than 10.5 pt, and approximately 1.35–1.5 line spacing.",
  "Left-align or use the natural reading direction; keep long text ragged-right, never fully justify it, and prevent orphan headings, split MCQs and isolated option lines.",
  "Use semantic heading levels, real lists and tables, captions, repeated table headers, logical reading order, page numbers and document language/title metadata.",
  "Use color only as a secondary cue. Preserve at least 4.5:1 contrast for normal text and ensure grayscale or low-ink output retains the hierarchy.",
];

export const ASSESSMENT_EDITORIAL_RULES = [
  "Use separate physical files. Student paper: title block, candidate fields, learner instructions, stimuli, complete questions, marks and realistic response space only. Teacher pack: blueprint, assumptions, item map, complete key, marking logic, accepted variants, misconceptions and QA evidence.",
  "The student title block must show subject, topic or scope, class, duration, total marks, language and version. Use restrained section bands, sequential item IDs, right-aligned mark labels and page X of Y.",
  "Build the blueprint as a compact matrix: learning outcome, construct or skill, cognitive demand, item IDs, marks, expected evidence and estimated time. Never expose this matrix or internal assumptions in the student paper.",
  "Every MCQ must have a complete stem, four complete plausible mutually exclusive options and exactly one defensible key. Every constructed response needs expected evidence, marks and partial-credit logic where appropriate.",
  "Use authentic discipline-specific representations and contexts that affect the reasoning. Do not disguise recall with decorative real-world stories.",
  "Reserve answer space in proportion to marks and response type; never crowd pages merely to reduce page count.",
];

const contextsFor = (
  artifact: ArtifactProfile,
  files: ArtifactFile[],
  outputLanguage: string,
  assessment: boolean,
): Set<PreflightContext> => {
  const contexts = new Set<PreflightContext>(["global"]);
  if (assessment) contexts.add("assessment");
  if (outputLanguage.trim().toLowerCase() !== "english") contexts.add("multilingual");
  if (artifact.interactive) contexts.add("interactive");
  for (const file of files) {
    const format = file.format.toUpperCase() as PreflightContext;
    contexts.add(format);
  }
  return contexts;
};

export const selectedLanguageProfiles = (outputLanguage: string) => {
  const normalized = outputLanguage.toLowerCase();
  return LANGUAGE_FONT_PROFILES.filter((profile) =>
    normalized.includes(profile.language.toLowerCase()),
  );
};

export function compilePreflightGateLines(
  artifact: ArtifactProfile,
  outputLanguage: string,
  assessment: boolean,
  files: ArtifactFile[] = artifact.files,
  controlledPlaceholders = false,
) {
  const contexts = contextsFor(artifact, files, outputLanguage, assessment);
  const gates = PREFLIGHT_GATES.filter((gate) =>
    gate.appliesTo.some((context) => contexts.has(context)),
  );

  return gates.map((gate) => {
    if (gate.id === "G03_PLACEHOLDERS" && controlledPlaceholders) {
      return "G03_PLACEHOLDERS — Controlled template fields: PASS only when every remaining named field is intentional, uniquely named, listed in a teacher-only placeholder ledger and used only where information must be supplied later; all unlisted, dummy and learner-facing placeholders must equal zero. REJECT unfinished prose, dummy options, TBD/TODO/FIXME, ellipsis-as-content or any field absent from the ledger. Repair: complete the content or register and explain the intentional field. Evidence: ledgered fields N/N; unlisted placeholders 0; dummy placeholders 0.";
    }

    return `${gate.id} — ${gate.title}: PASS only when ${gate.passWhen}. REJECT when ${gate.rejectWhen}. Repair: ${gate.repair}. Evidence: ${gate.evidence}.`;
  });
}

export function compileLanguageProductionRules(outputLanguage: string) {
  const profiles = selectedLanguageProfiles(outputLanguage);
  if (!profiles.length) {
    return [
      "Use embedded or subsetted Unicode fonts, preserve searchable text and verify every character after export.",
    ];
  }

  return profiles.flatMap((profile) => [
    `${profile.language}: set language metadata to ${profile.bcp47}; use ${profile.headingFont} for headings and ${profile.bodyFont} for body; verify this canary after export: “${profile.canary}”.`,
    `Normalize ${profile.script} text to NFC, use a complex-text shaping engine, embed or subset fonts, preserve searchable text, and reject U+FFFD, tofu squares, missing conjuncts, displaced marks or within-word font fallback.`,
    "For self-contained HTML, embed open-licensed WOFF2 font data; do not depend on a network font. For DOCX or PPTX, set complex-script fonts explicitly and pass a PDF export check.",
    "Round-trip extracted text against source and compare command verbs, negation, qualifiers, numerals, units, options and marks—not only general meaning. Never transliterate unless requested.",
  ]);
}
