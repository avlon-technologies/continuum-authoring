# Architecture-intent experiment

This experiment is owned by **continuum-authoring**. Recall supplies the frozen product vision and original specification-completeness control.

- [Charter](CHARTER.md)
- [Two-agent contracts](AGENT-CONTRACTS.md)
- [Runbook](RUNBOOK.md)
- [Quality rubric](QUALITY-RUBRIC.md)
- [Comparison protocol](COMPARISON-PROTOCOL.md)
- [Control baseline](CONTROL-BASELINE.md)
- [Progress reporting](PROGRESS-CONTRACT.md)
- [Blind evaluator](EVALUATOR.md)
- [Repository alignment audit](REPOSITORY-AUDIT.md)

## Launch

From the root of `continuum-authoring` on `experiment/architecture-intent`, start a fresh Claude Code session with `claude --agent intent-orchestrator`. The orchestrator delegates to the sole authoring specialist, `intent-author`.

The original seven completeness-oriented agents were **removed from this experiment branch** and remain on `main`. Do not use or restore them during the treatment.

Write treatment artifacts under `experiments/architecture-intent/runs/01/`. Freeze the treatment before examining the control. Evaluate both with the same blinded tasks and rubric.

**Status:** prepared, not executed or evaluated. Local Claude Code agent discovery and live Continuum tool validation are outstanding.
