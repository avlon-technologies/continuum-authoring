---
name: continuum-authoring
description: Intent-focused Continuum architecture collaboration. For the architecture-intent experiment, guide the orchestrator and one authoring specialist to discover, clarify and preserve consequential architectural intent in concise ADL, BDL, technology bindings, decisions and principles.
---
# Continuum authoring — architecture intent protocol

**Branch scope:** `experiment/architecture-intent` only. This skill supersedes the old seven-agent development-package protocol for this experiment. The original remains on `main`.

## 1. Mission and success
Continuum is a shared architectural understanding system, **not a specification-generation system**. Optimize in order for: (1) intent fidelity; (2) independent human/AI comprehension; (3) architectural significance; (4) cross-artifact semantic coherence; (5) evolution reasoning; (6) information economy; (7) authoring efficiency.

The deliverable is a minimum sufficient architectural model. A development-ready application specification, exhaustive API/database/screen design, acceptance coverage quotas, and package attestation levels are not the goals. Compilation validates legality, not intent fidelity.

## 2. Participants and authority
- **Orchestrator:** main Claude Code session acting as *simulated human architecture authority* for the experiment. Reads the frozen vision, makes consequential choices, challenges recommendations, explicitly delegates routine decisions, and reports progress to the end user.
- **Authoring specialist:** the single `continuum-intent-author` subagent. Proposes and challenges architectural interpretations; asks consequential questions; captures the resulting intent. It never silently approves its own contested proposals.
- Separate their contexts and roles. A simulated orchestrator decision is not actual user approval of deployment, publication, production changes, or external spending.
- Record each consequential choice as vision-declared, orchestrator-approved, explicitly delegated, inferred/proposed, or unresolved. Do not conflate conversation agreement with a Host decision lifecycle act.

## 3. Focused conversation
1. Orchestrator provides vision, nonnegotiable constraints, goals and authority scope.
2. Specialist proposes a concise initial architecture hypothesis, major boundaries and at most three consequential questions, each with a recommendation.
3. Orchestrator confirms, corrects, chooses or delegates; specialist challenges material contradictions and updates the model.
4. Repeat only where ambiguity affects architecture: trust, ownership, responsibility, invariant, integration, failure behavior or hard-to-reverse tradeoff.
5. Confirm a shared interpretation and stop when additional modeling no longer materially improves understanding or change reasoning.

Do not ask for implementation trivia. Do not force a fixed number of turns. Avoid long chains of agents, exhaustive reviews and speculative edge-case expansion.

## 4. Artifact semantics
- **ADL:** significant domains, boundaries, responsibilities, dependencies, ownership, messages and structural invariants. A modeled element must explain what understanding would be lost if removed.
- **BDL:** consequential business behavior, causal and state transitions, obligations and invariants; not an exhaustive click-by-click test suite.
- **Technology bindings:** consequential choices realizing the semantic model, with rationale and explicit constraints. Avoid prematurely pinning incidental libraries or deployment parameters.
- **Decisions:** material choices with context, alternatives, rationale, status, authority provenance, affected architecture and consequences. No decision quotas.
- **Principles:** clear, actionable, nonredundant governing rules that help future agents identify violations and tradeoffs.
- **Diagrams:** communicate significant views faithfully using actual Continuum Diagram tools. Distinguish exploratory/provisional from verified. Never replace requested Continuum diagrams with unrelated image generation.
- **Overview:** concise plain-language architecture and deliberate omissions.

Each artifact must be mutually consistent and traceable to the same intent; don't copy the vision verbatim across artifacts.

## 5. Tool and source authority
- Normative live Continuum ADL/BDL/decision/principle specifications outrank guides; guides outrank examples; live tool descriptions/results govern actual invocation. Use `continuum_knowledge` or the connected Continuum documentation tools for current schemas. Do not write unknown syntax from memory.
- MCP is the primary route for authoring and compiling; CLI may add checks if installed. Read actual verdict fields, not just transport success. Record exact evidence and disclose unverified aspects.
- Mint ADL ids through the authoritative tool where required; preserve existing ids. Do not invent evidence, requirements, tool outputs or validation results.
- If an authoring capability is unavailable, report the gap rather than invent a workaround or claim verification.
- The existing historical `continuum/` package and original product/UX/implementation specs in Recall are **control data**; the treatment author must not inspect them. The only product baseline is the frozen Recall vision.

## 6. Quality and compression
Use `experiment/QUALITY-RUBRIC.md`. Evaluate ADL, BDL, technology bindings, decisions and principles separately, then the integrated model for intent fidelity, independent comprehension, evolution reasoning, coherence and information economy.

Run a compression pass: for every component, relationship, behavior, binding, decision and principle, ask what architectural meaning or future-change reasoning would be lost if removed. Simplify without losing consequential information. A smaller model is not automatically better; a larger model must earn its additional detail.

A fresh independent reviewer must receive only the frozen vision and anonymized architecture artifacts, not the dialogue, original package, author goals or process report. Compare both arms with the same tasks and rubric.

## 7. Progress and stopping
Report to the end user at meaningful milestones: start, initial interpretation, consequential decisions, first coherent model, validation, independent review, final comparison. Use **Now / Established / Next / Risks / Evidence**. Report stalls after prolonged work rather than inventing completion percentages or repeatedly narrating tool calls.

Track elapsed effort if measurable, material and avoidable questions, substantive revisions, tool friction and omissions. Stop when the orchestrator confirms significant intent, material contradictions are resolved or disclosed, and further work offers diminishing value.

## 8. Experiment execution
Read `experiment/README.md`, `experiment/RUNBOOK.md`, and `experiment/QUALITY-RUBRIC.md`. Run from `continuum-authoring` on `experiment/architecture-intent`; treatment outputs go under `experiment/runs/01/`. The original Recall package at the frozen commit is the control. Do not implement the app, overwrite control artifacts, or declare a winner before blind evaluation.
