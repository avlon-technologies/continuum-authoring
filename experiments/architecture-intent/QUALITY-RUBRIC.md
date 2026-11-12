# Architecture intent quality rubric (experiment v1)

## Scoring protocol
Score each applicable dimension 0–4 with concrete evidence: 0 absent/wrong, 1 weak, 2 mixed, 3 good, 4 excellent. Convert to /10 by multiplying the weighted mean by 2.5. Report confidence, evidence locations, and material defects. Do not equate a successful compiler check with correctness. No artifact receives a 9+ if it contains a material contradiction or cannot be interpreted independently.

## Artifact dimensions (equal weights within each artifact)
- **ADL:** fidelity to intended boundaries and responsibilities; meaningful relationships; architectural significance/appropriate abstraction; structural clarity and economy; support for change-impact reasoning.
- **BDL:** fidelity to consequential behavior; state transitions and causality; invariant/trust boundary preservation; consistency with ADL; understandable scenarios without implementation trivia.
- **Technology bindings:** credible realization of the semantic model; unambiguous ownership and technology mapping; consequential constraints/tradeoffs; portability/replaceability clarity; no unnecessary premature commitment.
- **Decisions:** consequential relevance; rationale and rejected alternatives; clear decision/status/authority provenance; linkage to affected architecture; usefulness when revisiting the choice.
- **Principles:** concise and unambiguous; actionable in tradeoffs; traceable to intent; nonredundant and consistent; able to identify a proposed violation.

## Cross-artifact score (separate; do not hide inside averages)
- **Intent fidelity (30%):** does the complete set represent what the authority intended, not just the vision's words?
- **Independent comprehension (25%):** can a fresh agent explain boundaries, responsibilities, important behaviors and reasons accurately?
- **Evolution reasoning (20%):** can it predict impact and preserve invariants for an unseen change?
- **Coherence (15%):** do ADL, BDL, bindings, decisions and principles agree?
- **Information economy (10%):** does each element earn its place, without loss of significant intent?

## Independent test
Give a reviewer the vision and resulting artifacts, not the conversation. Ask it to (1) explain the system in plain language; (2) name five consequential invariants and their model evidence; (3) trace a candidate through confirmation and later conflicting evidence; (4) propose a Gmail-provider replacement and identify impacts; (5) identify unsupported assumptions and unnecessary model elements. Compare answers with the orchestrator's separately recorded intended answers. Count materially wrong interpretations and unsupported claims, not merely writing quality.

## Process metrics (reported separately, not gamed)
Elapsed time; active agent time if measurable; number of consequential questions; avoidable questions; unresolved material ambiguities; artifact size; number of substantive revisions; tool failures; time to first coherent model; time since last meaningful architectural improvement. Size and speed are diagnostic, not automatic quality penalties.

## Decision gates
- **Integrity gate:** compilation and validation pass; material warnings are explained or resolved.
- **Understanding gate:** no material independent misinterpretation of a core invariant or boundary.
- **Authority gate:** consequential inferred choices are confirmed or explicitly delegated; unresolved issues are labeled.
- **Economy gate:** a compression pass removes elements with no demonstrable contribution to understanding or evolution.
- Report partial results and uncertainty; never manufacture precision from subjective ratings.
