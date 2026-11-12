# Architecture intent quality rubric

Score each applicable dimension 0–4 (0 wrong/absent, 1 weak, 2 mixed, 3 good, 4 excellent) with cited artifact evidence, then convert equal-weight mean to /10. Missing categories must be disclosed, not silently scored away. A material invariant contradiction blocks an excellent rating regardless of numerical average.

| Artifact | Dimensions |
|---|---|
| ADL | Intent-aligned boundaries/responsibilities; relationship accuracy; abstraction; clarity/economy; change-impact usefulness |
| BDL | Consequential behavioral fidelity; causal/state clarity; invariant preservation; ADL consistency; readability |
| Technology bindings | Faithful realization; mapping clarity; consequential tradeoffs; replaceability; avoidance of premature commitments |
| Decisions | Significance; rationale and alternatives; status/authority provenance; architecture linkage; future usefulness |
| Principles | Clarity; actionable guidance; fidelity to intent; consistency/nonredundancy; violation-detection value |

**Cross-artifact score (separate):** intent fidelity 30%, independent comprehension 25%, evolution reasoning 20%, coherence 15%, information economy 10%.

**Independent test:** with the same frozen vision and one anonymized architecture packet, ask the reviewer to (1) explain boundaries and responsibilities, (2) identify five consequential invariants with evidence, (3) trace suggestion/confirmation/conflicting evidence, (4) reason about replacing Gmail integration, and (5) identify contradictions, unjustified choices and unnecessary modeling. Compare to a vision-grounded answer key, not the other arm's design.

**Process measures (separate):** measured wall time, active effort if known, token use if known, material questions, avoidable questions, revisions, time to coherent model, tool failures and artifact size. Do not treat lines of code or artifact count as quality proxies.

**Gates:** meaningful Continuum validation evidence; no material core-invariant misunderstanding; authority provenance for consequential choices; compression pass; transparent unresolved assumptions.

**Interpretation:** A compact model that preserves independent comprehension and change reasoning at lower cost supports intent-focused authoring. A larger model may justify its cost if it yields measurably better understanding. One matched pair yields directional evidence, not statistical proof.
