# Continuum Authoring — Architecture Intent Experiment

**This is the experimental branch, not the completeness-oriented authoring release.** The original framework and seven-agent team remain on `main`.

## Purpose
Test whether two independent participants can establish and preserve shared architectural understanding through focused conversation and concise Continuum artifacts, rather than generate an exhaustive development-ready specification.

- **Orchestrator:** the main Claude Code session, acting as *simulated* human product and architecture authority for this experiment.
- **Authoring specialist:** the only project subagent, `continuum-intent-author`, defined in `.claude/agents/continuum-intent-author.md`.

The original completeness-oriented agents have been removed from this branch to prevent accidental invocation. Do not import them from `main` or use the old readiness-oriented agent protocol as instructions.

## Start
1. Check out `experiment/architecture-intent` in `continuum-authoring`.
2. Start a fresh Claude Code session at this repository root. Confirm `continuum-intent-author` appears in `/agents`.
3. Read [experiment/README.md](experiment/README.md), [experiment/RUNBOOK.md](experiment/RUNBOOK.md) and [experiment/QUALITY-RUBRIC.md](experiment/QUALITY-RUBRIC.md).
4. Use the frozen `avlon-technologies/ai-recall` VISION.md as the treatment's only product input. Do not inspect its historical architecture.
5. Run the orchestrator ↔ specialist conversation, author the new model under `experiment/runs/01/`, and compare against the frozen control using identical blind review tasks.

## What to optimize
Intent fidelity; independent human/AI comprehension; consequential architectural structure and behavior; cross-artifact coherence; change-impact reasoning; information economy; reasonable authoring effort.

## Outputs
Focused ADL, BDL, technology bindings, consequential decisions and principles, useful diagrams, decision provenance, progress reports, independent quality scores and a comparison verdict. No application implementation or exhaustive specification quota.

## Boundaries
This branch does not replace the original project vision on `main`. The old `.claude/skills/continuum-authoring/` and maintenance tooling may still exist as historical infrastructure; **do not treat their development-readiness goals or old agent routing as treatment instructions**. Consult current Continuum MCP tool/schema documentation for syntax. Legacy maintenance checks designed to require seven agents are not applicable to this experiment until adapted.

**Status:** prepared; local agent discovery, Continuum access and the experiment run have not been verified.
