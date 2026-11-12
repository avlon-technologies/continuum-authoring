# Architecture Intent Experiment

## Hypothesis
Continuum can help humans and AI establish, communicate, preserve, and evolve a shared understanding of architectural intent without exhaustive implementation specifications. A working application alone is not sufficient evidence of this value.

## Starting point
Use VISION.md as the primary product input. Do not use the prior continuum/ artifacts, docs/product, docs/ux, or the previous package as an architecture baseline. They are historical evidence from the first experiment, not requirements for this one.

## Comparison
This experiment is the intent-focused **treatment**. Compare it with the original frozen specification-completeness **control** using [the matched comparison protocol](experiments/architecture-intent/COMPARISON-PROTOCOL.md) and [control baseline](experiments/architecture-intent/CONTROL-BASELINE.md). Evaluate both against the same rubric, not against artifact size or development-readiness alone.

## Experiment operating contracts
- [Agent contracts](experiments/architecture-intent/AGENT-CONTRACTS.md) define the two roles, boundaries, workflows, tools, outputs and stop conditions.
- [Quality rubric](experiments/architecture-intent/QUALITY-RUBRIC.md) defines artifact-specific and cross-artifact measures and independent evaluation.
- [Progress contract](experiments/architecture-intent/PROGRESS-CONTRACT.md) defines user-facing reporting milestones, cadence and evidence requirements.

## Participants and authority
- **Orchestrator (authority):** Acts as the human product/architecture owner for this experiment. Interprets VISION.md, makes consequential product and architecture choices, delegates routine choices, and explicitly confirms contested intent. Optimize for a coherent architecture aligned to product outcomes, not artifact count.
- **Continuum authoring agent (specialist):** Proposes and challenges architecture, discovers consequential ambiguity through focused dialogue, and captures shared understanding in ADL, BDL, decisions, principles, and technology bindings. Optimize for fidelity, interpretability, economy, and future evolution, not implementation-specification completeness.
- The authoring agent does not silently turn recommendations into authoritative decisions. The orchestrator may delegate classes of decisions; their provenance must remain clear.
- The orchestrator and authoring agent must be separate participants. Do not allow the authoring agent to simulate approval from the authority.

## Collaboration protocol
1. Orchestrator provides the vision, objectives, constraints, and any delegated authority.
2. Authoring agent proposes an initial architectural interpretation and the few consequential uncertainties or tradeoffs.
3. Orchestrator confirms, corrects, chooses, or delegates; the authoring agent challenges inconsistencies and captures the resulting intent incrementally.
4. Capture structure in ADL, important behavior in BDL, realization choices in technology bindings, durable rationales in decisions, and cross-cutting governing rules in principles.
5. Authoring agent summarizes what it believes is settled, inferred, or unresolved; orchestrator validates the consequential interpretation, not every modeled detail.
6. Stop when both participants agree that the artifacts convey the architecture meaningfully and additional discussion/modeling offers little benefit.

## Agent mission
Discover and express the minimum sufficient architectural intent needed for independent humans and AI to understand the system's consequential structure, behavior, constraints, tradeoffs, and evolution boundaries.

## Optimization priorities (in order)
1. Intent fidelity: capture the intended architecture without inventing requirements.
2. Shared understanding: make independent interpretations converge on the same architectural meaning.
3. Architectural significance: model only boundaries, responsibilities, relationships, behaviors, and invariants that matter.
4. Clarity and economy: maximize meaningful architectural information per modeled element.
5. Evolvability: make future changes and their impact intelligible.
6. Authoring efficiency: minimize elapsed time, unnecessary questions, and redundant review.

## Operating rules
- A focused conversation between the two agents is the experiment mechanism. Do not force questions when the vision or delegated authority already settles the point; ask only when ambiguity could materially change architectural intent.
- Make reasonable choices when delegated; distinguish human-declared intent from agent-inferred assumptions and choices.
- Capture ADL, BDL, and technology bindings at an appropriate level of abstraction. These are means, not quotas.
- Record decisions only when their rationale matters for future interpretation or change.
- Do not derive exhaustive APIs, screen copy, database schemas, test matrices, or implementation plans unless essential to expressing architectural intent.
- Avoid mechanically copying the vision into each artifact.
- Prefer coherent, simple architecture; justify each modeled element by what understanding it preserves.
- Surface contradictions and significant unknowns, not every conceivable edge case.
- Stop when additional modeling no longer materially improves shared architectural understanding.
- Never claim that compilation or package checks prove intent fidelity or implementation quality.

## Deliverables
1. Concise architecture overview explaining the system in plain language.
2. Focused ADL, BDL, and technology bindings.
3. A small set of consequential decisions, principles, assumptions, and open questions.
4. Architecture diagrams that faithfully communicate the model.
5. Short reflection: what was captured, what was deliberately left to implementation, elapsed effort, and unresolved risks.

## Evaluation
Include the conversation cost and the number of consequential clarifications, accepted recommendations, and unnecessary questions. The independent evaluator must not receive the dialogue transcript.

Give the artifacts to an independent agent without the authoring transcript. Ask it to explain the architecture, identify the most important invariants, propose a meaningful change and its impact, and explain architectural tradeoffs. Compare its interpretation with the original vision and the author's intent. Judge fidelity, comprehension, change reasoning, information density, and time spent. Implementation quality is a secondary signal, not the primary score.

## Stop condition
The experiment succeeds when the model reliably conveys consequential architectural intent and supports sound evolution reasoning at a proportionate authoring cost. Do not extend work merely to maximize artifact completeness or achieve a cosmetic readiness score.
