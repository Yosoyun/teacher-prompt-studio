"use client";

import { useState, type CSSProperties } from "react";
import type { ArtifactFile, ArtifactProfile } from "./artifact-data";

type ArtifactStageProps = {
  artifact: ArtifactProfile;
  mission: string;
  topic: string;
  subject: string;
  classLabel: string;
  board: string;
  files: ArtifactFile[];
  assessmentMode: boolean;
};

const shortBoard = (value: string) => value.replace(" / NCERT", "").replace("CISCE — ", "");

export default function ArtifactStage({
  artifact,
  mission,
  topic,
  subject,
  classLabel,
  board,
  files,
  assessmentMode,
}: ArtifactStageProps) {
  const [scene, setScene] = useState(0);
  const [modelValue, setModelValue] = useState(58);
  const [branch, setBranch] = useState("Observe");

  const cycleScene = (direction: number) => {
    setScene((current) => (current + direction + 4) % 4);
  };

  const renderDocument = () => {
    const assessment = assessmentMode;
    const layers = assessment
      ? ["Academic cover + instructions", "Complete questions + marks", "Response space + page logic", "Teacher key kept separate"]
      : ["Concept architecture", "Worked contrast", "Learner application", "Teacher-use layer"];

    return (
      <div className="stage-document" aria-label="Document blueprint preview">
        <button type="button" className="paper paper-back" onClick={() => cycleScene(-1)} aria-label="Previous preview page">
          <span>{assessment ? "Teacher assessment pack" : "Editable source"}</span>
        </button>
        <button type="button" className="paper paper-front" onClick={() => cycleScene(1)} aria-label="Next preview page">
          <small>{assessment ? "Student paper · " : ""}{shortBoard(board)} · {classLabel}</small>
          <strong>{topic || mission}</strong>
          <div className="paper-meta"><span>{subject}</span><b>{assessment ? "Time · Marks · Version" : "Academic edition"}</b></div>
          <i className="paper-rule wide" />
          <i className="paper-rule" />
          <div className="paper-callout">
            <span>{scene + 1}</span>
            <p>{layers[scene]}</p>
          </div>
          <i className="paper-rule wide" />
          <i className="paper-rule short" />
          <div className="paper-preflight"><span>Glyphs ✓</span><span>Placeholders 0</span><span>Audience-safe</span></div>
          <em>Tap page to inspect the next production layer</em>
        </button>
      </div>
    );
  };

  const renderSlides = () => (
    <div className="stage-slides" aria-label="Slide deck blueprint preview">
      <div className="slide-counter">{scene + 1} / 4</div>
      <button type="button" className="slide-arrow prev" onClick={() => cycleScene(-1)} aria-label="Previous slide">←</button>
      <div className={`slide-canvas slide-scene-${scene}`}>
        <small>{subject} · {classLabel}</small>
        <strong>{[topic, "See the hidden pattern", "Test the idea", "Explain the transfer"][scene] || mission}</strong>
        <div className="slide-visual"><i /><i /><i /></div>
        <p>{["A visual hook derived from the topic", "A purposeful reveal, not a bullet wall", "An active learner decision", "A final evidence move"][scene]}</p>
      </div>
      <button type="button" className="slide-arrow next" onClick={() => cycleScene(1)} aria-label="Next slide">→</button>
      <div className="slide-dots" aria-hidden="true">
        {[0, 1, 2, 3].map((item) => <i className={item === scene ? "active" : ""} key={item} />)}
      </div>
    </div>
  );

  const renderVisual = () => (
    <div className="stage-map" aria-label="Visual mind map blueprint preview">
      <button type="button" className={`map-node node-a ${scene === 0 ? "active" : ""}`} onClick={() => setScene(0)}>Meaning</button>
      <button type="button" className={`map-node node-b ${scene === 1 ? "active" : ""}`} onClick={() => setScene(1)}>Pattern</button>
      <div className="map-core"><small>{subject}</small><strong>{topic || mission}</strong></div>
      <button type="button" className={`map-node node-c ${scene === 2 ? "active" : ""}`} onClick={() => setScene(2)}>Example</button>
      <button type="button" className={`map-node node-d ${scene === 3 ? "active" : ""}`} onClick={() => setScene(3)}>Transfer</button>
      <p className="map-caption" aria-live="polite">
        {[
          "Start with intuitive meaning.",
          "Reveal the subject-native relationship.",
          "Contrast example and misconception.",
          "Finish with a new situation.",
        ][scene]}
      </p>
    </div>
  );

  const renderFlowchart = () => (
    <div className="stage-flow" aria-label="Interactive flowchart blueprint preview">
      <button type="button" className={branch === "Observe" ? "active" : ""} onClick={() => setBranch("Observe")}><i>1</i><span>Observe</span></button>
      <b aria-hidden="true">→</b>
      <button type="button" className={branch === "Choose" ? "active" : ""} onClick={() => setBranch("Choose")}><i>2</i><span>Choose</span></button>
      <div className="flow-split" aria-hidden="true"><b>↙</b><b>↘</b></div>
      <button type="button" className={branch === "Repair" ? "active" : ""} onClick={() => setBranch("Repair")}><i>3A</i><span>Repair</span></button>
      <button type="button" className={branch === "Extend" ? "active" : ""} onClick={() => setBranch("Extend")}><i>3B</i><span>Extend</span></button>
      <div className="flow-merge" aria-hidden="true"><b>↘</b><b>↙</b></div>
      <button type="button" className={branch === "Verify" ? "active" : ""} onClick={() => setBranch("Verify")}><i>4</i><span>Verify</span></button>
      <p aria-live="polite"><strong>{branch}</strong> · every route shows the next action in one glance.</p>
    </div>
  );

  const renderWebsite = () => (
    <div className="stage-browser" aria-label="Interactive website blueprint preview">
      <div className="browser-bar"><i /><i /><i /><span>lesson.local/{subject.toLowerCase().replace(/\W+/g, "-")}</span></div>
      <div className="browser-nav">
        {["Explore", "Try", "Check", "Reflect"].map((item, index) => (
          <button type="button" className={scene === index ? "active" : ""} onClick={() => setScene(index)} key={item}>{item}</button>
        ))}
      </div>
      <div className="browser-content">
        <small>{shortBoard(board)} · {classLabel}</small>
        <strong>{topic || mission}</strong>
        <p>{[
          "See the big idea through a topic-specific visual.",
          "Change one variable and predict what happens.",
          "Receive useful feedback, not a score alone.",
          "Explain what changed and why.",
        ][scene]}</p>
        <div className="browser-cards"><i /><i /><i /></div>
      </div>
    </div>
  );

  const renderSimulation = () => (
    <div className="stage-simulation" aria-label="Interactive simulation blueprint preview">
      <div className="sim-head"><span><i /> Model running</span><button type="button" onClick={() => { setModelValue(58); setBranch("Observe"); }}>Reset</button></div>
      <div className="sim-display">
        <small>{topic || mission}</small>
        <div className="sim-orbit" style={{ "--sim-value": `${modelValue}%` } as CSSProperties}><i /><strong>{modelValue}</strong></div>
        <p>{modelValue < 35 ? "Foundation state" : modelValue > 75 ? "Transfer state" : "Concept state"}</p>
      </div>
      <label className="sim-control">
        <span>Change the model</span>
        <input type="range" min="10" max="95" value={modelValue} onChange={(event) => setModelValue(Number(event.target.value))} />
      </label>
      <div className="sim-decisions">
        {["Predict", "Test", "Explain"].map((item) => <button type="button" onClick={() => setBranch(item)} className={branch === item ? "active" : ""} key={item}>{item}</button>)}
      </div>
    </div>
  );

  const renderSpreadsheet = () => (
    <div className="stage-sheet" aria-label="Spreadsheet blueprint preview">
      <div className="sheet-tabs"><button type="button" className={scene === 0 ? "active" : ""} onClick={() => setScene(0)}>Data</button><button type="button" className={scene === 1 ? "active" : ""} onClick={() => setScene(1)}>Analysis</button><button type="button" className={scene > 1 ? "active" : ""} onClick={() => setScene(2)}>Next steps</button></div>
      <div className="sheet-grid">
        <span>#</span><strong>Learner</strong><strong>Evidence</strong><strong>Next move</strong>
        {["01", "02", "03", "04"].map((item, index) => (
          <div className="sheet-row" key={item}><span>{item}</span><i /><b style={{ width: `${42 + index * 12}%` }} /><em>{index % 2 ? "Extend" : "Repair"}</em></div>
        ))}
      </div>
      <div className="sheet-insight"><strong>{scene === 0 ? "4 records ready" : scene === 1 ? "2 patterns found" : "3 actions suggested"}</strong><span>Formulas and checks remain editable.</span></div>
    </div>
  );

  const renderBundle = () => (
    <div className="stage-bundle" aria-label="Multi-file bundle blueprint preview">
      <div className="bundle-core"><span>{artifact.glyph}</span><strong>{topic || mission}</strong><small>{classLabel} · {shortBoard(board)}</small></div>
      {files.slice(0, 4).map((file, index) => (
        <button type="button" className={`bundle-file file-${index}`} onClick={() => setScene(index)} key={file.label}>
          <span>{file.format}</span><strong>{file.label}</strong><i>{scene === index ? "Previewing" : "Ready in pack"}</i>
        </button>
      ))}
    </div>
  );

  const renderBrainstorm = () => (
    <div className="stage-brainstorm" aria-label="Brainstorm canvas blueprint preview">
      {["Learning value", "Originality", "Feasibility", "Evidence"].map((item, index) => (
        <button type="button" className={`idea-cluster idea-${index} ${scene === index ? "active" : ""}`} onClick={() => setScene(index)} key={item}>
          <span>{index + 1}</span><strong>{item}</strong><small>{["Why it matters", "What feels new", "What it needs", "How we will know"][index]}</small>
        </button>
      ))}
      <div className="idea-route"><span>Explore</span><b>→</b><span>Challenge</span><b>→</b><strong>Choose</strong></div>
    </div>
  );

  const preview = artifact.id === "slide-deck" || artifact.id === "media-storyboard"
    ? renderSlides()
    : artifact.id === "visual-infographic"
      ? renderVisual()
      : artifact.id === "flowchart-map"
        ? renderFlowchart()
        : artifact.id === "interactive-website"
          ? renderWebsite()
          : artifact.id === "branching-simulation"
            ? renderSimulation()
            : artifact.id === "data-spreadsheet"
              ? renderSpreadsheet()
              : artifact.id === "resource-bundle"
                ? renderBundle()
                : artifact.id === "brainstorm-canvas"
                  ? renderBrainstorm()
                  : renderDocument();

  return (
    <section className={`artifact-stage artifact-${artifact.id}`} aria-labelledby="artifact-stage-title">
      <div className="stage-heading">
        <div>
          <span><i /> Live artifact blueprint</span>
          <h3 id="artifact-stage-title">{mission}</h3>
          <p>{artifact.shortLabel} · {classLabel} · {subject}</p>
        </div>
        <strong>{artifact.glyph}</strong>
      </div>
      <div className="stage-preview">{preview}</div>
      <div className="stage-manifest">
        {files.map((file) => (
          <span key={`${file.label}-${file.format}`}><i>{file.format}</i><strong>{file.label}</strong>{file.required && <small>Required</small>}</span>
        ))}
      </div>
      <p className="stage-note">This is the live structure preview. Your chosen AI is instructed to build and attach the real files.</p>
    </section>
  );
}
