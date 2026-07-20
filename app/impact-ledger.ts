import type { ArtifactId } from "./artifact-data";

export const IMPACT_STORAGE_KEY = "teacher-prompt-studio-impact-v1";
export const IMPACT_LEDGER_LIMIT = 40;

export type ImpactOutcome = "prepared" | "usable" | "repair" | "text-only";
export type ImpactAudienceMode = "school" | "early" | "undergraduate" | "vocational" | "adult";

export type ImpactBuildSnapshot = {
  recipeId: string;
  workflowId: string;
  artifactId: ArtifactId;
  providerId: string;
  boardId: string;
  grade: number;
  audienceMode: ImpactAudienceMode;
  classSize: number;
  subject: string;
  level: string;
  topic: string;
  outputLanguage: string;
  timeIndex: number;
  difficultyIndex: number;
  questionCount: number;
  finishId: string;
  visualStyleId: string;
  assessmentProfileId: string;
  addOns: string[];
};

export type ImpactEntry = {
  id: string;
  createdAt: string;
  updatedAt: string;
  mission: string;
  artifactLabel: string;
  providerName: string;
  classLabel: string;
  boardLabel: string;
  subject: string;
  language: string;
  timeSaved: string;
  outcome: ImpactOutcome;
  snapshot: ImpactBuildSnapshot;
};

export type ImpactSummary = {
  totalPrepared: number;
  confirmedUsable: number;
  needsRepair: number;
  textOnly: number;
  rated: number;
  successRate: number | null;
  uniqueWorkflows: number;
  preparedLast30Days: number;
};

type NewImpactEntry = Omit<ImpactEntry, "id" | "createdAt" | "updatedAt" | "outcome">;

const isOutcome = (value: unknown): value is ImpactOutcome =>
  value === "prepared" || value === "usable" || value === "repair" || value === "text-only";

const isString = (value: unknown): value is string => typeof value === "string";
const isNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);

const isImpactSnapshot = (value: unknown): value is ImpactBuildSnapshot => {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<ImpactBuildSnapshot>;
  return Boolean(
    isString(snapshot.recipeId)
    && isString(snapshot.workflowId)
    && isString(snapshot.artifactId)
    && isString(snapshot.providerId)
    && isString(snapshot.boardId)
    && isNumber(snapshot.grade)
    && (snapshot.audienceMode === "school"
      || snapshot.audienceMode === "early"
      || snapshot.audienceMode === "undergraduate"
      || snapshot.audienceMode === "vocational"
      || snapshot.audienceMode === "adult")
    && isNumber(snapshot.classSize)
    && isString(snapshot.subject)
    && isString(snapshot.level)
    && isString(snapshot.topic)
    && isString(snapshot.outputLanguage)
    && isNumber(snapshot.timeIndex)
    && isNumber(snapshot.difficultyIndex)
    && isNumber(snapshot.questionCount)
    && isString(snapshot.finishId)
    && isString(snapshot.visualStyleId)
    && isString(snapshot.assessmentProfileId)
    && Array.isArray(snapshot.addOns)
    && snapshot.addOns.every(isString),
  );
};

const isImpactEntry = (value: unknown): value is ImpactEntry => {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<ImpactEntry>;
  return Boolean(
    isString(entry.id)
    && isString(entry.createdAt)
    && isString(entry.updatedAt)
    && isString(entry.mission)
    && isString(entry.artifactLabel)
    && isString(entry.providerName)
    && isString(entry.classLabel)
    && isString(entry.boardLabel)
    && isString(entry.subject)
    && isString(entry.language)
    && isString(entry.timeSaved)
    && isOutcome(entry.outcome)
    && isImpactSnapshot(entry.snapshot),
  );
};

const makeEntryId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `impact-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

export const limitImpactLedger = (entries: ImpactEntry[]) =>
  [...entries]
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, IMPACT_LEDGER_LIMIT);

export const parseImpactLedger = (raw: string | null): ImpactEntry[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return limitImpactLedger(parsed.filter(isImpactEntry));
  } catch {
    return [];
  }
};

export const createImpactEntry = (
  entry: NewImpactEntry,
  now = new Date(),
  id = makeEntryId(),
): ImpactEntry => {
  const timestamp = now.toISOString();
  return {
    ...entry,
    id,
    createdAt: timestamp,
    updatedAt: timestamp,
    outcome: "prepared",
  };
};

export const setImpactOutcome = (
  entries: ImpactEntry[],
  id: string,
  outcome: Exclude<ImpactOutcome, "prepared">,
  now = new Date(),
) => limitImpactLedger(entries.map((entry) => entry.id === id
  ? { ...entry, outcome, updatedAt: now.toISOString() }
  : entry));

export const summarizeImpact = (entries: ImpactEntry[], now = new Date()): ImpactSummary => {
  const confirmedUsable = entries.filter((entry) => entry.outcome === "usable").length;
  const needsRepair = entries.filter((entry) => entry.outcome === "repair").length;
  const textOnly = entries.filter((entry) => entry.outcome === "text-only").length;
  const rated = confirmedUsable + needsRepair + textOnly;
  const thirtyDaysAgo = now.getTime() - (30 * 24 * 60 * 60 * 1000);
  const preparedLast30Days = entries.filter((entry) => {
    const timestamp = Date.parse(entry.createdAt);
    return Number.isFinite(timestamp) && timestamp >= thirtyDaysAgo;
  }).length;

  return {
    totalPrepared: entries.length,
    confirmedUsable,
    needsRepair,
    textOnly,
    rated,
    successRate: rated ? Math.round((confirmedUsable / rated) * 100) : null,
    uniqueWorkflows: new Set(entries.map((entry) => entry.snapshot.workflowId)).size,
    preparedLast30Days,
  };
};

export const formatPilotSummary = (summary: ImpactSummary, generatedAt = new Date()) => [
  "TEACHER PROMPT STUDIO · DEVICE-LOCAL PILOT SNAPSHOT",
  `Generated: ${generatedAt.toISOString()}`,
  `Artifact handoffs prepared: ${summary.totalPrepared}`,
  `Prepared in the last 30 days: ${summary.preparedLast30Days}`,
  `Teacher-confirmed usable files: ${summary.confirmedUsable}`,
  `Needed repair: ${summary.needsRepair}`,
  `Returned text only: ${summary.textOnly}`,
  `Rated handoffs: ${summary.rated}`,
  `Usable-file rate among rated handoffs: ${summary.successRate === null ? "Not enough evidence" : `${summary.successRate}%`}`,
  `Distinct workflows used: ${summary.uniqueWorkflows}`,
  "Scope: This is an anonymised, device-local activity record. It is not a global usage or revenue metric.",
].join("\n");
