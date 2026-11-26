# Continuum authoring: learning the architecture after development, and keeping it current

Part of the [continuum-authoring skill](../SKILL.md). Strategic direction: [Vision V5](https://github.com/avlon-technologies/continuum-architecture/blob/main/VISION-V5.md). Existing normative semantics and authority rules retain precedence.

This is the default way the Architect acquires and maintains architectural understanding:
- for a new product, after the Developer has built it;
- for existing software, at each meaningful change since the model's checkpoint.

Live observation during development (`observer-workflow.md`) is an optional mode. Observation, recovery and reconciliation are complementary ways of reaching the same understanding.

## 1. The default workflow

1. **Vision and constraints.** The product vision and its consequential architectural constraints are written down before development. Accepted intent is the yardstick, not your preference.
2. **The Developer builds autonomously.** Do not gate, interrupt or require check-ins. Encourage meaningful commits: one coherent step each, with a body that states what changed, why, and any consequential choice and the alternative it replaced. The history is your richest record of rationale.
3. **You learn the architecture** from the vision, the source structure, the implementation logic, the tests (run, not only read), the complete meaningful commit history, and any decision records. Synthesize why the structure is as it is, and which decisions and abandoned alternatives shaped it, across the meaningful commits; never merely translate the final source into semantic constructs. Use §2 for a first model, §3 for a change.
4. **You produce or reconcile the model** (§4).
5. **A fresh reviewer reviews it independently** (§5).
6. **You resolve consequential findings,** or disclose them explicitly as unresolved.
7. **You preserve the understanding** for the next change (§6).

## 2. A first model: understand, then consult, then author

**Pass 1: the final implementation, on its own.**
- Read the vision, the acceptance scenarios, and the source and tests at the target commit. Run the tests and scenarios.
- Apply the `recover-architecture` semantic-reconstruction checks and its adversarial pass.
- Read asynchronous seams, error paths and malformed-input paths with care. Where a promise depends on timing, malformed or hostile input, restart, or scale, write a small probe instead of trusting a reading.
- Write down:
  - the components and who owns which state
  - the seams and their contracts, including what happens to in-flight work on cancel, replace and kill
  - invariants and failure modes
  - the defects you established, with their evidence
  - the questions you could not settle
- Commit these notes before Pass 2. Conclusions reached before you read anyone else's are the check on inherited error.

**Pass 2: synthesize the history and the records.** Follow the `continuum` skill's `repository-history.md`. Read the meaningful commits in order, and any decision record or observation record. Work out:
- how the consequential boundaries, owners and promises emerged
- which decisions shaped them, with their alternatives
- which designs were abandoned, and why

For each claim you take from history or a record, do one of these:
- re-establish it in the final code (confirmed, refuted, or not reproduced), never copying a status;
- record a stated rationale with its source;
- label an inferred rationale as inferred.

Where history contradicts your Pass 1 notes, investigate until one is shown wrong, and record which.

**Pass 3: author** (§4).

## 3. Existing software: reconcile from the checkpoint

Your starting understanding is the existing model, its pinned implementation commit (the `evidence.json` anchor or the ledger's verified-against revision), the recorded decisions and the established constraints.
1. **Establish the comparison:** `continuum evidence check --anchored-at <commit>` lists every changed file and moved citation. `repository-history.md` covers ancestry, divergence and a missing pin.
2. **Examine the meaningful changes since the checkpoint,** in order. Follow changed paths into unchanged callers, consumers and tests: unchanged bytes are not unchanged meaning. Give every changed implementation file a disposition (read, diff, or not architectural and why).
3. **Decide the architectural implication** of each change. Did an owner, boundary, dependency, contract, invariant or promise change? Which identities continue? What must a future change preserve? If only implementation detail changed, record that and leave the model as it stands.
4. **Reconcile the model as a change** (`change-architecture`: an `.adl-change` against the compiled base, with `apply(A, Δ) = B` proved), never as a rewrite. Drift interpretation and governed adoption follow `reconcile-architecture`.

## 4. Authoring the model

- **Kinds in the construct, not only in prose:**
  - **Intended:** a `requirement`.
  - **Implemented:** `satisfies:` plus a citation.
  - **Verified:** a `test` that `verifies:`, naming its command and whether you ran it.
  - **Seams:** `service`, `api`/`operation` and `invokes:`.
  - **Inferred:** labelled in `desc`.
- **Contradicted:** a requirement the evidence contradicts keeps **no** `satisfies:` or `verifies:` edge, even where part of it works. Its `desc` says what does work.
- **A test verifies only what its steps observe.** A probe that demonstrates a failure verifies nothing.
- **Do not overclaim.** A claim added only so that a gate passes is a defect: disclose the conflict instead.
- **Constrain no more than the evidence and accepted intent require.** Leave reversible implementation choices to the Developer.
- **Prefer a partial, accurate model** to invented completeness.
- **Close out:**
  - the record covers every change to the target (`evidence check`: nothing touched);
  - each consequential vision item is traced to the model or to a gap;
  - cited verification is re-run from a clean checkout;
  - compile, and cite the verdicts.

## 5. Independent review and resolution

When the model will be relied on, have it reviewed by one fresh reviewer, on a different model where one is available.
- **Give the reviewer:** the code at the target, the vision, the model and records, and the test commands. Do not give it your conclusions about them.
- **It reports** numbered findings with severity and `file:line` evidence:
  - contradictions between the model and the code
  - unsupported or overstated assertions
  - significant omissions
- **It also assesses** whether the kinds are kept apart, and the model's depth.
- **It changes nothing.**
- **You resolve each finding** in the model, or reject it with evidence, or disclose it as unresolved. A high-severity finding is resolved in the model or disclosed together with an unmet requirement.
- **Never present the model as accepted** before this is done. Adoption into an authoritative model remains the human's act.

## 6. Preserve the understanding

Write the outcome where the next Architect starts:
- the handoff or intent record
- decisions with their alternatives
- open questions with an owner
- defects and their evidence
- known limits and coverage gaps

Then anchor the checkpoint at the target in a clean LF checkout. The next change starts from §3.

## What the evidence does and does not show

In the 2026 build-workflow experiments (continuum-architecture `plans/build-workflow-value/RESULTS.md`), recovery followed by independent review and resolution was the stage that most reliably established defects and produced the architecture record. Live observation helped where a challenge landed before delivery on a multi-commit build. Neither observation nor extra Developer self-review was shown to produce better software than this default. The evidence covers a few small products, and Developer and evaluator variability were large. It shows no workflow to be universally superior, and no workflow to be equivalent to another.
