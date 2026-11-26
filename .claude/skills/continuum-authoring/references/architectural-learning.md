# Continuum authoring: architectural learning — Recover, Reconcile, Observe

Part of the [continuum-authoring skill](../SKILL.md). Strategic direction: [Vision V5](https://github.com/avlon-technologies/continuum-architecture/blob/main/VISION-V5.md). Existing normative semantics and authority rules retain precedence. This file is the authoritative description of the default development workflow, the roles in it, the architectural learning methodology and the evidence kinds (§4).

**One methodology, three modes.** They differ in starting knowledge and investigation scope, never in rigour:

| Mode | Starts from | Investigates | When |
|---|---|---|---|
| **Recover** (§2) | no model, or none you can rely on | the whole implementation at the target, then its history | after a new product is built; adopting existing software |
| **Reconcile** (§3) | the existing model, its decisions and its pinned implementation checkpoint | the meaningful changes since the checkpoint and everything they affect: source, tests, dependencies, callers | at each later change |
| **Observe** (optional, `observer-workflow.md`) | the checkpoint, during development | each batch of commits as it lands; intervenes on consequential issues | complex, prolonged or high-risk development |

All three read the implementation, its tests and its meaningful commits, re-establish every inherited claim in the code, keep the evidence kinds (§4) apart, and end in review (§5) and preservation (§6). An Observer's record is an input to recovery or reconciliation, never a substitute.

**Three things are called reconciliation.** *Architect reconciliation* is the mode above: it evolves the model's understanding from implementation evidence. *Guard drift reconciliation* (`reconcile-architecture`) is the governed disposition of an adopted package's drift evidence; the semantic draft it needs comes from Architect reconciliation. *Cross-repository reconciliation* combines several repositories' recoveries into one ecosystem model; it is a workspace practice, not a skill.

## 1. The default workflow and who does what

1. **Vision and constraints.** The product vision and its consequential architectural constraints are written down before development. Accepted intent is the yardstick, not your preference.
2. **The Developer builds autonomously:** code, tests, reversible engineering choices. It owns no Continuum artifact and waits for no one. Do not gate, interrupt or require check-ins.
3. **Meaningful commits.** Encourage them: one coherent step each, with a body that states what changed, why, and any consequential choice and the alternative it replaced. The history is your richest record of rationale.
4. **You, the Architect, learn the architecture** from the vision, the source structure and dependencies, component responsibilities and boundaries, the implementation logic, its invariants, limits and failure modes, the tests (run, not only read), the complete meaningful commit history, and any decision records. Ask the Developer only when something material cannot be settled from evidence. Synthesize why the structure is as it is, and which decisions and abandoned alternatives shaped it; never merely translate the final source into ADL or BDL. Recover (§2) for a first model, Reconcile (§3) for a change.
5. **You produce or reconcile the model** (§4).
6. **A fresh reviewer reviews it independently** (§5): accuracy, completeness, depth, contradictions, omissions and unsupported assertions.
7. **You resolve consequential findings,** or disclose them explicitly as unresolved.
8. **You preserve the understanding** for the next change (§6). Adoption into an authoritative model stays the human's.

## 2. Recover: understand, then consult, then author

**Pass 1: the final implementation, on its own.**
- Read the vision, the acceptance scenarios, and the source and tests at the target commit. Run the tests and scenarios.
- Apply the `recover-architecture` semantic-reconstruction checks and its adversarial pass.
- Read asynchronous seams, error paths and malformed-input paths with care. Where a promise depends on timing, malformed or hostile input, restart, or scale, write a small probe instead of trusting a reading.
- Write down the components and who owns which state; the seams and their contracts, including what happens to in-flight work on cancel, replace and kill; invariants and failure modes; the defects you established, with their evidence; the questions you could not settle.
- Record these notes before Pass 2: commit them where you have a branch to write to, otherwise keep them in your working record with the time. Conclusions reached before you read anyone else's are the check on inherited error.

**Pass 2: synthesize the history and the records.** Read the meaningful commits in order, and any decision or observation record, with the `continuum` skill's `repository-history.md` (how to read the commits and what to record for each finding). Work out how the consequential boundaries, owners and promises emerged; which decisions shaped them, with their alternatives; which designs were abandoned, and why. Where history contradicts your Pass 1 notes, investigate until one is shown wrong, and record which.

**Pass 3: author** (§4).

## 3. Reconcile: evolve the model from its checkpoint

Your starting understanding is the existing model, its pinned implementation commit (the `evidence.json` anchor, the ledger's verified-against revision, or the base recorded in §6), the recorded decisions and the established constraints. Do not rediscover the whole architecture; do read whatever source the change affects.
1. **Establish the comparison:** `continuum evidence check --anchored-at <target>` lists every file changed since the anchor and every citation whose code moved; `repository-history.md` covers ancestry, divergence and a missing pin.
2. **Examine the meaningful changes since the checkpoint,** in order: the commits and their diffs, the changed source, its tests, and changed dependencies. Follow changed paths into unchanged callers, consumers and tests: unchanged bytes are not unchanged meaning. Give every changed implementation file a disposition (read, diff, or not architectural and why).
3. **Decide the architectural implication** of each change. Did an owner, boundary, dependency, contract, invariant or promise change? Which identities continue? What must a future change preserve? If only implementation detail changed, record that and leave the model as it stands.
4. **Reconcile the model as a change** (`change-architecture`: an `.adl-change` against the compiled base, with `apply(A, Δ) = B` proved), never as a rewrite. On an adopted package, adoption goes through `reconcile-architecture`'s governed path.

## 4. Evidence kinds, and authoring the model

These six kinds are the one vocabulary for what the model asserts. Carry the kind in the construct, not only in prose:

| Kind | What establishes it | In the model |
|---|---|---|
| **Intended** | an accepted commitment: the vision, an accepted requirement, decision or ruling | a `requirement` (or the decision record) |
| **Implemented** | code you read at the target realizes it | `satisfies:` plus a `path:line` citation |
| **Observed** | you exercised the system at a named revision (a run, probe, journey or log) and saw it, but no test in the model repeats it | `desc` or the record, with the command and revision; no edge |
| **Verified** | a repeatable test or scenario, named by its command, that you ran and whose steps observe it | a `test` that `verifies:` |
| **Inferred** | reasoned from evidence, neither read directly nor run | labelled inferred in `desc`; never an edge on its own |
| **Contradicted** | evidence shows it does not hold as stated | the requirement keeps **no** `satisfies:` or `verifies:` edge, even where part of it works; `desc` says what does work |

- **A stated claim is not evidence.** A behaviour someone states (a commit body, a notice, a README, a label) is *declared*: a claim to check, not yet any of these kinds. A label or a document never establishes verification, and an `evidence.json` citation marked `verified` means its cited lines are unchanged, not that the behaviour was tested.
- *Proposed* (not adopted) and *unknown* are states of a claim, not evidence kinds. A *conflict* is an intended commitment the evidence contradicts.
- **A test verifies only what its steps observe.** A probe that demonstrates a failure verifies nothing.
- **Do not overclaim.** A claim added only so that a gate passes is a defect: disclose the conflict instead.
- **Constrain no more than the evidence and accepted intent require.** Leave reversible implementation choices to the Developer. **Prefer a partial, accurate model** to invented completeness.
- **Close out:** the record covers every change to the target (`evidence check`: nothing touched); each consequential vision item is traced to the model or to a gap; cited verification is re-run from a clean checkout; compile, and cite the verdicts.

## 5. Independent review and resolution

When the model will be relied on, have it reviewed by one fresh reviewer, on a different model where one is available. Launch it yourself as a fresh subagent, or, inside an orchestrated build, ask the calling session to launch it.
- **Give the reviewer:** the code at the target, the vision, the model and records, and the test commands. Do not give it your conclusions about them.
- **It reports** numbered findings with severity and `file:line` evidence: contradictions between the model and the code, unsupported or overstated assertions, significant omissions. **It also assesses** whether the kinds are kept apart, and the model's depth. **It changes nothing.**
- **You resolve each finding** in the model, or reject it with evidence, or disclose it as unresolved. A high-severity finding is resolved in the model or disclosed together with an unmet requirement.
- **Never present the model as accepted** before this is done.

## 6. Preserve the understanding, and the checkpoint

Write the outcome where the next Architect starts: the handoff or intent record; decisions with their alternatives; open questions with an owner; defects and their evidence; known limits and coverage gaps.

**The checkpoint** is the `evidence.json` anchor, set by `continuum evidence refresh` in a clean LF checkout of the examined revision. Refresh records the anchor only once the map holds at least one citation. At a new product's kickoff nothing is implemented yet, so the honest initial state is a **recorded base**: name the kickoff commit as the base in the handoff or run record, and anchor when the model first carries implementation citations, normally at the recovery target. A kickoff element may be cited to the scenario that states it, as evidence of intent; never add a citation only so that an anchor can be recorded. The next change reconciles from the anchor (§3).

## What the evidence does and does not show

In the 2026 build-workflow experiments (continuum-architecture `plans/build-workflow-value/RESULTS.md`), recovery followed by independent review and resolution established defects and produced the architecture record in every run; the results may not generalise beyond those products. Live observation helped where a challenge landed before delivery on a multi-commit build. Neither observation nor extra Developer self-review was shown to produce better software than this default. The evidence covers a few small products. Its disclosed limitations include large Developer and evaluator variability, unequal self-review budgets, a freeze-rule interpretation, and tooling versions that changed during one run (see that file). It shows no workflow to be universally superior, and no workflow to be equivalent to another. Reconciliation across successive changes to existing software was not measured.
