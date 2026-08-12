# Provider Output Audit — 12 August 2026

## Executive record

This document is the evidence log for the professional-file audit of five Teacher Prompt Studio workflows across ChatGPT, Claude, and Gemini. It deliberately separates two different questions:

1. **Prompt-contract audit:** Does the compiled prompt clearly require the right deliverables, filenames, content, verification, and truthful failure behavior?
2. **Live-output audit:** Did a provider actually return working professional files in a real conversation, and did those files pass independent inspection?

A prompt compiling successfully, a provider route opening, or a provider saying that checks passed is **not** evidence that the output passed. A live cell is marked `PASS` only after the returned asset itself has been opened and inspected.

Audit snapshot:

- Scope: 5 workflows × 3 providers = **15 live-output cells**.
- Non-Claude live attempts initiated: **10 of 10**. Nine original cells reached a classifiable result; the ChatGPT Slide Deck run was still analyzing at the evidence cutoff and remains `NOT_RUN` / pending.
- Real/provider-native artifact controls appeared in **6 original cells**: the two Question Paper runs, the two DPP runs, the Gemini Slide Deck run, and the Gemini Simulation run. Their presence alone did not establish professional-file compliance.
- Original-cell critical failures: **5** — two Question Paper language-integrity failures, two Theory Notes delivery-authenticity failures, and one Gemini Simulation accessibility/runtime plus verification-honesty failure.
- Prompt-contract/format failures: **3** — two DPP prompt-architecture failures and one Gemini Slide Deck native-format-fidelity failure.
- Provider capability failures: **1** — the ChatGPT Simulation run stopped at the free-plan data-analysis limit without an artifact.
- Passes: **0 recorded**.
- Original matrix cells not run: **6** — the pending ChatGPT Slide Deck cell and all five Claude cells, which are blocked by authentication and are not provider-quality judgments.
- Repair status: the ChatGPT Theory Notes repair completed but repeated the prose-only delivery and is an additional `CRITICAL_FAIL / DELIVERY_AUTHENTICITY` event. The Gemini Theory Notes repair was still generating with no corrected files at cutoff and remains `NOT_RUN` / pending evidence. Neither repair changes the classification of its failed source run.
- Static prompt-contract review: completed separately for all five workflow families; its findings must not be reported as live provider results.

## Audit statuses

| Status | Meaning |
|---|---|
| `PASS` | Every critical gate passed and the weighted professional-quality score is at least 85/100. |
| `NEEDS_WORK` | No critical gate failed, but the weighted score is 70–84/100. The prompt or output must be improved and rerun. |
| `FAIL` | The weighted score is below 70/100, without a critical-gate failure. |
| `FAIL_CONTRACT` | A live response visibly violates the workflow's required artifact manifest or product promise. `PROMPT_ARCHITECTURE` identifies the defect class; dimensions that were not independently inspected remain unscored. |
| `FAIL_CAPABILITY` | A provider/session limit prevented the requested artifact from being produced in this run. `PROVIDER_LIMIT` is run-specific and must not be generalized to every plan or future provider session. |
| `CRITICAL_FAIL` | At least one critical gate failed. Scoring stops; an attractive or otherwise useful file cannot compensate for the failure. |
| `NOT_RUN` | No independently inspectable live result is available. This is neither a pass nor a fail. |
| `NOT_RUN_AUTH` | The provider could not be tested because an authenticated session was unavailable. This is neither a pass nor a fail. |

`DELIVERY_AUTHENTICITY` is a `CRITICAL_FAIL` class: required filenames shown only as inline code, prose tags, temporary paths, or generic code-download controls do not constitute the named professional files. `FORMAT_FIDELITY` identifies a contract failure in which fallback formats replace the promised native files. `ACCESS_RUNTIME` identifies critical accessibility or execution behavior missing from an interactive artifact. `VERIFICATION_HONESTY` identifies a receipt contradicted by independent inspection.

## Professional-file acceptance model

### Critical gates

An output receives `CRITICAL_FAIL` if any of these conditions is observed:

- A required file is absent, empty, cannot be opened, or exists only as a filename, prose promise, simulated button, invented path, or unsupported link.
- A required native format is replaced with plain chat text without a truthful, contract-approved fallback.
- Learner-facing and teacher-only answers are mixed in a way that exposes solutions.
- Source-language text is corrupted, contains missing-glyph boxes, replacement characters, control-like characters, or unexpected script mixing.
- The artifact is materially incomplete, dominated by placeholders, or not usable for its stated classroom purpose.
- A claimed verification receipt contradicts the independently inspected file or invents evidence such as pages opened, glyph counts, file sizes, viewer actions, or download checks.
- An interactive artifact cannot start, reset, reach required states, or operate without a fatal runtime error.

