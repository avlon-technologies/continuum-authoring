# Continuum Authoring — Architecture Intent Experiment

This **experimental branch** tests Continuum as a way for humans and AI to discover, describe, preserve and evolve a **shared architectural understanding**. It deliberately does **not** optimize for exhaustive development-ready specifications.

The original seven-agent, specification-completeness authoring framework remains on `main` and supplies the historical control.

## Two agents, distinct goals

| Agent | Role | Optimizes for |
|---|---|---|
| [`intent-orchestrator`](.claude/agents/intent-orchestrator.md) | Main Claude Code agent, simulating the human architecture authority | Product outcomes, consequential choices, intent clarity, prompt decisions |
| [`intent-author`](.claude/agents/intent-author.md) | Specialist that converses with the orchestrator and authors Continuum artifacts | Intent fidelity, semantic consistency, useful abstraction, interpretability, evolution reasoning and economy |

The specialist recommends and challenges; the orchestrator decides or delegates. Both must distinguish approved choices from inferred assumptions.

## Run

```powershell
cd C:\projects\avlon\continuum-authoring
git fetch origin
git switch experiment/architecture-intent
claude --agent intent-orchestrator
```

Verify both project agents are discoverable. Read [the experiment runbook](experiments/architecture-intent/RUNBOOK.md) before starting. The [shared skill](.claude/skills/continuum-authoring/SKILL.md) defines the authoring protocol; the live Continuum MCP documentation is authoritative for tool syntax.

## What gets measured

ADL, BDL, technology bindings, decisions and principles have distinct quality criteria. Independent reviewers test architectural comprehension, invariant preservation and change-impact reasoning. We compare those results and observed authoring effort against the **frozen original Recall package** using [one matched protocol](experiments/architecture-intent/COMPARISON-PROTOCOL.md). No winner is declared before both are evaluated.

## Files

- [Experiment overview](experiments/architecture-intent/README.md)
- [Charter](experiments/architecture-intent/CHARTER.md)
- [Agent contracts](experiments/architecture-intent/AGENT-CONTRACTS.md)
- [Quality rubric](experiments/architecture-intent/QUALITY-RUBRIC.md)
- [Progress contract](experiments/architecture-intent/PROGRESS-CONTRACT.md)
- [Evaluator](experiments/architecture-intent/EVALUATOR.md)
- [Runbook](experiments/architecture-intent/RUNBOOK.md)
- [Live validation](tools/LIVE-CHECKS.md)

**Status:** repository preparation only. No authoring run, local Claude Code smoke test or blind evaluation has been completed.
