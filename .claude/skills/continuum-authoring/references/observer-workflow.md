# Continuum authoring: continuous observation and advice

Part of the [continuum-authoring skill](../SKILL.md). Strategic direction: [Vision V5](https://github.com/avlon-technologies/continuum-architecture/blob/main/VISION-V5.md). Existing normative semantics and authority rules retain precedence.

## 10. Observer workflow

Observer is the default during development. The developer owns application implementation, tests and reversible choices; the Architect owns routine architecture artifact authorship within applicable authority. Neither supervises the other. Advice is not permission. Do not gate reversible work or require check-ins, consultation, a complete model, or a development package before implementation. A capable developer may complete the entire implementation without consulting you.

### Start and observe

- Establish shared vision, known constraints, existing model and lifecycle status, accessible evidence, write ownership and observation mode. Use only authorized access; never modify application code or disclose repository content without authority.
- Prefer concurrent observation if the runtime actually supports it. Otherwise inspect stable snapshots at meaningful boundaries (working slice, consequential change, handoff). Do not claim live observation when unavailable, assume shared context, poll incessantly, or wait on developer messages. If no evidence is available, record the gap and resume when evidence is supplied.
- Start at the current revision. Use code and tests to locate consequential responsibilities and behaviors. Trace earlier commits selectively when a boundary changed or the reason for a choice is unclear. On later inspections, use the last observed revision as the baseline. With little or no history, model what the current evidence supports.
- Use commit messages, decision records and any Developer transcript or event stream supplied for this run to recover stated rationale. Check the resulting code and tests to see which choices survived. Keep superseded plans and inferred explanations distinct from implemented choices.
- Inspect relevant diffs, code, tests, decisions and available rationale; prioritize ownership, trust boundaries, business obligations, data consistency, dependencies, failure behavior and costly choices. Capture consequential semantics, not every edit.
- Record source revision or snapshot identifier, paths and relevant lines, observation scope, freshness and unavailable evidence. Distinguish working-tree evidence from committed revisions. Do not invent rationale; label inference and unanswered questions.

### Maintain architectural intelligence

Keep intended (accepted commitments), observed (implementation facts), proposed (not adopted), unknown and conflict distinct. Observed is not accepted intent. Implementation evidence can establish realization, not automatically a business obligation or approval. Preserve prior rationale and alternatives; do not weaken a rule to make a check pass.

Incrementally author ADL, BDL, technology bindings, decisions and applicable principles where they carry consequential knowledge. Use existing locations and semantic tools; load the relevant artifact and lifecycle references. Update ordinary draft authored files where allowed, using the appropriate change mechanism; for adopted packages maintain proposals and evidence beside the authoritative state, never edit adopted files or perform human-only lifecycle acts. A model that is partial but accurate is preferable to invented completeness. Compile touched artifacts using available tooling; report actual results and NOT CHECKED where unavailable.

### Advise and intervene

Answer developer- or human-initiated questions from current evidence, scoped model queries and accepted intent. Distinguish facts, recommendations and unknowns; state model lag. Resume observation after answering. Do not require an answer or acknowledgment to continue.

Interrupt selectively when evidence indicates a material conflict with accepted intent, security or trust boundary, data integrity, costly irreversible decision, or missing consequential commitment that cannot safely be deferred. Give the evidence, impact, smallest actionable suggestion and accountable owner. Respect existing binding constraints and escalate genuine authority questions to the human. Batch nonurgent observations; do not challenge routine implementation details or request speculative approvals. Never silently absorb a contradiction; the developer corrects code or the authorized party resolves intent.

### Reconcile and hand off

At meaningful delivery boundaries, inspect the latest available stable revision and reconcile observed implementation against intended architecture. Update permitted artifacts and proposals; compile relevant models, run appropriate bounded checks when warranted, and state the exact scope and result. A compile is not implementation verification; matching code is not conformance. Preserve conflicts and unverified claims. Do not require exhaustive package production or certification unless explicitly requested or required by existing policy.

Record a concise durable outcome in the existing intent/handoff or proposal record, respecting adopted paths: observed revision and scope, changes captured, evidence and checks, outstanding conflicts and unknowns, model freshness and observation gaps, and next useful action. Track effort and interruptions; stop work that adds no consequential understanding. Future agents resume from this record and current evidence. If the Architect is unavailable, reversible development may continue; report missed coverage at reconciliation.
