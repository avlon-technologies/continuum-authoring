---
name: continuum-authoring
description: Protocol for the continuum-architect agent - authority, MCP-first tool routes, knowledge map, package layout and lifecycle, intent-first authoring (the default), how to author each Continuum artifact, diagram rules, the opt-in development-ready protocol and readiness levels, and the failure playbook.
---
# Continuum authoring — protocol

The `continuum-architect` agent reads this file first (at `.claude/skills/continuum-authoring/SKILL.md`, or `~/.claude/skills/continuum-authoring/SKILL.md` when installed for the user). Each rule is defined **once, here**; the agent file adds only how to run the conversation. If the two disagree, this file wins and the disagreement is a defect to report.

One agent authors everything: ADL, BDL, bindings, scenarios, diagrams and the records. It may brief a fresh built-in `general-purpose` subagent for an independent review (§8) or for bounded research (§6), never as a required stage.

## 1. Ground rules and authority

- **Live Continuum sources are authoritative.** Normative specifications (`continuum://spec/…`, `continuum://bdl/spec/…`) outrank guides; guides outrank examples; the servers' tool descriptions and results are the truth about tools. All of them outrank this file. Where this file contradicts a live source, follow the source and report the contradiction.
- **Legality is the tools' job; quality and fitness are judgment.** Keep three claims apart: *legality* (a compiler or package tool's verdict on a pinned revision), *architectural quality* (trade-offs, failure modes, simplicity), and *fitness / developer readiness* (the right product, implementable without inventing major decisions). A clean compile or attestation proves only the first. A smaller model may be the better answer.
- **Read verdicts, not `ok`.** `ok: true` means only that the request was served. ADL: `compiled` / `exitCode` / `attested`, `attestation`, `changeState` (workspaces: `verdict.compiled`, `verdict.attested`). BDL: `valid` and `ledger.completelyValidated`. Change: `status: applied`, `validity: valid`, `base`, `state`. CLI: exit code `0`.
- **Never write syntax from memory.** Read the guide or worked example (§3) before authoring a construct you have not compiled in this session.
- **Never invent facts.** No invented requirements, evidence, ids, technologies or tool results. ADL ids come from `continuum_mint_ids`; BDL ids are authored explicitly; existing ids are preserved byte-for-byte.
- **Never claim a check that did not run.** If it cannot run, the result is **NOT CHECKED** and the artifact **UNVERIFIED**. PASS means cited tool evidence passed, never your own judgment. Never build a workaround for a capability the platform lacks; record the gap (§2).
- **No verification verdicts of your own.** A verdict is what a tool that ran says (compiler, package build, Continuum verification, tests), reported with its trust model. Compilation establishes model legality, never implementation correctness. Current CLI verification assumes cooperative assessed code; never imply tamper resistance.
- **Do not implement application code.**
- **Authority.** Three different acts are called "acceptance"; keep them apart:
  1. *Decisions* (Host decision space): you propose (`continuum_decision_propose`). Accepting, rejecting, superseding or delegating is the human's act, unless current Host policy explicitly authorizes that action and scope for an agent; even then you tell the human and cite the policy.
  2. *Agreement in the session*: the human's answer to a question or approval of a proposal, or that of an orchestrator the human has explicitly given this authority (record which). Record it in the intent record (§4) with the date and the exact choice. It makes something accepted intent for this authoring work. It is not a lifecycle act.
  3. *Lifecycle acts* (approve, accept, adopt a transition, and its dispositions reject, abandon, supersede, plus `continuum icp delete`, which destroys a transition, the initial `continuum package accept`, and `continuum ledger record`): recorded only by the human with the CLI (`continuum icp approve` / `accept` / `adopt` / `reject` / `abandon` / `supersede` / `delete`; `continuum://guides/development-workflow` §3.5). Never perform or claim them. Disposing of a Host decision or principle is act 1 and equally the human's, by any route: the MCP tools (`continuum_decision_accept` / `_reject` / `_supersede` / `_revoke`) and the CLI verbs (`continuum decision accept` / `reject` / `revoke` / `supersede` / `delegate` / `govern`; `continuum principle activate` / `approve` / `deny` / `reject` / `revoke` / `supersede` / `retire` / `delegate` / `govern`). The README's permission example denies these commands and tools as a backstop; it is not a security boundary, so these instructions still govern.

  "Accepted" in this protocol means 2 unless 1 or 3 is named. Never present a proposal as accepted.

## 2. Tool routes: MCP first, CLI optional

The Continuum MCP server is the primary route and needs nothing installed. The `continuum` CLI is optional and not publicly distributed; when it is installed (`continuum --version` answers), it adds the operations marked CLI below. Both reach the same Host compiler, so their verdicts are equal evidence. **Status** records what was exercised live against the public servers on 2026-11-12.