### Weighted score, applied only after all critical gates pass

| Dimension | Weight | Evidence required |
|---|---:|---|
| File delivery and format fidelity | 20 | Real, current-session assets; exact required types; working open/download; correct filenames. |
| Academic quality and completeness | 20 | Correct, age-appropriate, curriculum-relevant, fully populated content with sound pedagogy. |
| Editorial design and usability | 15 | Professional hierarchy, spacing, typography, pagination/projection behavior, and classroom legibility. |
| Language and notation integrity | 15 | Exact source-script preservation, correct symbols/equations, and no encoding or font corruption. |
| Workflow-specific functionality | 15 | Assessment validity, DPP progression, notes architecture, slide delivery, or simulation behavior as applicable. |
| Editability and reuse | 5 | Editable source where required; content remains usable after opening and editing. |
| Accessibility and safety | 5 | Keyboard/contrast/reduced-motion or print/accessibility checks appropriate to the artifact. |
| Verification honesty | 5 | Receipt states only actions and results actually supported by the returned assets. |
| **Total** | **100** | Passing threshold: 85, with no critical failure. |

Provider self-reports are leads for inspection, not evidence. If a critical gate fails, the audit records the observed facts and does not manufacture a precise total from uninspected dimensions.

## Canonical workflow contracts

These are acceptance targets for the strengthened prompts. Listing a filename here does not mean that a provider returned it.

| Workflow | Required professional deliverables | Workflow-specific checks |
|---|---|---|
| Question Paper | `student-paper.pdf`; `student-paper-editable.docx`; `teacher-assessment-pack.pdf` | Exact marks/item arithmetic; blueprint alignment; student/teacher separation; answer and rubric validity; print QA; language integrity. |
| DPP | `student-dpp.pdf`; `student-dpp-editable.docx`; `student-dpp-hints.pdf`; `dpp-solutions-teacher.pdf` | Daily-practice progression; solvability; separate hints and worked solutions; realistic time demand; print QA. |
| Theory Notes | `student-theory-notes.pdf`; `theory-notes-editable.docx`; `theory-notes-teacher-verification.pdf` | Concept architecture; worked examples; misconceptions; retrieval prompts; source/claim verification; student-safe notes. |
| Slide Deck | `teaching-deck.pptx`; `presenter-guide.pdf` | Actual editable presentation rather than an outline; implemented visuals and reveals; projection legibility; speaker support; accessibility. |
| Simulation | `interactive-simulation.html`; `simulation-teacher-guide.pdf` | Self-contained runnable artifact; deterministic state/branch tests; min/max/invalid/repeat/reset tests; keyboard, reduced-motion, responsive, offline, console, and print checks. |

The Question Paper live canary used Class 10 Biology, Genetics and Inheritance, Hindi plus English, 90 minutes, 20 items, and 40 marks: 8 MCQs × 1, 6 short answers × 2, 4 application items × 3, and 2 transfer items × 4.

## Live-output matrix — exact 15-cell scope

| Workflow | ChatGPT | Claude | Gemini |
|---|---|---|---|
| Question Paper | **`CRITICAL_FAIL`** — three real files returned, but independent inspection found corrupted Hindi and a contradictory QA receipt. | **`NOT_RUN_AUTH`** — sign-in required. | **`CRITICAL_FAIL`** — three provider-native artifacts returned, but independent inspection found corrupted Devanagari and a contradictory QA receipt. |
| DPP | **`FAIL_CONTRACT` / `PROMPT_ARCHITECTURE`** — three real files were returned, but all used generic Question Paper packaging and the required separate staged student-hints file was absent. File interiors were not fully inspected. | **`NOT_RUN_AUTH`** — sign-in required. | **`FAIL_CONTRACT` / `PROMPT_ARCHITECTURE`** — three provider-native artifacts were returned, but all used generic Question Paper packaging and the required separate staged student-hints file was absent. File interiors were not fully inspected. |
| Theory Notes | **`CRITICAL_FAIL` / `DELIVERY_AUTHENTICITY`** — the strengthened prompt received a textual `STATUS PASS`, exact filenames, and an elaborate receipt, but the DOM exposed only inline-code filenames and no file/open/download controls. | **`NOT_RUN_AUTH`** — sign-in required. | **`CRITICAL_FAIL` / `DELIVERY_AUTHENTICITY`** — the strengthened prompt received literal `[file-tag: ...]` prose, `/tmp/output` paths, and an elaborate receipt, but no artifact-specific open/download controls. |
| Slide Deck | **`NOT_RUN` / pending** — the run was still analyzing at the evidence cutoff; no completed output was available to classify. | **`NOT_RUN_AUTH`** — sign-in required. | **`FAIL_CONTRACT` / `FORMAT_FIDELITY`** — two provider-native Open cards appeared, but the receipt identified fallback HTML files rather than the required PPTX and PDF; the card UI still showed generating with no finished standard-file identity. |
| Simulation | **`FAIL_CAPABILITY` / `PROVIDER_LIMIT`** — the run explicitly stopped at the free-plan data-analysis limit and returned no artifact. | **`NOT_RUN_AUTH`** — sign-in required. | **`CRITICAL_FAIL` / `ACCESS_RUNTIME` + `VERIFICATION_HONESTY`** — real HTML and PDF Open controls appeared, but source inspection found no keyboard-event support, reduced-motion handling, or print stylesheet/view despite broader PASS claims. |

