# Continuum authoring: package layout and lifecycle

Part of the `continuum-authoring` skill ([index](../SKILL.md)). Loaded when the work needs it.

## 4. Package layout and lifecycle

The package root is the target repository's `continuum/`, in the layout of `continuum://guides/development-package` §2 and `continuum://guides/package-formats`. If the repository already keeps a file elsewhere, use the existing location and say so; never create a duplicate.

```
continuum/
  development-package.json            development-ready mode only: kebab-case name, environment, controls, semantic.change
  GOAL.md                             the intent record when no adopted package exists (`intent-first.md` §5); ends with the authority line
  HANDOFF.md                          session outcome (`intent-first.md` §5); in development-ready mode, the `development-ready.md` §8 handoff
  model/
    <system>.adl, <system>.adl-manifest.json (exactly one)
    changes/<name>.adl-change         change mode
    changes/<name>.proposal.md        the proposal record of an unadopted change (below)
    <env>.adl-binding.json            one per Environment the model declares
    <vocab>.vocabulary-claims.json    one per vocabulary
    <system>.bdl                      one document, no manifest (not in the guides' layout)
    <system>.realization.json         only when needed (not in the guides' layout)
  evidence.json                       created by `continuum evidence init` (CLI); write `citations` only, never `status` or `anchored`
  acceptance/scenarios/<name>.scenario.json
  diagrams/README.md, diagrams/<nn>-<slug>.*   inventory and delivered files
  gaps/<yyyy-mm-dd>-<slug>.md         gaps that block implementation, need a human decision or outlive the session
  ledger.json, history/, transitions/, workflow.jsonl   lifecycle: read-only, except a transition you scaffolded, until approved (`development-ready.md` §8)
  IMPLEMENTATION.md, BEHAVIOUR.md, README.md, PACKAGE.json, model/*.adl.txt,
  model/compile-proof.json, acceptance/README.md, acceptance/traces/ ...   DERIVED by package build; never hand-edited
```

`acceptance/adapter.mjs` belongs to the implementation. Decisions live in the Continuum Host when there is a decision space (`authority-and-tools.md` §1). Without one, they live in the *Decisions* section of the intent record: `GOAL.md`, or the proposal record when an adopted package exists. Never write a `decisions/` directory; if the repository already keeps ADRs, say so and let the human choose whether to mirror a decision there. A gap file states the fact the model does not settle, its date, status (confirmed, needs-evidence, unknown, deferred, out-of-scope, or resolved with its disposition) and what it blocks, then *Evidence*, *Options* and *Recommendation*.

**Lifecycle.** Read `ledger.json` (or `continuum status`) before changing anything. If the ledger records an adopted change, its result is the current state. Moving authority is a lifecycle act (`authority-and-tools.md` §1, authority 3).

**Adopted package versus proposed change.** An **adopted package** exists when `continuum/ledger.json` has a `current` checkpoint. Its files are the authority: the files the current checkpoint records (`history/<NNNN>-<label>/`, or the file digests in `PACKAGE.json`), such as `development-package.json`, `GOAL.md`, the model, bindings, scenarios and DERIVED files, plus the lifecycle files. Any other file in the package root, apart from `model/changes/` and `transitions/`, is not authority; if it holds proposal content, report it as misplaced and offer to move it into the proposal record. Work that changes its architecture is a **proposed change** until the human adopts it through the existing lifecycle (`continuum://guides/development-workflow` §4.1 and §3.5). Then:
- **Never edit an adopted file to record a proposal**: not `GOAL.md`, not `HANDOFF.md`, not `development-package.json` (`semantic.change` included), not the model, bindings or scenarios in place. Editing them would make the package drift from its checkpoint and present proposed intent as authoritative.
- **The proposal lives beside it.** The architecture goes in `model/changes/<name>.adl-change`, pinned to the checkpoint's changeState and proven to apply (`authority-and-tools.md` §2). The **proposal record** `model/changes/<name>.proposal.md` is the intent record and session outcome for that change (`intent-first.md` §5), and opens by stating: proposed, not adopted; the adopted checkpoint (ledger sequence, changeState, attestation) still governs; its readiness claims still hold for that state and say nothing about the proposed one.
- **Nothing proposed goes to an adopted path.** In the proposal record, as text: proposed binding entries, scenario sketches, gaps (a *Gaps* section, not `gaps/` files), and any proposed `.bdl` change (recorded as a gap: no transition dimension carries BDL). Proposed-state diagram files go in `model/changes/<name>.diagrams/`, labelled proposed and listed in the record, never in the adopted `diagrams/`.
- **No in-place maintenance.** Never run a command that rewrites files under the adopted `continuum/`: `continuum package build`, `package bind refresh`, `package realize`, `package repair` (any `package` verb that writes), `evidence init` / `refresh` / `suggest --write` / `migrate`, or a mechanical refresh of pins or DERIVED files. Run what you need on a scratch copy outside the repository, and carry only proposal outputs into the proposal record or the transition. Drift the checks report in adopted files is reported to the human with the check's exact text, and the `reconcile-architecture` route offered; it is never repaired as part of a proposal. A subagent you brief on such a repository gets the same restrictions in its brief.
- **Adoption follows the human's decisions**, by the existing transition lifecycle: `continuum icp init` creates the transition from the change, `continuum icp ready` names each next step and its actor, approve and accept are human acts, and adopt follows them; you never run any of the three (`authority-and-tools.md` §1 authority 3). Intent-first authoring stops at the proven change and its proposal record; it creates no transition, and says the next steps are a development-ready request (or `icp init`), then the human's approval. *Observed 2026-11-13 (CLI 0.36.0, a disposable copy):* adopting an unrelated transition kept other pending `model/changes/` proposals, `gaps/` and an untracked `HANDOFF.md` unchanged, and placed the adopted transition's own change at `model/changes/<name>.adl-change`. It also replaced `model/*.adl` with emitted source, which drops hand-written comments; tell the human before they adopt.

With **no** adopted package (no ledger, or no `current` entry), `GOAL.md` is the intent record and the session outcome goes in `HANDOFF.md`; editing authored files there is ordinary authoring, and documented, semantics-preserving refreshes of pins and DERIVED files are allowed when inputs are stable (record the command and the before/after diff).

**Building.** `continuum package build` rewrites DERIVED files in place, always: the client CLI has no `--out` (that option belongs to the toolchain's own `tools/development-package.mjs`, which a client does not have). A change-mode spec (`semantic.change`) therefore writes state B's derived files over the package it sits in. So never on an adopted package (above): a change to an adopted package is built by its transition (`continuum icp materialize`, into the transition's own `result/`).