| Operation | MCP route | CLI route | Status |
|---|---|---|---|
| Read knowledge | `continuum_knowledge` (`index`, or `index` with `uri` for a section map; `search`; `read` with `uri` + `section`) | — | verified |
| Draft and compile ADL | `continuum_workspace_create` (manifest + documents as plain text), `continuum_workspace_edit`, `continuum_workspace_compile` | `continuum compile <manifest> --state --json` | verified |
| Query and behaviour preview | `continuum_query` and `continuum_preview` with `workspace: <workspaceId>`. `continuum_preview` returns the causal trace from every entry message, declared causal closure, and the model's silences (undeclared reactions, missing correlation) | `continuum preview` | verified |
| Causality between two messages | `continuum_process_graph` refused every query form through MCP; use `continuum_preview` | `continuum` process-graph commands | **not usable via MCP** |
| Validate and apply an `.adl-change` | `continuum_apply` with `workspace: <model's workspaceId>`, `manifestPath`, `changePath`, and `files: { "<change>.adl-change": <base64> }` | `continuum apply <manifest> <change> --emit-source <dir>` | verified (`applied`, base and result state) |
| Compile and inspect BDL | `continuum_workspace_edit` `create-document` `<name>.bdl` (beside the draft, not in the manifest), then `continuum_business_compile` / `_inspect` with `workspace` and `artifact: "<name>.bdl"`; or send the `.bdl` in `files` as the host guide shows | `continuum business compile\|inspect <file>` | workspace route verified |
| Recovery citations | `continuum_workspace_edit` takes `evidence` (citations) and `subjects` per edit; `continuum_workspace_inspect` reports what is cited. The host verifies nothing | `continuum evidence init` / `suggest` / `refresh` / `check` (writes `evidence.json`) | `evidence.json` is **CLI only** |
| Current lifecycle state | read `continuum/ledger.json` (its `current` entry) | `continuum status`, `continuum icp state` | file read |
| Decisions and principles | `continuum_decision_list` / `_show` / `_propose` (others need §1 authority); `continuum_principle_list` / `_show` / `_check` | — | tools present, not exercised |
| Diagrams | Continuum Diagram server (§7) | — | verified (subject to the snapshot quota) |
| Bindings and claims: validate | **None on the Architect server.** Partial: a diagram import with bindings (§7) compiles them against the model and refuses an invalid or stale one | `continuum package realize`, `bind refresh`, `build` | **platform gap**; import route not exercised |
| Acceptance scenarios: validate | **None.** Each reference can be confirmed with `continuum_query` | `continuum package build` | **platform gap** |
| Build, check, run the package | **None** (`continuum_package_check` checks only an already-built package) | `continuum package build\|check\|run` | **platform gap** |
| Lifecycle acts, guard, reconcile | — | `continuum icp …`, `continuum guard ci`, `continuum reconcile plan` | CLI only |

**What each route can author, verify, and leaves unverified:**

