# End-user progress reporting contract

## Goal
Make meaningful progress, decisions, risks and convergence visible without exposing every internal tool call or creating reporting overhead that prolongs the task.

## Reporting moments
1. **Start:** goal, roles, scope, baseline and what success will look like.
2. **First interpretation:** initial architecture hypothesis, important assumptions, next consequential questions.
3. **Decision milestone:** important choice settled, why it matters, and what remains undecided.
4. **Model milestone:** first coherent ADL/BDL/bindings; what understanding they preserve, what is deliberately omitted.
5. **Validation:** checks run, failures, semantic concerns and independent evaluation status. Distinguish tool validation from quality evaluation.
6. **Finish or stop:** outcome, links, artifact scores with evidence, unresolved issues, elapsed time and whether further work is justified.

## Cadence
Report at milestones and after prolonged work with no milestone (suggested 10–15 minutes if the runtime supports time tracking). Do not fabricate elapsed times or percentage completion. If blocked, report promptly and ask for the minimum necessary intervention. Prefer short updates; avoid repetitive status chatter.

## Standard update template
**Now:** current meaningful architectural objective.
**Established:** 1–3 consequential findings or decisions, with provenance.
**Next:** immediate next meaningful step.
**Risks/needs:** unresolved consequential questions or blockers (omit if none).
**Evidence:** changed artifact paths, validation results or commit references when available.

## Rules
- Progress must be based on observed work, not planned actions.
- Distinguish proposed, decided, captured, compiled and independently validated.
- Do not imply the end user approved a decision made by the simulated orchestrator.
- Do not claim a readiness percentage or score before the evaluation is run.
- If work is not converging, report that plainly, identify why, and recommend stopping or changing approach.
- Final report includes what was deliberately not modeled and why.
