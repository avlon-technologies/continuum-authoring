# Architecture-intent experiment

This experiment is owned by **continuum-authoring**, not ai-recall.

- [Runbook](RUNBOOK.md)
- [Charter](CHARTER.md)
- [Agent contracts](AGENT-CONTRACTS.md)
- [Quality rubric](QUALITY-RUBRIC.md)
- [Comparison protocol](COMPARISON-PROTOCOL.md)
- [Control baseline](CONTROL-BASELINE.md)
- [Progress reporting](PROGRESS-CONTRACT.md)
- [Blind evaluator](EVALUATOR.md)

Use `claude --agent intent-orchestrator` from the root of this repository after switching to `experiment/architecture-intent`. The orchestrator delegates to `intent-author`. The existing `continuum-architect` and other development-readiness agents remain unchanged on this branch. The ai-recall repository supplies the original frozen control and product vision.

**Status:** prepared, not executed or evaluated.