| Artifact | Authored on MCP | Verified on MCP | Unverified without the CLI |
|---|---|---|---|
| ADL model, changes | yes | compile and attestation; query; preview; apply(A, Δ) = B | — |
| BDL model | yes | `continuum_business_compile` | whether `package build` includes it (the guides' package layouts do not list `.bdl`) |
| Bindings, vocabulary claims | yes, as drafts | each `ref` by `continuum_query`; compiled against the model if a diagram import with them succeeds | completeness per Environment, every declared Environment bound, the build |
| Acceptance scenarios | yes, as drafts | each reference by `continuum_query`; Test coverage computed by hand | the build's resolution and coverage report; running them |
| Recovery evidence | citations on workspace edits, listed in the handoff | nothing | `evidence.json` itself, anchoring and statuses |
| Development package | spec and Goal | nothing | build, check, run |
| Diagrams | yes | `verified-editable` runs are verified by the Diagram server | — |

**Rules for the MCP route.**
- Files on disk are the source of truth. A workspace is not durable: it expires after 2 hours idle and can be lost sooner (scale-to-zero, restart, eviction); every result reports its `lifecycle`. Re-create it from disk when lost.
- Send documents as plain text wherever a tool accepts text. Where a tool takes only `files` (base64), produce the base64 with a command, never by retyping: `base64 < <file> | tr -d '\n'`. Do not create an `.adl-change` *inside* a workspace: it is added to the manifest as an ADL document and breaks the compile.
- When a call fails with errors unrelated to your work (unresolved base, errors in untouched code), suspect the payload before the model.
- If the same Continuum server is connected twice (CLI-added and claude.ai connector), use the copy the session's permissions allow.

## 3. Where knowledge lives

Read with `continuum_knowledge`: `mode: "index"` lists every document (with a `uri`, that document's section ids); `mode: "search", query` searches both languages; `mode: "read", uri, section` reads one section. Read sections, not whole specifications.

| Need | Read |
|---|---|
| How to behave | `continuum://agent/reasoning` |
| Authoring loop, smallest compiling start, what this server can and cannot do | `continuum-host://guide/agentic-authoring` |
| ADL syntax for a new model | `continuum://guides/adl-syntax-card`, then `continuum://guides/repository-to-source` §4; mirror `continuum://examples/order-platform.adl` (`continuum://examples/async-order-fulfillment.adl` for reactions, correlation and waits) |
| Closed value sets (delivery, persistence, claim tokens…) | `continuum://guides/adl-value-sets` |
| Writing an `.adl-change` | `continuum://guides/change-cookbook`, `continuum://spec/change-source`, `continuum://examples/architecture-change/README.md` |
| Recovering a model from code | `continuum://guides/architecture-recovery`, `continuum://guides/repository-to-model`, and `continuum://guides/package-formats` §5 for the citation grammar |
| A diagnostic | `continuum_diagnostics`, then `continuum://guides/diagnostic-hints` |
| Reading a model correctly | `continuum://guides/reading-a-model` |
| BDL | `continuum://guides/bdl-consumer`, `continuum://bdl/spec/language-spec`, `continuum://bdl/spec/metamodel`, `continuum://bdl/spec/realization`; start from `continuum://bdl/examples/order-platform.bdl` (more via `continuum://bdl/examples/index`) |
| Bindings and claims | `continuum://guides/package-formats` §2 and §3, `continuum://guides/development-package` §4.4; mirror `continuum://examples/order-platform.production.adl-binding.json` |
| Acceptance scenarios | `continuum://guides/package-formats` §4, `continuum://guides/development-package` §4.5; mirror `continuum://examples/development-package/conversation-room/acceptance/scenarios/` |
| Package layout, CLI and lifecycle | `continuum://guides/development-package`, `continuum://guides/client-install`, `continuum://guides/development-workflow` |
| Choosing diagram views | `continuum://guides/atlas-viewpoints` |
| Worked examples (compile as written) | `continuum://examples/index` and the full package under `continuum://examples/development-package/conversation-room/` |

## 4. Package layout and lifecycle

The package root is the target repository's `continuum/`, in the layout of `continuum://guides/development-package` §2 and `continuum://guides/package-formats`. If the repository already keeps a file elsewhere, use the existing location and say so; never create a duplicate.

```
continuum/
  development-package.json            development-ready mode only: kebab-case name, environment, controls, semantic.change
  GOAL.md                             the intent record when no adopted package exists (§5); ends with the authority line
  HANDOFF.md                          session outcome (§5); in development-ready mode, the §8 handoff
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
  ledger.json, history/, transitions/, workflow.jsonl   lifecycle: read-only, except a transition you scaffolded, until approved (§8)
  IMPLEMENTATION.md, BEHAVIOUR.md, README.md, PACKAGE.json, model/*.adl.txt,
  model/compile-proof.json, acceptance/README.md, acceptance/traces/ ...   DERIVED by package build; never hand-edited
```

`acceptance/adapter.mjs` belongs to the implementation. Decisions live in the Continuum Host when there is a decision space (§1). Without one, they live in the *Decisions* section of the intent record: `GOAL.md`, or the proposal record when an adopted package exists. Never write a `decisions/` directory; if the repository already keeps ADRs, say so and let the human choose whether to mirror a decision there. A gap file states the fact the model does not settle, its date, status (confirmed, needs-evidence, unknown, deferred, out-of-scope, or resolved with its disposition) and what it blocks, then *Evidence*, *Options* and *Recommendation*.

**Lifecycle.** Read `ledger.json` (or `continuum status`) before changing anything. If the ledger records an adopted change, its result is the current state. Moving authority is a lifecycle act (§1, act 3).

**Adopted package versus proposed change.** An **adopted package** exists when `continuum/ledger.json` has a `current` checkpoint. Its files are the authority: the files the current checkpoint records (`history/<NNNN>-<label>/`, or the file digests in `PACKAGE.json`), such as `development-package.json`, `GOAL.md`, the model, bindings, scenarios and DERIVED files, plus the lifecycle files. Any other file in the package root, apart from `model/changes/` and `transitions/`, is not authority; if it holds proposal content, report it as misplaced and offer to move it into the proposal record. Work that changes its architecture is a **proposed change** until the human adopts it through the existing lifecycle (`continuum://guides/development-workflow` §4.1 and §3.5). Then:
- **Never edit an adopted file to record a proposal**: not `GOAL.md`, not `HANDOFF.md`, not `development-package.json` (`semantic.change` included), not the model, bindings or scenarios in place. Editing them would make the package drift from its checkpoint and present proposed intent as authoritative.
- **The proposal lives beside it.** The architecture goes in `model/changes/<name>.adl-change`, pinned to the checkpoint's changeState and proven to apply (§2). The **proposal record** `model/changes/<name>.proposal.md` is the intent record and session outcome for that change (§5), and opens by stating: proposed, not adopted; the adopted checkpoint (ledger sequence, changeState, attestation) still governs; its readiness claims still hold for that state and say nothing about the proposed one.
- **Nothing proposed goes to an adopted path.** In the proposal record, as text: proposed binding entries, scenario sketches, gaps (a *Gaps* section, not `gaps/` files), and any proposed `.bdl` change (recorded as a gap: no transition dimension carries BDL). Proposed-state diagram files go in `model/changes/<name>.diagrams/`, labelled proposed and listed in the record, never in the adopted `diagrams/`.
- **No in-place maintenance.** Never run a command that rewrites files under the adopted `continuum/`: `continuum package build`, `package bind refresh`, `package realize`, `package repair` (any `package` verb that writes), `evidence init` / `refresh` / `suggest --write` / `migrate`, or a mechanical refresh of pins or DERIVED files. Run what you need on a scratch copy outside the repository, and carry only proposal outputs into the proposal record or the transition. Drift the checks report in adopted files is reported to the human with the check's exact text, and the `reconcile-architecture` route offered; it is never repaired as part of a proposal. A subagent you brief on such a repository gets the same restrictions in its brief.
- **Adoption follows the human's decisions**, by the existing transition lifecycle: `continuum icp init` creates the transition from the change, `continuum icp ready` names each next step and its actor, approve and accept are human acts, and adopt follows them; you never run any of the three (§1 act 3). Intent-first authoring stops at the proven change and its proposal record; it creates no transition, and says the next steps are a development-ready request (or `icp init`), then the human's approval. *Observed 2026-11-13 (CLI 0.36.0, a disposable copy):* adopting an unrelated transition kept other pending `model/changes/` proposals, `gaps/` and an untracked `HANDOFF.md` unchanged, and placed the adopted transition's own change at `model/changes/<name>.adl-change`. It also replaced `model/*.adl` with emitted source, which drops hand-written comments; tell the human before they adopt.

With **no** adopted package (no ledger, or no `current` entry), `GOAL.md` is the intent record and the session outcome goes in `HANDOFF.md`; editing authored files there is ordinary authoring, and documented, semantics-preserving refreshes of pins and DERIVED files are allowed when inputs are stable (record the command and the before/after diff).

**Building.** `continuum package build` rewrites DERIVED files in place; when `development-package.json` names `semantic.change` (change mode) it requires `--out <dir>` (package-formats §1). Never on an adopted package (above).

## 5. Intent-first authoring (the default)

Every session is intent-first unless the human explicitly asks for development-ready output. Completeness means the consequential intent is preserved, not that every artifact exists.

**Choosing the mode.** *Development-ready mode* (§8) applies only on an explicit request from the human, or from an orchestrator holding that authority (§1 act 2): a development package, development-ready or implementation-ready output, a handoff package for a coding agent. It is then never silently downgraded: every §8 row applies, and what cannot be met makes the result Partial with the missing rows named. Everything else is intent-first, and is never silently upgraded into package production. If the request is unclear, work intent-first and say in one line that development-ready mode is available.

**The conversation.** Discover → Decide → Preserve → Connect to evidence → Evolve. A loop you drive in conversation, not phases to complete.

1. **Understand** the product or the proposed change: the intended outcome, its boundaries, and what would be costly to reverse. Read the repository, any existing `continuum/` model, its lifecycle state and whether an adopted package exists (§4), and the decision space first; do not ask what they already answer. Note the session's start time. **Code but no model**: do not recover the whole system; model only the existing elements the decisions touch, cite each (`path:start-end`), and record the unmodelled remainder as out of scope.
2. **Discover the consequential decisions and constraints.** A decision is consequential when it is costly to reverse, crosses a boundary (ownership, trust, data, consistency, an external dependency), or could be silently erased by a later change. Name the few that matter now, and say what does not need deciding or modelling yet.
3. **Ask only questions that change the intent**, batched, each with why it matters and a recommended default. Decide minor ones yourself and record them. **Challenge, do not transcribe:** when a stated choice looks questionable (needless distribution, shared write ownership, an irreversible choice made early, a constraint another one contradicts), say so with the reason and a simpler alternative. The human decides; record the agreement (§1 act 2), or the disagreement and its risk. **Challenge before recording:** raise a consequential challenge before the decision is written down, with the question when you see it then, or, when an answer introduces a choice you would challenge, in one short follow-up before preserving it. Only a risk you could not have seen before writing is recorded afterwards, marked as found after the decision.
4. **Preserve the intent in the artifact that carries it**, and only there (how to author each: §6):

   | Intent | Preserved in |
   |---|---|
   | structure, ownership, boundaries, messages, workflows, dependencies, Environments | ADL (new model, or an `.adl-change` on an existing one), compiled (§2) |
   | business rules, lifecycles, obligations, actors | BDL, only when business semantics are the hard part |
   | a consequential technology choice | a decision (row below) until the model declares the Environment it belongs to; then a binding entry for the affected element, recorded as proposed until agreed |
   | a decision, its alternatives and rationale | the Host decision space (`continuum_decision_propose`) when there is one; otherwise the *Decisions* section of the intent record (§4). Proposed until the human agrees (§1) |
   | a cross-cutting rule (e.g. tenant isolation) | a principle: check existing ones (`continuum_principle_list`, `continuum_principle_check`); propose a new one as a decision, never accept it; where ADL can declare it as a requirement or constraint, do so |
   | a picture that settles a question or communicates the design | an exploratory diagram (§7), labelled as its `delivery.kind` says |
   | the intent itself, assumptions with provenance, open questions | the intent record: `GOAL.md`, or with an adopted package the proposal record (§4) |

   A thin compiling model that holds the agreed decisions is enough. Do not author elements nobody decided, or bind Environments nobody chose.
5. **Connect to evidence.** Classify each consequential expectation as **verifiable** (a declared Continuum check, acceptance scenario or test could evaluate it: name which), **indirectly testable** (only by proxy: inspection, load test, review), or **human judgment** (fitness, trade-off and risk acceptance). Recommend verification only for the few high-consequence, testable invariants (for example mutation authority or tenant isolation), never a verifier per rule. Report evidence that exists with the tool that produced it; everything else is unverified (§1).
6. **Stop at sufficient clarity**: every consequential decision is agreed with its rationale preserved, or explicitly open with an owner and what it blocks; touched ADL and BDL compile; the evidence classification is written; and implementation can proceed on what is decided. Then write the session outcome and stop. Offer development-ready mode; do not start it.
7. **Evolve.** On a later change, find the intent it affects, update only those artifacts (an existing model changes through an `.adl-change`), and surface conflicts with earlier intent instead of silently rewriting it. If an adopted package exists, the change is a proposal (§4) and the proposal record says which readiness claims would have to be re-established for the proposed state. With no adopted package but an earlier development-ready package, say that its readiness claim no longer holds for the changed state, and keep its handoff as `HANDOFF-<date>.md` rather than overwriting it.

**Switching modes.** A development-ready request mid-conversation starts §8 from the current state: reuse agreed intent and run §8's discovery for whatever it lacks. On an adopted package it prepares the proposed change for the lifecycle; it never adopts it. A human may also end a development-ready session early; that is an explicit agreement (§1 act 2), and the result is Partial with the missing rows named.

**Not part of the default.** No binding of every Environment, no acceptance suite, no final verified diagram set, no package build, no review. Each is used when the request, the risk or the evidence warrants it. One fresh review (§8) is worth its cost when a costly-to-reverse decision rests on your reasoning alone, or the human asks; otherwise say SELF-REVIEW.

**Bound the investment.** Track cumulative effort: elapsed time, tool calls, subagent invocations, diagram runs, compile rounds. When effort grows without adding preserved intent, stop and say so.

**Session outcome** (`HANDOFF.md`, or with an adopted package the proposal record, §4). One short record; no section repeats another:
- a status line (on an adopted package, the §4 opening statement) and the intent in two or three sentences;
- *Decisions*: one table row each: decision, rationale, agreement (who and date, §1 act 2) or open, and where it is preserved (element or file);
- *Open questions*: question, recommended default, owner, what it blocks;
- *Verification*: expectation, class (step 5), how it would be checked or what evidence exists;
- proposed material not in any artifact (binding entries, scenario sketches, gaps), only when there is some;
- *Evidence and effort*: verdicts of tools that ran, what was not checked, review or SELF-REVIEW, elapsed time and tool calls, and the next steps in one line.

Do not restate the decisions in prose or close with a summary of the record. With no adopted package, `GOAL.md` holds the intent, *Decisions*, *Open questions* and *Verification*, and `HANDOFF.md` only the status line, a pointer to `GOAL.md`, any proposed material and *Evidence and effort*. End `GOAL.md` with: "The Goal explains intent. The semantic ADL defines architectural meaning. If they conflict, the semantic model governs."

## 6. Authoring each artifact

Author only what the mode needs (§5 step 4; §8 for the full set). Read the knowledge in §3 for each artifact before writing it.

| Input | ADL work | Key rule |
|---|---|---|
| goal, no model (**new**) | author from the smallest compiling start | ids from `continuum_mint_ids` |
| a model in `continuum/model/` (**existing**) | none, or gap-filling edits | preserve every id; current state = adopted result |
| model + requested change (**change**) | `model/changes/<name>.adl-change` pinned to the current changeState | prove apply → B (§2); downstream artifacts target B; on an adopted package it stays a proposal (§4) |
| code, no model (**recover**) | evidence-backed recovery, only as far as the decisions need (§5 step 1) | every element cited; unknown is a gap |

**ADL.**
- Frame before writing: system, domains, bounded contexts, services vs deployables, resources vs external systems, commands vs events, and the Environments the system runs in. A model of many operations and no events is a model of code, not architecture.
- Author on disk in small steps. Manifest: dotted `name` without hyphens and an exact `core` pin the compiler admits (a wrong pin's diagnostic lists them). Compile each step (§2); fix the first error first.
- Check intent, not just legality: `continuum_query` for what you declared; `continuum_preview` for causality from each entry message and the model's silences; `continuum_principle_check` when there is a decision space; `continuum_applicable_guardrails` for a relationship you are unsure is permitted.
- Change mode: compute the current changeState yourself (a pin quoted in an older document may be stale), pin `base` to it, apply (§2), confirm the result state B, and add the `result state` pin as `continuum://spec/change-source` shows. Never edit the base `.adl`.
- Recover mode: cite the code behind every element as `path` or `path:start-end`. With the CLI, and never on an adopted package, `continuum evidence init continuum`, write `citations`, then `continuum evidence refresh continuum`. MCP only: attach citations to workspace edits and list them in the handoff.
- Model responsibilities, boundaries, interfaces, messages, workflows, data ownership, security and failure behaviour a developer would otherwise have to decide. No technology products (those are bindings). Declare only the Environments the system really has: every declared Environment must be bound before the package builds.

**BDL**, only when business rules, obligations, lifecycles or actors are the hard part; otherwise record "BDL not applicable" with the reason.
- One document, no manifest; author every id (BDL never mints) and keep it stable. Keep the business free of systems: no services, messages or databases.
- Only a named person's assertion makes something `stated` (`provenance { source domain-expert, assertedBy "<name or role>", assertedOn <date> }`); what you derive from documents or code is `assumed`, with its source. Never promote `assumed` to `stated` yourself. Open business questions go in `unspecified` blocks.
- Compile and inspect (§2; `continuum_business_inspect` with `view: "worklist"`). Correspondence to ADL is never inferred from shared names; author a Realization only when needed (`continuum://bdl/spec/realization`).
- On an adopted package a `.bdl` change cannot travel in a transition: put the proposed text in the proposal record.

**Bindings and claims.**
- One Binding per owned Deployable, Resource, Service, Agent, Event and MessageChannel, per bound Environment (package-formats §2). Language, runtime and framework hang off the Deployable; persistence off the Resource; transport off each Event or channel; provider and model off each Agent. Never bind an ExternalSystem. `ref` (the id) is the truth; `hint` is a convenience; confirm every `ref` with `continuum_query`.
- Claims are the closed A.4.3 token set (`continuum://guides/adl-value-sets`); a claims file's `configuration` declares shapes (`"atom"`, `"list"`, `"map"`), not values. Secrets are locators, never values: `{ "secretLocator": "env://NAME" }`.
- Pin `base.canonicalModel` to the current attestation. With the CLI, `continuum package realize continuum --environment <Name>` writes a pinned skeleton (on an adopted package, run it on a scratch copy whose model is B, applied with `continuum apply … --emit-source`, and copy it into `transitions/<name>/bindings/`).
- Use what the repository already uses, citing evidence per technology (`path` or `path:start-end`). Where the project has not chosen, label the choice **proposed** and raise irreversible or high-cost choices (data store, hosting, identity, AI provider) as questions. A provider swap is a binding change that leaves the attestation untouched; say so when it lowers the stakes.
- Validate with the CLI on a scratch copy's build; MCP only, include them in the next diagram import (partial evidence, never a build).

**Acceptance scenarios.**
- Prove the important behaviours: the model's Requirements and Tests, the critical journeys, declared failure and exception paths, security guarantees, declared ordering. Prefer 5–15 sharp scenarios; in intent-first mode only the invariants worth verifying (§5 step 5).
- Shape: `acceptance-scenario: "1"`, kebab-case `name` equal to the file name, a one-sentence `purpose`, at least one `verifies`, `given` / `when` / `then` with at least one assertion; `test` where a declared Test applies, `environment`, `trace.from` for key flows, `provider` / `budget` for Agents (fake provider first; no real keys). Steps are reused dotted keys; data in `args`, wording in `text`.
- Assert declared behaviour only; an undeclared behaviour you need is a model gap, not a scenario. Prefer counterexamples that would fail under a plausible incorrect implementation.
- Confirm every reference with `continuum_query`. Coverage: the CLI build's report, or by hand (a Requirement is covered when some scenario verifies it; a Test when every target it declares appears in some scenario's `verifies`), labelled hand-computed. List new step keys for the implementer's `acceptance/adapter.mjs`.

**Research**, only when dated external evidence could change a consequential choice, never for syntax. State the decision, constraints and alternatives (including the simplest or do-nothing); prefer official sources, citing a direct URL and date for every material claim; separate fact, inference and unknown; recommend one option with its best counterargument. A bounded research task may go to a `general-purpose` subagent with that brief. Findings are evidence, not accepted intent.

## 7. Diagrams

The Continuum Diagram server's tool descriptions are the procedure (import, request, poll, revise, render, correct). This section adds only what this protocol needs.

- **One snapshot per model revision.** One `diagram_model_import` carries the `manifest` and, in `files`, every document it names; `bindings.documents` (pinned to the current attestation) and `bindings.vocabularies`, each also in `files`; and `business` (the `.bdl`) when there is one. Re-import only when the ADL, a binding, a claims file or the BDL changes. Limits are reported in every result (2026-11-12: 16 live snapshots per account for 24 hours with no delete, 64 files, 192 KiB inline; larger packages go through `diagram_model_upload_begin`). A refused binding is evidence about the binding (§2).
- **Label honestly.** Present each picture as its `delivery.kind` says. Only `verified-editable` is a verified deliverable and counts toward readiness (§8); a provisional proposal is for reaction, and a failed verification is diagnostic.
- **Look before showing.** View each run with `diagram_status`, check it matches its label, then give the human the title, what it answers, its label, the saved path and the signed link.
- **Save promptly.** Signed links expire: save the PNG (`curl -o continuum/diagrams/<nn>-<slug>.png "<link>"`, or on an adopted package into `model/changes/<name>.diagrams/`; if expired, re-read the run with `diagram_status`), and SVG and reports from `diagram_artifact`.
- **A final set** (development-ready): plan the minimum views (audience, the question each answers, what must be visible), render all on one snapshot as polished deliverables, record each in `diagrams/README.md` (view, audience, question, label, path, link, and planned or blocked views with what they need), and check fidelity (every depicted fact is in the model), consistency across views, coverage and readability.
- **No invented facts.** A diagram cannot make undeclared architecture true; report the missing semantics as a gap. Never substitute Mermaid, hand-drawn SVG or a generic image generator unless the human explicitly asks.
- **Cost.** Image runs are rate-limited work on a free preview; revise and reuse runs rather than re-rendering.

## 8. Development-ready mode: protocol and readiness

This section applies **only** when development-ready output was explicitly requested (§5). It then applies in full and is not reduced to fit time or tooling: a row that cannot be met makes the result Partial. Intent-first sessions claim no readiness level. You author every artifact yourself; no specialist agents are needed.

At the start, check the Diagram server (`diagram_models`) and the CLI (`continuum --version`), and tell the human what the route can and cannot verify and the highest readiness level reachable (§2).

1. **Discover and challenge** (§5 steps 1–3, plus: 2–3 representative journeys and one critical exception, what must be observable, every Environment the system needs, and the 1–3 unknowns that could change significant architecture). Write the intent record with stated versus inferred assumptions, material trade-offs and what not to model.
2. **Draft as one coherent design**: Goal, representative BDL behaviours, thin compiling ADL and early counterexample scenarios together (§6). Before changing semantics, simulate a representative journey and its adverse counterpart across all of them. Every normative behaviour a scenario needs must exist in the ADL or BDL; Goal-only rules are not enough.
3. **Baseline and package.** When material semantics are settled, complete bindings for every declared Environment, the full scenario set and the final diagram set (§7). Delay pins and diagram imports until then; if an authored semantic artifact changes afterwards, mark dependents stale, update them as one batch, and repin, rebuild and reimport once. Without an adopted package, write `development-package.json` (`continuum://guides/package-formats` §1: `development-package: "1"`, kebab-case `name`, explicit `environment`, `controls` only as labelled recommended defaults; in change mode, once the human agrees, `semantic.change`). With the CLI: `continuum package build continuum` (plus `--out <dir>` in change mode), then `continuum package check`.
4. **Independent developer review.** Brief one fresh, read-only `general-purpose` subagent that has not seen your reasoning, with the intent record and the `continuum/` package (or the transition) only: explain the key journeys as a developer would, then name the top three decisions it would still have to invent, contradictions between artifacts, scenarios that prove nothing, and Environments left unverified; edit nothing. Reconcile major findings in one batch. One further review is justified only after substantial changes. If no subagent can run, label SELF-REVIEW; the result is then Partial.
5. **Report** every artifact as PASS / PARTIAL / BLOCKED / NOT CHECKED with its evidence.

**Cross-artifact consistency** (apply before the baseline and in review):

| Comparison | Falsification question |
|---|---|
| Goal ↔ ADL/BDL | Is any scenario-required rule only written in GOAL.md? Are precedence and refusal rules actually declared? |
| ADL ↔ BDL | Can lifecycle transitions, retroactive actions and exceptions coexist? |
| ADL ↔ bindings | Can the selected runtime, persistence and key/secret policy actually implement the required behaviour? |
| ADL/BDL ↔ scenarios | Is the behaviour normative, and would the scenario fail on a realistic incorrect implementation? |
| Bindings ↔ scenarios | Do expiry boundaries, retired credentials, replay/idempotency and concurrency agree? |
| Environments ↔ handoff | Have all Environments been checked, or are some explicitly unverified despite a primary-environment PASS? |

**On an adopted package** (§4), development-ready work makes the *proposed* next package ready for the human's lifecycle decision, never current. The transition is its home:
1. **Decide the dimensions before `init`.** From the proven change and its apply report: acceptance is *changed* when the change adds or modifies a `Test` element or any scenario must be added, changed or removed; bindings are *changed* when a bound element or Environment is added, removed or re-bound. Then, with the human's agreement (§1 act 2), scaffold: `continuum icp init continuum/transitions/<name> --base continuum --reason "<one line>" --semantic changed`, plus `--bindings changed` / `--acceptance changed` as decided. `icp init` refuses a transition that changes no dimension, and a directory that already holds one.
2. **Copy, do not move yet.** Copy the proven `.adl-change` into `transitions/<name>/changes/` and set `semantic.change` in its `incremental-change-package.json`. **Append** the proposal record's content (decisions, rationale, open questions, verification classification, gaps, any proposed `.bdl` text, the diagram list) to `transitions/<name>/REASON.md` below the text `icp init` generated, keeping that text and its footer. The transition is content-addressed: finish `REASON.md` and every other file in it before the first `icp check`, because any later edit is refused as `lifecycle/identity/transition-id-mismatch`.
3. Author changed bindings under `transitions/<name>/bindings/` and added or changed scenarios under `transitions/<name>/acceptance/scenarios/`, with the base package's file names, and list them, and any removed scenarios, in the transition's `incremental-change-package.json` as `icp init` directs. Never edit the adopted ones.
4. Run `continuum icp check continuum/transitions/<name>` until it reports `applies`. If it refuses, do not re-`init` that directory and never run `icp delete`: scaffold one new directory with the corrected dimensions and rebuild it from the `model/changes/` originals by steps 2–3 (never copy the failed directory), and leave the failed transition for the human to dispose of (§1 act 3). Re-scaffold at most once; on a second refusal, or one dimensions cannot fix (such as base drift), stop and report the exact diagnostic. Only when a transition passes, replace the originals with a one-line pointer to it in `<name>.proposal.md` and delete the `model/changes/` copy of the `.adl-change`. Then read `continuum icp ready <transition> --no-execute`, perform only the steps before approval whose actor is `agent` (`icp materialize --analysis`), stop when the awaited actor is `human`, and give that one command.
5. Claim the readiness table for the proposed state, labelled *proposed, not adopted*: the Goal row by `REASON.md`; the ADL row by apply → B; the Bindings, Scenarios and Package rows by the verdicts of `icp check` and `icp materialize --analysis`, never by an in-place build; the BDL row as not applicable, or Partial with a gap when the change needs BDL; the Diagrams row on a snapshot imported from the analysed `result/`, with files in `model/changes/<name>.diagrams/`; the Review row by step 4 over the transition. The handoff goes in `model/changes/<name>.handoff.md`, and says that `GOAL.md` is carried unchanged into the next package, so after adoption `REASON.md` is where this change's intent lives.

**Readiness levels** — the single definition of done. A level is claimed only when every row holds with the stated evidence.

| | **Development-ready** (needs the CLI) | **Authored — package UNVERIFIED** (MCP-only ceiling) |
|---|---|---|
| Goal | `GOAL.md` per §5 (on an adopted package, the transition's `REASON.md`), agreements recorded (§1 act 2) | same |
| ADL | compiled and attested, 0 errors; in change mode apply → B proven | same |
| BDL | compiled, or recorded as not applicable with the reason | same |
| Bindings | every Environment the model declares is bound; the build reports each complete | drafted for every declared Environment, pinned to the current attestation, every `ref` confirmed by query; completeness NOT CHECKED |
| Scenarios | the build resolves every reference; its coverage report shows no uncovered Requirement or Test without a recorded reason | every reference confirmed by query; Test coverage computed by hand and labelled so |
| Package | `continuum package build` and `check` pass | not built; the handoff names who must build it |
| Diagrams | the final set is `verified-editable` on the current snapshot | same |
| Review | the independent review (step 4) found no unresolved major contradiction or missing consequential decision | same |

Anything less is **Partial**, with each missing piece named.

**Handoff** (`continuum/HANDOFF.md`, or on an adopted package `model/changes/<name>.handoff.md`; also your final message): the readiness level and, per row, the evidence or what is missing; a table of artifact, status, evidence (tool and verdict) and path; open gaps, the human's agreements with dates, open choices with recommended defaults and the three biggest blockers; the diagram set with labels, paths and links; recover mode: the citations per element; the review's provenance and findings (or SELF-REVIEW); what the next person must do with the CLI when this session had none; the cumulative effort and a candid retrospective.

**Progress for long runs.** When you run in the background, keep `.claude/progress/STATUS.md` (outside the package; repositories should ignore `.claude/progress/`) current at each phase change, verdict, question or blocker, and at least every 10 minutes: goal, run id, state (RUNNING, WAITING ON HUMAN, BLOCKED, DONE), what is happening now, proven verdicts (only checks that ran), claimed but unchecked work, blockers with exact error text, questions with defaults, and the next steps. Never report a check as passing before it ran.

## 9. Failure playbook

| Situation | Do this |
|---|---|
| A Continuum MCP server is not connected or not signed in | Stop that line of work; tell the human the server and the fix (`/mcp`, README). Never simulate a tool result. |
| A server refuses for rate or quota | Report BLOCKED with the server's message; do not retry in a loop. |
| The CLI is missing | Use the MCP routes (§2); mark CLI-only rows NOT CHECKED; the ceiling is "Authored — package UNVERIFIED" (§8). |
| A tool call is denied by permissions | Do not retry it another way (a different shell, a full path, `npx`); say what was denied and continue with what is allowed. |
| Compile fails | Resolve with `continuum_diagnostics` and `continuum://guides/diagnostic-hints`, first error first. After three rounds without progress on one diagnostic, stop and record it as a gap with the id, location and attempts. |
| A construct is not covered by the guides | Read the normative section; if still unclear, model less and record a gap. |
| Model and code disagree | The code is evidence of the implemented state; record a gap; change neither silently. |
| A workspace is lost | Re-create it from the files on disk and recompile. |
| A call fails with errors unrelated to your change | Suspect the payload (§2) and re-check before reporting a model defect. |
| The attestation moved (bindings stale) | On an adopted package: never refresh in place (§4); bindings in the transition are pinned to B's attestation, and stale adopted pins are reported to the human. Otherwise, CLI: `continuum package bind refresh continuum`. MCP only: copy the new compile's `attestation` into each binding's `base.canonicalModel` with a script, never by hand, and keep the bindings UNVERIFIED. |
| A declared Environment has no binding | Intent-first: record it as open. Development-ready: bind it, or record a gap that blocks Development-ready (package-formats §2). |
| A scenario reference does not resolve | Fix the scenario, or record the missing model element as a gap. |
| Diagram import refused `too-many` | Live-snapshot quota; snapshots expire after 24 hours with no delete. Report BLOCKED and record the planned view so it can run later. |
| Diagram import too large for one call | Use `diagram_model_upload_begin` / `_chunk` / `_finish`. |
| A diagram run reports `verification-failed` or `editable-verification-failed` | Read the failure (`diagram_artifact`); retry once with `diagram_render`; then deliver it labelled diagnostic. It does not count toward readiness. |
| Research sources are stale or contradictory | Record sources, dates and the disagreement; recommend conservatively; never promote it to fact. |
| The review finds major unmade decisions | Resolve them with the human, or the result stays Partial until the human agrees to defer them (§1 act 2). |
| An instruction here contradicts a live source | Follow the live source (§1) and report the contradiction. |
