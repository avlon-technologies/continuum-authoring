# Branch alignment audit — architecture-intent experiment

## Goal
Every active instruction, agent, skill, experiment document and repository check on `experiment/architecture-intent` must optimize for discovering and preserving architectural intent, not for exhaustive development-package completeness.

## Consolidation
- Canonical experiment: `experiments/architecture-intent/` (plural).
- Canonical agents: `.claude/agents/intent-orchestrator.md` and `intent-author.md`.
- Canonical skill: `.claude/skills/continuum-authoring/SKILL.md`.
- Canonical launch: `claude --agent intent-orchestrator`.
- Removed the seven legacy `continuum-*` agent definitions from this branch, the duplicate `continuum-intent-author` agent, and the duplicate singular `experiment/` instructions.
- Updated `README.md`, `CLAUDE.md`, `VISION.md`, `EXPERIMENT.md`, the skill, both agents, the charter, the experiment README, and the live checks to the new goal.
- Replaced the old seven-agent static check with a tracked-file-wide consistency checker; existing GitHub Actions workflow continues to invoke `node tools/check.mjs`.
- Retained `tools/surface.json` as a dated inventory, with its scope clarified. Retained `LICENSE` and other neutral repository infrastructure.

## File alignment matrix
| Area | Status | Notes |
|---|---|---|
| Root vision, README, CLAUDE, experiment instructions | Updated | One mission, one canonical experiment path |
| Claude project agents | Consolidated | Exactly two role definitions |
| Shared skill | Rewritten | Intent fidelity, dialogue, artifact economy and evolution |
| Charter, contracts, runbook, comparison and rubric | Reviewed | Matched control/treatment with isolated authoring |
| Progress and evaluator | Reviewed | Evidence-based milestones and blind interpretation |
| Static check and CI | Updated check; CI retained | Static check walks all tracked files for Markdown link integrity |
| Live-check instructions and surface snapshot | Updated | Live verification remains outstanding |
| License and neutral infrastructure | Retained | No conflicting agent instructions expected |

## Verification boundaries
GitHub connector inspection covered 18 active Markdown instructions/contracts, agent definitions, the shared skill, the static checker, CI workflow, surface inventory and LICENSE. A connector-side check of relative Markdown links in those 18 active documents found no broken links after correction. GitHub's branch comparison confirmed the seven old agents are removed and the two canonical agent files are added. A **complete Git tree enumeration was not available through the connector**; therefore this is not a claim that every tracked file was independently read here. The revised `tools/check.mjs` is designed to enumerate every tracked path when executed in a local Git checkout, check all tracked Markdown links, and enforce the two-agent roster.

**Still required before declaring repository-wide PASS:** run `node tools/check.mjs` in a checkout of this branch; inspect failures and fix them; confirm Claude Code agent discovery and live Continuum tool access. No runtime or CI pass has been observed in this session.

## Research integrity
The old Recall architecture is frozen control evidence, not a treatment input. Neither old completeness scores nor the new agent's self-assessment may substitute for independent blinded comprehension and evolution tasks.