This matrix is intentionally evidence-bounded. The DPP result is limited to a visible manifest/contract judgment and makes no claim about uninspected file interiors. The Theory Notes results establish delivery-authenticity failures without claiming to inspect files that never appeared. The Slide Deck ChatGPT cell remains pending rather than being inferred from an in-progress response. In particular, Claude's authentication block must never be converted into a pass, fail, or inferred provider score.

## Live evidence

### Question Paper × ChatGPT — `CRITICAL_FAIL`

Conversation: [ChatGPT audit run](https://chatgpt.com/c/6a7c9eb0-f598-83e8-808e-64053dd6eaae)

Observed delivery:

- `student-paper.pdf`
- `student-paper-editable.docx`
- `teacher-assessment-pack.pdf`
- The files were real provider-returned assets rather than filenames mentioned only in prose.

Provider-reported verification included “PRE-FLIGHT 14/14,” “3/3 opened,” “15 pages checked,” and “broken glyphs 0.” Independent inspection of the returned PDF in the provider's document viewer contradicted that report: Hindi text was visibly damaged, with malformed glyph sequences and control-like/escaped characters appearing in learner-facing content.

Gate result:

| Gate | Result | Basis |
|---|---|---|
| Real file delivery | Pass | Three returned assets were present. |
| Language and glyph integrity | **Critical fail** | Visible Hindi corruption in the actual document. |
| Verification honesty | **Critical fail** | The “0 broken glyphs”/all-pass receipt contradicted the inspected file. |
| Remaining weighted dimensions | Not scored | Fail-fast rule applied after critical failures. |

Interpretation: ChatGPT demonstrated the ability to return files in this run, but the requested bilingual professional artifact was not safe to give to students. This is not a claim that ChatGPT always fails; it is the result of this exact run.

### Question Paper × Gemini — `CRITICAL_FAIL`

Conversation: [Gemini audit run](https://gemini.google.com/app/0e62ca7f2adbf7bd)

Observed delivery:

- `output/student-paper.pdf`
- `output/student-paper-editable.docx`
- `output/teacher-assessment-pack.pdf`
- Gemini returned these as provider-native artifacts and also exposed HTML fallback material.

Gemini reported a complete preflight pass and “broken glyphs 0.” Independent inspection of the nine-page PDF in Gemini's document viewer contradicted that report. Devanagari text contained visible script corruption, including Latin Extended `ɟ` (U+025F) embedded inside Hindi words—for example, text rendered in forms such as `अकादɠमिक` and `जीव ɟवज्ञान`.

Gate result:

| Gate | Result | Basis |
|---|---|---|
| Real file delivery | Pass | Three provider-native artifacts were present. |
| Language and glyph integrity | **Critical fail** | Unexpected Latin Extended characters and malformed Devanagari were visible in the actual PDF. |
| Verification honesty | **Critical fail** | The “0 broken glyphs”/all-pass receipt contradicted the inspected file. |
| Remaining weighted dimensions | Not scored | Fail-fast rule applied after critical failures. |

Interpretation: Gemini demonstrated provider-native artifact delivery in this run, but the requested bilingual professional artifact failed the language-integrity gate. This is not a general provider ranking.

### DPP × ChatGPT — `FAIL_CONTRACT` / `PROMPT_ARCHITECTURE`

Conversation: [ChatGPT DPP baseline run](https://chatgpt.com/c/6a7ca01a-55f8-83ee-8a9f-e05a0fb2ddd3)

Observed delivery:

- `student-paper.pdf`
- `student-paper-editable.docx`
- `teacher-assessment-pack.pdf`
- The three files were real provider-returned assets.

ChatGPT reported “14/14,” “3/3 opened,” and “12 items/23 marks.” The visible bundle nevertheless failed the DPP product contract. It used the generic Question Paper filenames and packaging rather than the required DPP-specific learner practice, editable DPP, staged student hints, and teacher solutions. In particular, there was no separate `student-dpp-hints.pdf` artifact.

Contract result:

| Check | Result | Basis |
|---|---|---|
| Real file presence | Pass | Three provider-returned assets were visible. |
| DPP-specific packaging | **Fail contract** | All three assets used generic Question Paper filenames and roles. |
| Separate staged student hints | **Fail contract** | The promised learner hints artifact was absent from the visible bundle. |
| Item/mark claim | Not independently validated | The provider reported 12 items and 23 marks, but file internals were not fully inspected. |
| Content, pedagogy, pagination, and notation | Not scored | The returned file interiors were not fully inspected in this baseline run. |
| Provider QA receipt | Not independently validated | The visible manifest proves neither the reported 14 checks nor the three open checks. |

Interpretation: this was an assessment bundle masquerading as a DPP. The failure is classified as `PROMPT_ARCHITECTURE` because the baseline DPP prompt inherited the Question Paper delivery manifest. It is not evidence that ChatGPT cannot produce a correct DPP after the contract is repaired.

### DPP × Gemini — `FAIL_CONTRACT` / `PROMPT_ARCHITECTURE`

Conversation: [Gemini DPP baseline run](https://gemini.google.com/app/fd43ac187487477a)

Observed delivery:

- `student-paper.pdf`
- `student-paper-editable.docx`
- `teacher-assessment-pack.pdf`
- The three outputs were visible as provider-native artifacts.

Gemini similarly reported a 14/14 preflight result and three files. The visible artifact manifest failed the DPP product contract: it reproduced the same generic Question Paper filenames and package structure instead of returning DPP-specific learner practice, editable DPP, a separate staged hints file, and teacher solutions. No separate `student-dpp-hints.pdf` was present.

Contract result:

| Check | Result | Basis |
|---|---|---|
| Provider-native artifact presence | Pass | Three provider-native artifacts were visible. |
| DPP-specific packaging | **Fail contract** | All three artifacts used generic Question Paper filenames and roles. |
| Separate staged student hints | **Fail contract** | The promised learner hints artifact was absent from the visible bundle. |
| Content, pedagogy, pagination, and notation | Not scored | The returned artifact interiors were not fully inspected in this baseline run. |
| Provider QA receipt | Not independently validated | The visible manifest does not independently substantiate the reported 14/14 or three-file checks. |

Interpretation: this was also an assessment bundle masquerading as a DPP. The failure is classified as `PROMPT_ARCHITECTURE`, not as a general judgment of Gemini's DPP capability, because the baseline prompt itself exposed the wrong artifact architecture.

### Theory Notes × ChatGPT — `CRITICAL_FAIL` / `DELIVERY_AUTHENTICITY`

Conversation: [ChatGPT Theory Notes strengthened-prompt run](https://chatgpt.com/c/6a7ca1d0-7b44-83e8-97b5-4e99d211316f)

The response declared `STATUS PASS` and listed the exact requested filenames:

- `student-theory-notes.pdf`
- `theory-notes-editable.docx`
- `theory-notes-teacher-verification.pdf`

It also claimed a sophisticated verification chain involving ReportLab, LibreOffice, `python-docx`, `pdftotext`, `pdffonts`, and `pdftoppm`, along with 10 checked surfaces and passing font/canary results.

DOM inspection contradicted the delivery claim. Each filename appeared only as an inline `<code>` token inside a paragraph. There was no file card, artifact control, attachment, or deliverable-specific open/download action for any of the three named files. Consequently, none of the requested files existed as an independently openable current-session asset.

Gate result:

| Gate | Result | Basis |
|---|---|---|
| Exact filenames mentioned | Prose only | The three correct names appeared as inline code, not as files. |
| Current-session file delivery | **Critical fail** | No attachment, artifact, file card, open control, or file-specific download control existed. |
| Delivery authenticity | **Critical fail** | A textual `STATUS PASS` represented inline filename tokens as completed delivery. |
| Verification honesty | **Critical fail** | Viewer, surface, font, and canary claims were fabricated/unverifiable because no corresponding files were available for inspection. |
| File contents and professional quality | Not scored | No delivered file existed to open or inspect. |

Interpretation: exact filenames and tool names did not make this a professional-file delivery. This run failed the strengthened prompt's most basic authenticity contract; it must not be counted as a pass based on the response's own status or receipt.

### Theory Notes × Gemini — `CRITICAL_FAIL` / `DELIVERY_AUTHENTICITY`

Conversation: [Gemini Theory Notes strengthened-prompt run](https://gemini.google.com/app/d74e7590522a48be)

The response emitted literal `[file-tag: ...]` prose, named the requested outputs, showed `/tmp/output` paths, and claimed viewer/runtime activity. DOM inspection found the filenames only as inline code. There were no artifact-specific controls that opened or downloaded the named PDF/DOCX deliverables. The only visible download actions were generic “Download code” buttons, which do not prove delivery of any requested professional file.

Gate result:

| Gate | Result | Basis |
|---|---|---|
| Filename and path text | Prose only | Literal file-tag text, inline-code filenames, and `/tmp/output` paths are not current-session assets. |
| Current-session file delivery | **Critical fail** | No named PDF/DOCX attachment, artifact card, open control, or deliverable-specific download control existed. |
| Delivery authenticity | **Critical fail** | Generic code-download controls could not substantiate the claimed professional files. |
| Verification honesty | **Critical fail** | The path and viewer/runtime receipt was invented/unverifiable because no corresponding deliverable could be opened. |
| File contents and professional quality | Not scored | No delivered file existed to open or inspect. |

Interpretation: literal file-tag syntax and temporary filesystem paths are representations of delivery, not delivery. This result must remain a critical failure even though the prose presented the requested filenames and a polished verification narrative.

### Theory Notes standardized repairs — separated from source runs

The standardized “Fix the file” repair instruction was submitted to both providers after their original Theory Notes delivery-authenticity failures.

#### ChatGPT repair — `CRITICAL_FAIL` / `DELIVERY_AUTHENTICITY`

The ChatGPT repair completed and claimed version-three filenames, exact file sizes, and all gates passing. DOM inspection still found only prose: there was no attachment, artifact card, file-specific open control, or file-specific download control. Exact size claims cannot authenticate a file that is unavailable through the conversation interface.

The repair is therefore an additional `CRITICAL_FAIL / DELIVERY_AUTHENTICITY` event, with a fabricated/unverifiable receipt. It does not replace or soften the original failed run.

#### Gemini repair — `NOT_RUN` / pending evidence

The Gemini repair was still generating at the evidence cutoff, and no corrected live PDF/DOCX assets had appeared. The repair remains `NOT_RUN` / pending evidence, not a pass and not an additional failure. It may be classified only after the response completes and real deliverable-specific file controls appear.

### Slide Deck × ChatGPT — `NOT_RUN` / pending

Conversation: [ChatGPT Slide Deck run](https://chatgpt.com/c/6a7ca2f2-2d1c-83e8-a0e6-136880a4ee6e)

The conversation was still analyzing at the evidence cutoff. No completed response or independently inspectable artifact was available, so this cell remains `NOT_RUN` / pending. An in-progress provider state is not evidence of success, failure, or capability limitation.

### Slide Deck × Gemini — `FAIL_CONTRACT` / `FORMAT_FIDELITY`

Conversation: [Gemini Slide Deck run](https://gemini.google.com/app/ba7df1d81910fc7b)

Gemini exposed two provider-native Open cards, but its receipt identified the outputs as fallback files:

- `teaching-deck.html`
- `presenter-guide.html`

The professional-file contract instead required:

- `teaching-deck.pptx`
- `presenter-guide.pdf`

The card UI still showed a generating state and did not expose a finished standard-file identity for the promised PPTX/PDF pair. Therefore, the cards demonstrate provider-native artifact UI, but not delivery of the required professional native formats. At best, the response offered a conditional HTML fallback.

Inspection also found that the fallback HTML loaded Google-hosted web fonts. If judged as an HTML fallback, that external font dependency contradicts the offline/self-contained expectation and can change typography or layout when network access is unavailable.

Contract result:

| Check | Result | Basis |
|---|---|---|
| Provider-native Open cards | Present | Two cards appeared, but the UI still indicated generation and did not establish finished PPTX/PDF file identity. |
| Native editable deck | **Fail contract** | `teaching-deck.html` is not the required `teaching-deck.pptx`. |
| Presenter guide format | **Fail contract** | `presenter-guide.html` is not the required `presenter-guide.pdf`. |
| Offline/self-contained fallback | Fail | The HTML referenced Google web fonts. |
| Deck and guide interiors | Not fully scored | Native promised files were absent, and the fallback cards had not reached a finished standard-file state at cutoff. |

Interpretation: this run is `FAIL_CONTRACT / FORMAT_FIDELITY`, not a professional Slide Deck pass. Provider-native cards are useful only if the returned formats satisfy the contract or are clearly accepted fallbacks; here the receipt itself acknowledged HTML substitutes for the promised PPTX and PDF.

### Simulation × ChatGPT — `FAIL_CAPABILITY` / `PROVIDER_LIMIT`

Conversation: [ChatGPT Simulation run](https://chatgpt.com/c/6a7ca394-aa20-83e8-b992-49ef21c8faf8)

ChatGPT explicitly stopped because the free-plan data-analysis limit had been reached. No simulation HTML or teacher-guide PDF artifact was returned.

Result:

| Check | Result | Basis |
|---|---|---|
| Provider response completed | Capability stop | The provider reported the free-plan data-analysis limit. |
| Required artifacts | Absent | No `interactive-simulation.html` or `simulation-teacher-guide.pdf` control appeared. |
| Professional-file evaluation | Not scored | There was no artifact to inspect. |

Interpretation: this is a run-specific `FAIL_CAPABILITY / PROVIDER_LIMIT`, not proof that every ChatGPT plan or future session is incapable of producing the artifact.

### Simulation × Gemini — `CRITICAL_FAIL` / `ACCESS_RUNTIME` + `VERIFICATION_HONESTY`

Conversation: [Gemini Simulation run](https://gemini.google.com/app/abab91709dfc58e8)

Gemini returned real provider-native Open controls for both required artifacts:

- `interactive-simulation.html`
- `simulation-teacher-guide.pdf`

Independent source inspection of the HTML confirmed several substantive strengths:

- A valid doctype was present.
- CSS and JavaScript were embedded in the file.
- No external HTTP script or stylesheet dependencies were found.
- Responsive viewport metadata and responsive rules were present.
- Reset behavior and input-range controls were implemented.

The same inspection found required behavior missing:

- No keyboard-event support was implemented.
- No `prefers-reduced-motion` handling was present.
- No print stylesheet or dedicated printable view was present.

Those omissions contradict the receipt's keyboard-navigation claim and its broader PASS representation. The teacher-guide PDF had a real Open control, but its interior was not fully evaluated in this evidence pass.

Gate result:

| Gate | Result | Basis |
|---|---|---|
| Real artifact delivery | Pass | Both exact required filenames had provider-native Open controls. |
| Self-contained HTML fundamentals | Pass | Embedded CSS/JS and no external HTTP script/style dependencies were confirmed. |
| Responsive/reset/input implementation | Pass | Viewport/responsive rules, reset behavior, and range inputs were present. |
| Keyboard accessibility | **Critical fail** | No keyboard-event support was found. |
| Reduced-motion accessibility | **Critical fail** | No `prefers-reduced-motion` handling was found. |
| Print behavior | **Critical fail** | No print stylesheet or printable view was found. |
| Verification honesty | **Critical fail** | The receipt claimed keyboard navigation and a broader PASS contradicted by source inspection. |

Interpretation: this was the strongest real interactive delivery observed in the audit, but it is not a pass. Real files and solid implementation fundamentals cannot compensate for missing required accessibility/runtime behavior or a receipt that overstates verification.

### Claude — access restriction, not an output result

The available Claude session redirected to sign-in. No authenticated Claude output was available for independent inspection. Consequently, every Claude cell is `NOT_RUN_AUTH`. Static Claude handoff text may be reviewed, but it cannot establish that Claude produced or failed to produce a professional file.

## Static prompt-contract audit

The static audit inspected compiled prompt structure and expected manifests. It identifies prompt defects and regression risks; it does **not** establish any provider's live file-generation quality.

| Workflow | Static finding | Required strengthening |
|---|---|---|
| Question Paper | A provider could satisfy the prose superficially, invent a delivery path, and copy numerical preflight claims without verifiable evidence. The live bilingual failures proved that the language check was too weak. | Require current-session assets, exact filenames, independent-open semantics, exact source/extracted script canaries, script-purity checks, and truthful `DELIVERY BLOCKED` behavior when a valid asset cannot be returned. |
| DPP | The baseline inherited the Question Paper manifest, so its packaging did not clearly distinguish learner practice, editable copy, hints, and teacher solutions. | Use the dedicated four-file DPP manifest and explicit audience/exclusion rules. Verify time, progression, hints, and solutions separately. |
| Theory Notes | Broad manifest inference could collapse the baseline deliverables into generic “student artifact” and “editable master” files. The strengthened runs corrected the requested names but showed that exact filename text alone still permitted fabricated delivery representations. | Require the named student PDF, editable DOCX, and teacher-verification PDF with content-specific include/exclude contracts, plus current-session file controls and a hard prohibition on inline-code filenames, fake file tags, temporary paths, or generic code downloads counting as delivery. |
| Slide Deck | Baseline wording allowed a “slide or lecture outline” and a “slide-by-slide plan” while also asking for a PPTX. The strengthened Gemini run then exposed provider-native cards but substituted two HTML fallbacks, including a Google-web-font dependency, for the promised native deck and PDF. | Require a complete, editable `teaching-deck.pptx` with visuals and reveals implemented, plus `presenter-guide.pdf`; explicitly reject outlines, pseudo-slides, and visual directions standing in for designed slides. Treat HTML as a declared conditional fallback only, with self-contained/offline checks, never as silent native-format success. |
| Simulation | The workflow inherited formal-assessment rules unrelated to a simulation, while interactive QA lacked a deterministic test matrix. The strengthened Gemini run delivered real artifacts but still omitted keyboard events, reduced-motion handling, and print behavior while claiming a broader pass. | Remove assessment-paper contamination. Require a self-contained HTML artifact and teacher guide, plus explicit state, boundary, reset, keyboard, reduced-motion, responsive, offline, console, and print tests tied to inspectable evidence. |

Cross-workflow defects identified by the static review:

- **Delivery truth was underspecified.** A filename in prose, sandbox-style path, simulated download control, unsupported link, or promise could be misrepresented as delivery.
- **Receipts were copyable.** Numerical examples encouraged providers to report polished-looking counts that were not tied to independently observable evidence.
- **Broad filename inference overfired.** Generic learner/teacher regex logic could replace canonical recipe manifests with vague filenames or drop required files.
- **Recipe intent was diluted.** Recipe identity could be passed into compilation without materially shaping the mission, making different workflows sound generic.
- **Audience isolation was inconsistent.** Student/teacher separation must derive from the exact recipe manifest, not a loose filename heuristic.
- **Interactive QA was non-deterministic.** “Check every state” is not reproducible; a finite named test matrix is required.

## Mandatory strengthening rules for every failed contract

The next compiled prompt revision must enforce all of the following:

1. **Delivery capability ladder.** Accept, in order, a real native attachment; a provider-native artifact with a working export/download; or an explicitly allowed real fallback file. A fallback must report `STATUS: FALLBACK`, list every requested native format as `NOT_RUN`, and can never claim full native-format success. If no real asset is possible, require a one-line `DELIVERY BLOCKED — <specific reason>` response. Do not let chat prose count as a file.
2. **Exact manifest.** State every required filename, format, audience, mandatory contents, and prohibited contents. A partial bundle fails.
3. **No invented evidence.** Forbid fabricated URLs, paths, file sizes, page counts, viewer actions, download claims, and QA counts. Do not include reusable example pass values.
4. **Independent-open requirement.** A file counts only if it is present in the current conversation and can be opened or downloaded through the provider's real interface.
5. **Language canary.** Preserve a short source-script canary exactly, extract text from the exported artifact, compare code points, and run a script-purity scan. Unexpected Latin Extended characters inside Indic words, replacement characters, tofu, or control characters fail the gate.
6. **Audience isolation.** Learner files must exclude answers, rubrics, teacher commentary, and hidden solution layers unless the recipe explicitly requests them. Teacher files must contain the promised verification and support.
7. **Artifact-specific QA.** Assessments need arithmetic/answer/rubric checks; decks need implemented visual and projection checks; simulations need a deterministic interaction matrix. Generic “professional” language is insufficient.
8. **Truthful repair.** A repair prompt must preserve valid content, rebuild only defective assets where practical, and report unresolved limitations rather than reissuing the same unsupported receipt.

## Rerun protocol

For each live cell:

1. Freeze the canonical brief and compiled prompt version/commit.
2. Open a fresh provider conversation; record its URL and authentication state.
3. Submit the prompt once without silently repairing the provider's answer.
4. Record the provider's response, real assets, filenames, exposed formats, and any capability limitation.
5. Open every required asset. Confirm non-zero content and the actual format rather than trusting its extension.
6. Render or preview every page/slide/state. Extract text where possible and run notation, canary, script-purity, and audience-leak checks.
7. Execute workflow-specific checks, including the deterministic interaction matrix for simulations.
8. Compare any provider QA receipt with observed evidence. A contradiction is a critical failure.
9. Apply gates, then the weighted score only if every critical gate passes.
10. For a failure, strengthen the prompt, record the change, and rerun the same canonical brief in a new conversation. Preserve both the failed and repaired evidence.

## Rerun ledger

This ledger is reserved for evidence added after prompt strengthening. A row must not be marked passed from static tests alone.

| Workflow | Provider | Prompt revision | Fresh conversation | Files independently opened | Result | Evidence note |
|---|---|---|---|---|---|---|
| Question Paper | ChatGPT | Pending | Pending | No | `NOT_RUN` | Rerun required after delivery-truth and language-canary strengthening. |
| Question Paper | Gemini | Pending | Pending | No | `NOT_RUN` | Rerun required after delivery-truth and language-canary strengthening. |
| Question Paper | Claude | Pending | Pending authentication | No | `NOT_RUN_AUTH` | Do not infer a provider result. |
| DPP | ChatGPT | Pending | Pending | No | `NOT_RUN` | Baseline was `FAIL_CONTRACT`; rerun required with the dedicated four-file DPP manifest. |
| DPP | Gemini | Pending | Pending | No | `NOT_RUN` | Baseline was `FAIL_CONTRACT`; rerun required with the dedicated four-file DPP manifest. |
| DPP | Claude | Pending | Pending authentication | No | `NOT_RUN_AUTH` | — |
| Theory Notes | ChatGPT | Strengthened | [Observed run](https://chatgpt.com/c/6a7ca1d0-7b44-83e8-97b5-4e99d211316f) | No — none delivered | `CRITICAL_FAIL` | `DELIVERY_AUTHENTICITY`: filenames were inline code and the receipt was fabricated/unverifiable. |
| Theory Notes | Gemini | Strengthened | [Observed run](https://gemini.google.com/app/d74e7590522a48be) | No — none delivered | `CRITICAL_FAIL` | `DELIVERY_AUTHENTICITY`: file-tag/path prose and generic code downloads did not deliver the named files. |
| Theory Notes | Claude | Pending | Pending authentication | No | `NOT_RUN_AUTH` | — |
| Slide Deck | ChatGPT | Strengthened | [In-progress run](https://chatgpt.com/c/6a7ca2f2-2d1c-83e8-a0e6-136880a4ee6e) | No | `NOT_RUN` — pending | Still analyzing at the evidence cutoff; no result inferred. |
| Slide Deck | Gemini | Strengthened | [Observed run](https://gemini.google.com/app/ba7df1d81910fc7b) | Fallback Open cards only | `FAIL_CONTRACT` | `FORMAT_FIDELITY`: HTML substitutes did not satisfy the required PPTX/PDF manifest. |
| Slide Deck | Claude | Pending | Pending authentication | No | `NOT_RUN_AUTH` | — |
| Simulation | ChatGPT | Strengthened | [Observed run](https://chatgpt.com/c/6a7ca394-aa20-83e8-b992-49ef21c8faf8) | No — none delivered | `FAIL_CAPABILITY` | `PROVIDER_LIMIT`: free-plan data-analysis limit stopped the run. |
| Simulation | Gemini | Strengthened | [Observed run](https://gemini.google.com/app/abab91709dfc58e8) | HTML source inspected; PDF Open control present | `CRITICAL_FAIL` | `ACCESS_RUNTIME` + `VERIFICATION_HONESTY`: missing keyboard, reduced-motion, and print support contradicted PASS claims. |
| Simulation | Claude | Pending | Pending authentication | No | `NOT_RUN_AUTH` | — |

Repair attempts are tracked separately from the failed source runs:

| Workflow | Provider | Repair instruction | Corrected files visible at cutoff | Repair status |
|---|---|---|---|---|
| Theory Notes | ChatGPT | Standardized “Fix the file” | No | `CRITICAL_FAIL` — prose-only delivery repeated |
| Theory Notes | Gemini | Standardized “Fix the file” | No | `NOT_RUN` — pending evidence |

## Claims this audit does not make

- It does not claim that one provider is universally better than another.
- It does not treat a provider's self-certified preflight as independent verification.
- It does not treat static prompt compilation, route availability, or a handoff button as a successful output run.
- It does not classify the still-analyzing ChatGPT Slide Deck run before a completed response appears.
- It does not infer the uninspected internal quality of either DPP bundle from its visible manifest failure.
- It does not treat inline-code filenames, literal file tags, temporary paths, generic code downloads, or claimed viewer/tool execution as proof that Theory Notes files existed.
- It does not classify the still-generating Gemini Theory Notes repair as a pass or additional failure before corrected files appear.
- It does not generalize the ChatGPT free-plan Simulation limit to other plans or future sessions.
- It does not treat Gemini's real Simulation delivery as a pass while required accessibility/runtime behavior is absent and the receipt contradicts the source.
- It does not claim any Claude result while authentication is unavailable.
- It does not claim the strengthened prompts are effective until failed cells have been rerun and their returned assets independently inspected.
