# Architecture-intent experiment — Claude Code instructions

This branch tests whether Continuum enables **shared architectural understanding** with minimal sufficient modeling. It does not optimize for development-ready specification completeness.

**Launch:** `claude --agent intent-orchestrator` from the repository root. The orchestrator is the simulated human authority; it delegates to exactly one project specialist, `intent-author`. Both have dedicated files under `.claude/agents/`. Do not invoke legacy `continuum-*` completeness agents or the removed `continuum-intent-author` name.

Read `experiments/architecture-intent/README.md`, `RUNBOOK.md`, `AGENT-CONTRACTS.md`, `QUALITY-RUBRIC.md` and `PROGRESS-CONTRACT.md` in that directory. The shared skill `.claude/skills/continuum-authoring/SKILL.md` is the operational protocol.

**Isolation:** treatment author sees only Recall's VISION.md from frozen commit `e1caf64c6ec29b78c93102d12191e062d0eae6e7`, never its previous architecture or review. Do not use old development-ready documentation as a goal.

**Output:** new treatment artifacts under `experiments/architecture-intent/runs/01/artifacts/`; process records under `.../process/`. No app implementation, deployment, release or alteration of the control. The simulated authority is not a real user's approval of external changes.

**Evaluation:** after freezing treatment, run identical blind independent assessments of both packages using the canonical rubric. Report milestone progress, semantic validation evidence, measured cost where available, and uncertainty. Do not equate compilation with architectural quality.
