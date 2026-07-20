import type { ImpactEntry, ImpactSummary } from "./impact-ledger";

type ImpactPanelProps = {
  entries: ImpactEntry[];
  summary: ImpactSummary;
  onClose: () => void;
  onCopySummary: () => void;
  onRepeat: (entry: ImpactEntry) => void;
};

const OUTCOME_LABELS: Record<ImpactEntry["outcome"], string> = {
  prepared: "Awaiting result",
  usable: "Usable file ✓",
  repair: "Repair requested",
  "text-only": "Text-only result",
};

export default function ImpactPanel({
  entries,
  summary,
  onClose,
  onCopySummary,
  onRepeat,
}: ImpactPanelProps) {
  return (
    <section className="impact-panel" id="impact-panel" data-testid="impact-ledger" aria-labelledby="impact-title">
      <div className="impact-heading">
        <span><i aria-hidden="true">◎</i><small>Private proof loop</small></span>
        <div>
          <h2 id="impact-title">Your teaching impact, on this device</h2>
          <p>Track whether AI returned a real usable file, then repeat successful setups without starting over.</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close my impact panel">Close ×</button>
      </div>

      <div className="impact-metrics" aria-label="Device-local impact metrics">
        <span><strong>{summary.totalPrepared}</strong><small>Handoffs prepared</small></span>
        <span><strong>{summary.confirmedUsable}</strong><small>Usable files confirmed</small></span>
        <span><strong>{summary.successRate === null ? "—" : `${summary.successRate}%`}</strong><small>Usable rate when rated</small></span>
        <span><strong>{summary.uniqueWorkflows}</strong><small>Workflows tried</small></span>
      </div>

      {entries.length ? (
        <div className="impact-history">
          <div className="impact-history-title">
            <span><strong>Recent build evidence</strong><small>Source material and learner responses are never stored; setup labels stay on this device.</small></span>
            <button type="button" onClick={onCopySummary}>Copy anonymous pilot snapshot</button>
          </div>
          <div className="impact-history-list">
            {entries.slice(0, 6).map((entry) => (
              <article key={entry.id}>
                <i>{entry.snapshot.artifactId === "worksheet-bundle" ? "WB" : "AI"}</i>
                <span>
                  <strong>{entry.mission} · {entry.artifactLabel}</strong>
                  <small>{entry.classLabel} · {entry.subject} · {entry.language} · {entry.providerName}</small>
                </span>
                <em className={`outcome-${entry.outcome}`}>{OUTCOME_LABELS[entry.outcome]}</em>
                <button type="button" onClick={() => onRepeat(entry)}>Use setup again →</button>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="impact-empty">
          <i aria-hidden="true">01</i>
          <span><strong>Your evidence loop starts after the first AI handoff.</strong><small>Create an artifact, return here, and confirm whether the AI produced a usable file.</small></span>
          <button type="button" onClick={onClose}>Create the first artifact →</button>
        </div>
      )}

      <p className="impact-privacy"><i aria-hidden="true" /> Private by default: this evidence stays in your browser until you choose to copy an anonymised summary.</p>
    </section>
  );
}
