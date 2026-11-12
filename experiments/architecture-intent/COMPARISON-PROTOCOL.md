# Control vs treatment — architecture-intent comparison

## Research question
Does an intent-focused orchestrator–authoring-agent dialogue produce architectural understanding and evolution reasoning comparable to or better than specification-completeness authoring, with less authoring cost?

## Arms
- **Control (C):** the original Recall architecture package created by the specification-completeness agents. Freeze the source commit and exact artifact paths BEFORE evaluation. Do not rerun or repair the control.
- **Treatment (T):** the fresh intent-focused two-agent experiment from VISION.md, writing under experiments/architecture-intent/runs/01/artifacts/. Freeze its final commit before evaluation.

## Fairness and isolation
- Both use the same frozen VISION.md baseline. Record its blob SHA and document any drift.
- Control uses only the architectural portions of the original package: ADL, BDL, bindings, decisions and principles. Supporting implementation/product/UX specifications may be noted separately but should not silently improve its architecture-only score.
- Treatment authoring must not read the control. A reviewer evaluates both packages in separate fresh contexts, without seeing process logs, arm names, goals, or the other package. Randomize or mask order if feasible; call them Package A and Package B.
- Use the exact same evaluator instructions, change scenario, rubric and evidence requirements. Avoid evaluators familiar with the original authoring conversation.
- Score missing artifact categories explicitly as missing/not applicable with rationale; do not infer that absence equals failure if the intent is appropriately captured elsewhere, but report required coverage gaps.
- Preserve original control artifacts unchanged. Never overwrite the historical package.

## Outcomes
**Primary:** independent architectural comprehension, intent fidelity, change-impact reasoning and cross-artifact coherence. Test for incorrect interpretations of important invariants.
**Secondary:** ADL, BDL, technology binding, decision and principle rubric scores; information economy; useful architectural coverage.
**Cost:** elapsed wall-clock time, active effort if measured, token usage if available, number of consequential clarifications, avoidable questions, revisions and tool friction. Mark missing measurements UNKNOWN rather than estimating them.
**Not the objective:** number of artifacts, test cases, LOC, application implementation readiness or compiler green status alone.

## Evaluation workflow
1. Freeze control commit and list precise source paths, versions and provenance. Record missing principles or other categories rather than manufacturing artifacts.
2. Freeze treatment outputs and record versions.
3. Produce separate anonymized architecture-only evaluation packets, each including the same vision and relevant artifact contents. Exclude authoring transcripts, self-assessments, readiness reports and the arm's stated optimization goal.
4. Run blind independent evaluations in separate contexts, using experiments/architecture-intent/EVALUATOR.md and experiments/architecture-intent/QUALITY-RUBRIC.md, with identical tasks and scoring.
5. Compare invariant comprehension, change-impact conclusions and material contradictions against an answer key derived from VISION.md and separately confirmed authority intent. Do not use one arm's architecture as the answer key for the other.
6. Compare scores with supporting evidence and confidence; normalize process cost only where observed and comparable.
7. Record a verdict, including whether intent-focused authoring is non-inferior on the primary outcomes and materially more efficient. Because there is one product and one run per arm, conclusions are directional, not statistically generalizable.

## Interpretation
- A smaller package with equivalent accurate understanding and evolution reasoning at lower cost supports the new approach.
- A larger package that yields demonstrably better understanding or safer evolution may justify its extra detail.
- If both score poorly, revise the authoring method rather than declare either a winner.
- If the treatment's quality is worse, do not hide it behind speed gains.
- Report architectural differences as choices, not defects, unless they contradict vision, authority, or internal consistency.

## Results template
| Dimension | Control | Treatment | Evidence / confidence |
|---|---|---|---|
| Intent fidelity | Pending | Pending | |
| Independent comprehension | Pending | Pending | |
| Evolution reasoning | Pending | Pending | |
| Cross-artifact coherence | Pending | Pending | |
| ADL quality | Pending | Pending | |
| BDL quality | Pending | Pending | |
| Binding quality | Pending | Pending | |
| Decision quality | Pending | Pending | |
| Principle quality | Pending | Pending | |
| Information economy | Pending | Pending | |
| Material invariant errors | Pending | Pending | |
| Elapsed effort | Pending | Pending | |
| Unnecessary questions | Pending | Pending | |

**No winner is declared until both packages are evaluated.**
