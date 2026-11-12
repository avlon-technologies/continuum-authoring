# Architecture intent experiment — runbook

## Setup
Run from the `experiment/architecture-intent` branch of **continuum-authoring**. This is the experiment framework repository; **ai-recall** is the product case study and source of the frozen original control.

Start a fresh Claude Code session using:
```powershell
cd C:\projects\avlon\continuum-authoring
git fetch origin
git switch experiment/architecture-intent
claude --agent intent-orchestrator
```
Verify the agent is available. If it isn't, stop rather than silently substituting the old `continuum-architect` agent.

## Data isolation
- Frozen control: `avlon-technologies/ai-recall` commit `e1caf64c6ec29b78c93102d12191e062d0eae6e7`.
- Extract only the `VISION.md` from that commit for the **treatment author**. Verify the vision revision; do not pass other control files or the control package.
- Do not inspect original `ai-recall/continuum/`, `docs/product/`, `docs/ux/`, decisions, reports, or prior conversations during treatment authoring.
- The orchestrator may see the vision and the treatment author's outputs, not the control architecture.
- Write new artifacts under `experiments/architecture-intent/runs/01/artifacts/`; process logs separately.
- The control architecture is read **only after treatment artifacts are frozen**, by an evaluator preparing masked packets.

## Run
1. Orchestrator briefs intent-author with product vision, objectives, authority and constraints.
2. Intent-author proposes an initial architecture and up to three consequential questions with recommendations.
3. Orchestrator responds with authority decisions and rationale; specialist authors model incrementally.
4. Repeat only for material uncertainties. Log consequential decisions, provenance, milestone progress and observed effort.
5. Produce ADL, BDL, technology bindings, decisions, principles, and architecture overview/diagrams at the minimum sufficient level.
6. Validate against current Continuum tools. Never report a compiler pass as proof of semantic quality.
7. Compress unnecessary elements; orchestrator confirms shared understanding; freeze treatment artifacts.
8. Assemble anonymized architecture-only packets for the original control and new treatment. Run independent reviews in separate contexts with the same `EVALUATOR.md` and `QUALITY-RUBRIC.md`.
9. Compare primary understanding and evolution metrics, artifact-specific scores and measured cost. Publish evidence, material errors and limitations; don't declare a winner without both evaluations.

## User progress
Follow `PROGRESS-CONTRACT.md`. At start, first interpretation, significant decision, first coherent model, validation and finish, report observed progress. If 10–15 minutes pass without a milestone and time is measurable, provide a brief status. Never invent percentages or times.

## Safety and scope
No product implementation, cloud provisioning, publication or merge. Do not modify historical control artifacts. Any external costs or real-user approvals require actual authorization. A simulated orchestrator cannot grant authority outside the experiment.

## Current state
**PREPARED; NOT RUN.** Agent definitions and protocols committed; runtime agent discovery and Continuum tool access must be verified locally.
