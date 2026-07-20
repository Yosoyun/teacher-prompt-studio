# Teacher Prompt Studio — YC Application Draft

This draft is intentionally conservative. Replace every **[UNKNOWN]** only with evidence that can be substantiated.

## Company

- **Company name:** Teacher Prompt Studio
- **Website:** https://yosoyun.github.io/teacher-prompt-studio/
- **Category:** Education / vertical AI workflow software
- **Location and post-YC location:** **[UNKNOWN — founders to complete]**
- **Legal entity:** **[UNKNOWN — founders to complete]**

## What does the company make?

Teacher Prompt Studio helps Indian secondary and coaching teachers create assessment artifacts without writing prompts. A teacher chooses a job such as a question paper or DPP, sets class, board, topic, language and file requirements, then opens a chosen external AI with a rigorous production brief already copied.

The current product is a provider-flexible compiler and handoff layer. The external AI generates the final file. Teachers can record whether the result was usable, needed repair or returned text only, and can reuse a successful setup on the same device.

Our vision is to become the provider-agnostic production and independent verification layer for classroom artifacts.

## What is the narrow starting market?

**[HYPOTHESIS]** Classes 6–12 subject teachers and coaching faculty in India who repeatedly produce question papers, DPPs, worked solutions, theory notes and chapter packs. We will start with assessment-heavy mathematics and science workflows and expand only after measuring repeat use.

The Ministry of Education's UDISE+ 2025–26 release reports 10,273,020 teachers across Indian school education, compared with 10,122,420 in 2024–25 ([official PIB release, 7 July 2026](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2282141&lang=1&reg=48)). This is national context, not our initial addressable-market estimate. The size and willingness to pay of the narrow ICP remain **[UNKNOWN]**.

## How far along are you?

**[SHIPPED]**

- A deployed static four-step web app.
- 79 structured workflows, including 29 tap-first recipes.
- 12 artifact types and 7 external AI handoffs.
- Assessment blueprint logic, physical student/teacher file separation, multilingual production requirements, source safeguards and repair prompts.
- A browser-local impact ledger that records teacher-confirmed outcomes and supports reuse.

**Not shipped:** generation inside Teacher Prompt Studio, ingestion of returned files, independent artifact validation, cloud accounts, team workspaces, billing or institution administration.

## How long have you worked on this, and how much full-time?

**[UNKNOWN — founders to provide dates, hours and full-time status].**

Do not infer this from repository history without founder confirmation.

## How many active users do you have?

**[UNKNOWN — no verified active-user data supplied].**

The current product keeps its impact ledger on each device and does not expose global product analytics. Device-local counts cannot be presented as company-wide traction.

## Do you have revenue?

**[UNKNOWN — no verified revenue or payment data supplied].**

The 12-week pilot will test actual paid continuation rather than survey-only willingness.

## What is the core insight?

Teachers do not want to become prompt engineers. They want a trustworthy artifact they can print, edit, project or share. Generic AI often produces plausible content while failing the production contract: wrong totals, missing files, mixed teacher/student material, invented board claims, broken Indic text or ordinary chat prose instead of a real artifact.

We encode the classroom job, artifact manifest and quality gates before the model begins. The next step is to verify the returned artifact independently rather than trusting the model's own assurance.

## Why is this different from ChatGPT, Claude, Gemini or Canva?

Those products are execution tools or general creation surfaces. Teacher Prompt Studio is intended to preserve a teacher-specific workflow across providers: board/class context, assessment architecture, artifact manifest, privacy boundary, quality checks, repair history and approved reuse.

Today, our differentiation is workflow depth and a comfortable provider-flexible handoff. That alone is not a durable moat. Our planned moat is measured provider capability, deterministic artifact validation, accepted repair sequences and institution-approved template lineage.

## Who are the competitors?

- General AI assistants that can generate teaching content.
- Document and design tools with AI features.
- Teacher resource marketplaces and assessment generators.
- Prompt libraries and teacher-specific AI wrappers.

**[UNKNOWN]** A named competitor matrix, win/loss evidence and switching interviews have not yet been supplied. These should be added only after direct comparison.

## How will you make money?

**[HYPOTHESIS]**

- Teacher Pro for versioned setups, independent checks, premium managed production and deeper reuse.
- Department plans for shared approved templates, review and quality evidence.
- Institution or coaching-chain plans for provider policy, administration, private libraries, SSO and support.

Price points are **[UNKNOWN]**. Early tests should collect real payments or deposits.

## How will you acquire users?

**[HYPOTHESIS]** Show finished before/after assessment artifacts in teacher communities and creator channels; allow successful configurations to be reused and shared; convert active clusters into department or coaching-team pilots. The artifact is the acquisition object, not the hidden prompt.

No acquisition channel, conversion rate or customer-acquisition cost is yet verified.

## What is your progress plan for the next 12 weeks?

- **[TARGET]** 30 consented teachers across at least 3 departments or coaching teams.
- **[TARGET]** 70% activation within 7 days.
- **[TARGET]** 70% teacher-confirmed usable-file rate among rated handoffs.
- **[TARGET]** 40% week-4 and 30% week-12 creator retention among activated teachers.
- **[TARGET]** 30 independently reviewed anonymised artifacts with at least 80% avoiding major release failure.
- **[TARGET]** Paid continuation from at least 5 teachers or 2 organisational buyers.
- **[TARGET]** A working independent validator for one assessment bundle format.

These are goals, not achieved results. Definitions and collection rules are in [PILOT_SCORECARD.md](./PILOT_SCORECARD.md).

## What could become defensible?

A privacy-preserving workflow-quality graph connecting classroom context, artifact contract, provider/model/date, deterministic failure labels, repair attempts, teacher acceptance and institution-approved template lineage. The system can improve routing and defaults without retaining learner work or source text.

## Why this team?

**[UNKNOWN — founders should add specific first-hand teaching, assessment, design, distribution and technical insight].**

Avoid generic passion statements. Include concrete evidence: classes taught, materials produced, teacher networks served, products built and counterintuitive lessons learned.

## Founder and company details to complete

- Founder names, roles and ownership: **[UNKNOWN]**
- Who writes code and who designs pedagogy: **[UNKNOWN]**
- Other commitments, employment or study: **[UNKNOWN]**
- Incorporation jurisdiction and date: **[UNKNOWN]**
- Funding, grants, debt or prior incubators: **[UNKNOWN]**
- Intellectual-property ownership: **[UNKNOWN]**
- Current monthly burn and runway: **[UNKNOWN]**
- Fundraising amount and use of funds: **[UNKNOWN]**
- Founder video link: **[UNKNOWN]**

## Questions to answer before submission

1. Which teacher cohort returns weekly without reminders?
2. Which one artifact job creates the strongest “I would pay for this” response?
3. What fails when the same job is run directly in a generic AI?
4. Can we independently validate one returned bundle better than the provider can self-report?
5. Which acquisition channel produces activated teachers, not visitors?
6. Which buyer pays: teacher, department head, coaching owner or school administrator?
7. What founder advantage is difficult for a general AI team to reproduce?
