# Continuum authoring: authoring each artifact

Part of the `continuum-authoring` skill ([index](../SKILL.md)). Loaded when the work needs it.

## 6. Authoring each artifact

Author only what the mode needs (`intent-first.md` §5 step 4; `development-ready.md` §8 for the full set). Read the knowledge in `authority-and-tools.md` §3 for each artifact before writing it.

| Input | ADL work | Key rule |
|---|---|---|
| goal, no model (**new**) | author from the smallest compiling start | ids from `continuum_mint_ids` |
| a model in `continuum/model/` (**existing**) | none, or gap-filling edits | preserve every id; current state = adopted result |
| model + requested change (**change**) | `model/changes/<name>.adl-change` pinned to the current changeState | prove apply → B (`authority-and-tools.md` §2); downstream artifacts target B; on an adopted package it stays a proposal (`package-and-lifecycle.md` §4) |
| code, no model (**recover**) | evidence-backed recovery, only as far as the decisions need (`intent-first.md` §5 step 1) | every element cited; unknown is a gap |

**ADL.**
- Frame before writing: system, domains, bounded contexts, services vs deployables, resources vs external systems, commands vs events, and the Environments the system runs in. A model of many operations and no events is a model of code, not architecture.
- Author on disk in small steps. Manifest: dotted `name` without hyphens and an exact `core` pin the compiler admits (a wrong pin's diagnostic lists them). Compile each step (`authority-and-tools.md` §2); fix the first error first.
- Check intent, not just legality: `continuum_query` for what you declared; `continuum_preview` for causality from each entry message and the model's silences; `continuum_principle_check` when there is a decision space; `continuum_applicable_guardrails` for a relationship you are unsure is permitted.
- Change mode: compute the current changeState yourself (a pin quoted in an older document may be stale), pin `base` to it, apply (`authority-and-tools.md` §2), confirm the result state B, and add the `result state` pin as `continuum://spec/change-source` shows. Never edit the base `.adl`.
- **Deriving a change by diff** (preferred for anything beyond a few operations; with the CLI): copy the manifest and its documents into a scratch directory outside the repository twice, as `A/` (untouched) and `B/`. Author the proposed state in `B/` (keep the edits in a script so a revision can be re-applied), mint new ids with `continuum_mint_ids`, and compile `B/` until it has 0 errors. Run `continuum diff A/<manifest> B/<manifest> --out <dir>` and read `verified true`. Copy the generated `.adl-change` to `continuum/model/changes/<name>.adl-change`, giving it a meaningful change name and replacing its generated `desc` with the intent and a pointer to the proposal record; its operations are mechanical, so authored intent and order live only in the record. Then prove it against the real files: `continuum apply` on the repository's manifest with that change and `--emit-source` into scratch, confirm `applied`, `valid`, the base equal to the current changeState and the state equal to B's, and compile the emitted source. For a revision, edit `B/`, re-diff and re-prove; never hand-edit the generated operations. Without the CLI, `continuum_diff` takes both states as payloads (not exercised live).
- Recover mode: cite the code behind every element as `path` or `path:start-end`. With the CLI, and never on an adopted package, `continuum evidence init continuum`, write `citations`, then `continuum evidence refresh continuum`. MCP only: attach citations to workspace edits and list them in the handoff.
- Model responsibilities, boundaries, interfaces, messages, workflows, data ownership, security and failure behaviour a developer would otherwise have to decide. No technology products (those are bindings). Declare only the Environments the system really has: every declared Environment must be bound before the package builds.

**BDL**, only when business rules, obligations, lifecycles or actors are the hard part; otherwise record "BDL not applicable" with the reason.
- One document, no manifest; author every id (BDL never mints) and keep it stable. Keep the business free of systems: no services, messages or databases.
- Only a named person's assertion makes something `stated` (`provenance { source domain-expert, assertedBy "<name or role>", assertedOn <date> }`); what you derive from documents or code is `assumed`, with its source. Never promote `assumed` to `stated` yourself. Open business questions go in `unspecified` blocks.
- Compile and inspect (`authority-and-tools.md` §2; `continuum_business_inspect` with `view: "worklist"`). Correspondence to ADL is never inferred from shared names; author a Realization only when needed (`continuum://bdl/spec/realization`).
- On an adopted package a `.bdl` change cannot travel in a transition: put the proposed text in the proposal record.

**Bindings and claims.**
- One Binding per owned Deployable, Resource, Service, Agent, Event and MessageChannel, per bound Environment (package-formats §2). Language, runtime and framework hang off the Deployable; persistence off the Resource; transport off each Event or channel; provider and model off each Agent. Never bind an ExternalSystem. `ref` (the id) is the truth; `hint` is a convenience; confirm every `ref` with `continuum_query`.
- Claims are the closed A.4.3 token set (`continuum://guides/adl-value-sets`); a claims file's `configuration` declares shapes (`"atom"`, `"list"`, `"map"`), not values. Secrets are locators, never values: `{ "secretLocator": "env://NAME" }`.
- Pin `base.canonicalModel` to the current attestation. With the CLI, `continuum package realize continuum --environment <Name>` writes a pinned skeleton (on an adopted package, run it on a scratch copy whose model is B, applied with `continuum apply … --emit-source`, and copy it into `transitions/<name>/bindings/`).
- Use what the repository already uses, citing evidence per technology (`path` or `path:start-end`). Where the project has not chosen, label the choice **proposed** and raise irreversible or high-cost choices (data store, hosting, identity, AI provider) as questions. A provider swap is a binding change that leaves the attestation untouched; say so when it lowers the stakes.
- Validate with the CLI on a scratch copy's build; MCP only, include them in the next diagram import (partial evidence, never a build).

**Acceptance scenarios.**
- Prove the important behaviours: the model's Requirements and Tests, the critical journeys, declared failure and exception paths, security guarantees, declared ordering. Prefer 5–15 sharp scenarios; in intent-first mode only the invariants worth verifying (`intent-first.md` §5 step 5).
- Shape: `acceptance-scenario: "1"`, kebab-case `name` equal to the file name, a one-sentence `purpose`, at least one `verifies`, `given` / `when` / `then` with at least one assertion; `test` where a declared Test applies, `environment`, `trace.from` for key flows, `provider` / `budget` for Agents (fake provider first; no real keys). Steps are reused dotted keys; data in `args`, wording in `text`.
- Assert declared behaviour only; an undeclared behaviour you need is a model gap, not a scenario. Prefer counterexamples that would fail under a plausible incorrect implementation.
- Confirm every reference with `continuum_query`. Coverage: the CLI build's report, or by hand (a Requirement is covered when some scenario verifies it; a Test when every target it declares appears in some scenario's `verifies`), labelled hand-computed. List new step keys for the implementer's `acceptance/adapter.mjs`.

**Research**, only when dated external evidence could change a consequential choice, never for syntax. State the decision, constraints and alternatives (including the simplest or do-nothing); prefer official sources, citing a direct URL and date for every material claim; separate fact, inference and unknown; recommend one option with its best counterargument. A bounded research task may go to a `general-purpose` subagent with that brief. Findings are evidence, not agreed intent.
