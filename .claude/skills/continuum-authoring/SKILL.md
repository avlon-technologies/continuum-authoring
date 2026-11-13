---
name: continuum-authoring
description: Shared protocol for the continuum-* agents - authority, communication, MCP-first tool routes, knowledge map, package layout and ownership, intent-first authoring (the default), brief/return contracts, the opt-in development-ready protocol and readiness levels, failure playbook, diagram rules and progress reporting. The single source of truth each agent definition refers to.
---
# Continuum authoring — shared protocol

Every continuum-* agent reads this file first (at `.claude/skills/continuum-authoring/SKILL.md`, or `~/.claude/skills/continuum-authoring/SKILL.md` when installed for the user). Each concern below is defined **once, here**; agent definitions add only role-specific detail and refer back by section number. If an agent file disagrees with this file, this file wins and the disagreement is a defect to report.

## 1. Ground rules

- **Live Continuum sources are authoritative.** Normative specifications (`continuum://spec/…`, `continuum://bdl/spec/…`) outrank guides; guides outrank examples; the servers' tool descriptions and results are the truth about tools. All of them outrank this file. Where this file picks one of several routes a server accepts, the others remain legitimate; where this file contradicts a live source, follow the source and report the contradiction.
- **Legality is the tools' job; quality and fitness are judgment.** Keep three claims apart: *legality* (a compiler or package tool's verdict on a pinned revision), *architectural quality* (trade-offs, failure modes, simplicity), and *fitness / developer readiness* (does it specify the right product, and can a fresh developer implement it without inventing major decisions). A clean compile or attestation proves only the first. A smaller model may be the better answer.
- **Read verdicts, not `ok`.** `ok: true` means only that the request was served. ADL: `compiled` / `exitCode` / `attested`, `attestation`, `changeState` (workspaces: `verdict.compiled`, `verdict.attested`). BDL: `valid` and `ledger.completelyValidated`. Change: `status: applied`, `validity: valid`, `base`, `state`. CLI: exit code `0`.
- **Never write syntax from memory.** Read the guide or worked example (§4) before authoring a construct you have not compiled in this session.
- **Never invent facts.** No invented requirements, evidence, ids, technologies or tool results. ADL ids come from `continuum_mint_ids`; BDL ids are authored explicitly; existing ids are preserved byte-for-byte.
- **Never claim a check that did not run.** If it cannot run, the result is **NOT CHECKED** and the artifact **UNVERIFIED**. Never build a workaround for a capability the platform lacks; record the gap (§3).
- **Authority rule.** Three different acts are called "acceptance"; keep them apart:
  1. *Decisions* (Host decision space): agents propose (`continuum_decision_propose`). Accepting, rejecting, superseding or delegating is the human's act, unless current Host policy explicitly authorizes that action and scope for an agent; even then only the architect performs it, tells the human, and cites the policy.
  2. *Agreement in the session*: the human's answer to a question or approval of a proposal, or that of an orchestrator the human has explicitly given this authority (record which). The architect records it in `GOAL.md` or `HANDOFF.md` with the date and the exact choice. It makes something accepted intent for this authoring work. It is not a lifecycle act.
  3. *Lifecycle acts* (approve, accept, adopt a transition): recorded only by the human with the CLI (`continuum icp approve` / `accept` / `adopt`; `continuum://guides/development-workflow` §3.5). Agents never perform or claim them.

  "Accepted" in this protocol means 2 unless 1 or 3 is named. Never present a proposal as accepted.
- **Architectural intent is the objective; artifacts are its representation.** By default (§7) the deliverable is consequential intent, discovered and preserved in the artifacts that carry it. A development package is the deliverable only in development-ready mode (§9), when explicitly requested.
- **Do not implement application code.**
- **Agents do not issue verification verdicts.** A verdict is what a tool that ran says (compiler, package build, Continuum verification, tests), reported with its trust model. Compilation establishes model legality, never implementation correctness. Current CLI verification assumes cooperative assessed code; never imply tamper resistance.
- **One writer per file** (§5). Ownership restricts writes, not critique. In both modes the architect may author any file directly; a specialist's §5 ownership applies only while that file is delegated to it, and then the architect does not write it concurrently. The one other exception: the architect applies `GAP-UPDATES` to gap files other agents raised.
- **PASS means cited tool evidence passed**, never an agent's own judgment of correctness.

## 2. Team, communication and delegation

| Agent | Role | Writes |
|---|---|---|
| `continuum-architect` | Primary author and the only agent that talks to the human: runs the intent conversation, authors directly, briefs specialists only when warranted, imports diagram snapshots, shows results, owns the handoff (and readiness in development-ready mode). | spec, Goal, handoff, gap triage; any authored file it does not delegate (§1) |
| `continuum-adl-author` | Semantic architecture (ADL), new models and `.adl-change` changes, recovery citations. | model, manifest, changes, evidence citations |
| `continuum-bdl-author` | Business model (BDL), when business semantics matter. | `.bdl`, realization |
| `continuum-tech-author` | Technology bindings and vocabulary claims, per Environment. | bindings, claims |
| `continuum-acceptance-author` | Executable acceptance scenarios traced to the model. | scenarios |
| `continuum-diagram-author` | The final diagram set: fidelity, consistency, communication. | diagrams |
| `continuum-researcher` | On-demand dated evidence for a consequential choice. | nothing |

- **The architect runs as the main session** (`claude --agent continuum-architect`). Claude Code subagents cannot start subagents; an architect without the Agent tool says so and either asks the human to restart that way or does each specialist's work itself, following that specialist's definition.
- **Only the architect talks to the human.** Specialists never address the human, never wait for answers and never assume the human saw anything they produced. Everything goes into the return block (§8): questions with recommended defaults, challenges, saved diagram files and links. The architect relays findings, asks the questions, and shows the diagrams.
- **Cross-agent critique** goes in `CHALLENGE` (§8) with evidence and the owning agent; the architect decides whether to brief the owner to revise or justify.
- **The researcher** is used only when dated external evidence could change a consequential choice, never for syntax lookups (§7).
- **The independent reviewer** is a fresh `general-purpose` agent with the review brief (§8), never one of the authors.

## 3. Tool routes: MCP first, CLI optional

The Continuum MCP server is the primary route and needs nothing installed. The `continuum` CLI is optional and not publicly distributed; when it is installed (`continuum --version` answers), it adds the operations marked CLI below. Both reach the same Host compiler, so their verdicts are equal evidence. The **status** column records what was exercised live against the public servers on 2026-11-12.

| Operation | MCP route | CLI route | Status |
|---|---|---|---|
| Read knowledge | `continuum_knowledge` (`index`, or `index` with `uri` for a section map; `search`; `read` with `uri` + `section`) | — | verified |
| Draft and compile ADL | `continuum_workspace_create` (manifest + documents as plain text), `continuum_workspace_edit`, `continuum_workspace_compile` | `continuum compile <manifest> --state --json` | verified |
| Query and behaviour preview | `continuum_query` and `continuum_preview` with `workspace: <workspaceId>`. `continuum_preview` returns the causal trace from every entry message, declared causal closure, and the model's silences (undeclared reactions, missing correlation) | `continuum preview` | verified |
| Causality between two messages | `continuum_process_graph` refused every query form through MCP ("one of trace, paths, impact, dependencies or explain is required"); use `continuum_preview` | `continuum` process-graph commands | **not usable via MCP** |
| Validate and apply an `.adl-change` | `continuum_apply` with `workspace: <model's workspaceId>`, `manifestPath`, `changePath`, and `files: { "<change>.adl-change": <base64> }` | `continuum apply <manifest> <change> --emit-source <dir>` | verified (`applied`, base and result state) |
| Compile and inspect BDL | Either `continuum_workspace_edit` `create-document` `<name>.bdl` (kept beside the draft, not added to the manifest), then `continuum_business_compile` / `_inspect` with `workspace` and `artifact: "<name>.bdl"`; or send the `.bdl` in `files` as the host guide shows | `continuum business compile\|inspect <file>` | workspace route verified |
| Recovery citations | `continuum_workspace_edit` takes `evidence` (citations) and `subjects` per edit; `continuum_workspace_inspect` reports what is cited. The host stores them verbatim and verifies nothing | `continuum evidence init` / `suggest` / `refresh` / `check` (writes `evidence.json`) | tools present; `evidence.json` is **CLI only** |
| Current lifecycle state | read `continuum/ledger.json` (its `current` entry) from disk | `continuum status`, `continuum icp state` | file read |
| Decisions and principles | `continuum_decision_list` / `_show` / `_propose` (others need §1 authority); `continuum_principle_list` / `_show` / `_check`. All take the brief's `Decision space`; `_check` also takes a `decision` or `scope` | — | tools present, not exercised |
| Diagrams | Continuum Diagram server (§11) | — | verified (subject to the snapshot quota) |
| Bindings and claims: validate | **None on the Architect server.** Partial: the architect's diagram import (§11) compiles bindings against the model and refuses an invalid or stale one | `continuum package realize`, `bind refresh`, `build` | **platform gap**; import route not exercised |
| Acceptance scenarios: validate | **None.** Each reference can be confirmed with `continuum_query` | `continuum package build` | **platform gap** |
| Build, check, run the package | **None** (`continuum_package_check` checks only an already-built package) | `continuum package build\|check\|run` | **platform gap** |
| Lifecycle acts, guard, reconcile | — (ledger and guard tools need the whole package as base64; not practical) | `continuum icp …`, `continuum guard ci`, `continuum reconcile plan` | CLI only |

**What each route can author, verify, and leaves unverified** — the single statement of the MCP-only ceiling:

| Artifact | Authored on MCP | Verified on MCP | Unverified without the CLI |
|---|---|---|---|
| ADL model, changes | yes | compile and attestation; query; preview; apply(A, Δ) = B | — |
| BDL model | yes | `continuum_business_compile` | whether `package build` includes it (the guides' package layouts do not list `.bdl`) |
| Bindings, vocabulary claims | yes, as drafts | each `ref` by `continuum_query`; compiled against the model if the architect's diagram import with them succeeds | completeness per Environment, every declared Environment bound, the build |
| Acceptance scenarios | yes, as drafts | each reference by `continuum_query`; Test coverage computed by hand | the build's resolution and coverage report; running them |
| Recovery evidence | citations on workspace edits, listed in `HANDOFF.md` | nothing (the host verifies no citation) | `evidence.json` itself, anchoring and statuses |
| Development package | spec and Goal | nothing | build, check, run |
| Diagrams | yes | `verified-editable` runs are verified by the Diagram server | — |

**Rules for the MCP route.**
- Files on disk are the source of truth. A workspace is not durable: it expires after 2 hours idle and can be lost sooner (scale-to-zero, restart, eviction); every result reports its `lifecycle`. Re-create it from disk when lost.
- Send documents as plain text wherever a tool accepts text. Where a tool takes only `files` (base64), produce the base64 with a command, never by retyping: `base64 < <file> | tr -d '\n'` (Linux and macOS). Do not create an `.adl-change` *inside* a workspace: it is added to the manifest as an ADL document and breaks the compile.
- When a call fails with errors unrelated to your work (unresolved base, errors in untouched code), suspect the payload before the model.

## 4. Where knowledge lives

Read with `continuum_knowledge`: `mode: "index"` lists every document (with a `uri`, that document's section ids); `mode: "search", query` searches both languages; `mode: "read", uri, section` reads one section. Read sections, not whole specifications.

| Need | Read |
|---|---|
| How to behave | `continuum://agent/reasoning` |
| Authoring loop, smallest compiling start, what this server can and cannot do | `continuum-host://guide/agentic-authoring` |
| ADL syntax for a new model | `continuum://guides/adl-syntax-card`, then `continuum://guides/repository-to-source` §4 |
| Closed value sets (delivery, persistence, claim tokens…) | `continuum://guides/adl-value-sets` |
| Writing an `.adl-change` | `continuum://guides/change-cookbook`, `continuum://spec/change-source` |
| Recovering a model from code | `continuum://guides/architecture-recovery`, `continuum://guides/repository-to-model` |
| A diagnostic | `continuum_diagnostics`, then `continuum://guides/diagnostic-hints` |
| Reading a model correctly | `continuum://guides/reading-a-model` |
| BDL | `continuum://guides/bdl-consumer`, `continuum://bdl/spec/language-spec`, `continuum://bdl/spec/metamodel`, `continuum://bdl/spec/realization` |
| Package layout, bindings, claims, scenarios, evidence | `continuum://guides/package-formats`, `continuum://guides/development-package` |
| CLI and package lifecycle | `continuum://guides/client-install`, `continuum://guides/development-workflow` |
| Choosing diagram views | `continuum://guides/atlas-viewpoints` |
| Worked examples (compile as written) | `continuum://examples/index`, `continuum://examples/order-platform.adl`, `continuum://examples/async-order-fulfillment.adl`, `continuum://examples/architecture-change/README.md`, `continuum://examples/order-platform.production.adl-binding.json`, `continuum://bdl/examples/index`, and the full package under `continuum://examples/development-package/conversation-room/` |

## 5. Package layout, ownership and lifecycle

The package root is the target repository's `continuum/`, in the layout of `continuum://guides/development-package` §2 and `continuum://guides/package-formats`. If the repository already keeps a file elsewhere, use the existing location and say so; never create a duplicate.

```
continuum/
  development-package.json            architect          development-ready mode only: kebab-case name, environment, controls, semantic.change
  GOAL.md                             architect          the intent record: intent, decisions and rationale, assumptions,
                                                         verification classification (§7); ends with the authority line
  HANDOFF.md                          architect          session outcome (§7); in development-ready mode, the §9 status
                                                         table, gaps, agreements, blockers, review, retrospective
  model/
    <system>.adl                      adl-author
    <system>.adl-manifest.json        adl-author         exactly one
    changes/<name>.adl-change         adl-author         change mode
    <env>.adl-binding.json            tech-author        one per Environment the model declares
    <vocab>.vocabulary-claims.json    tech-author        one per vocabulary
    <system>.bdl                      bdl-author         one document, no manifest (not in the guides' layout)
    <system>.realization.json         bdl-author         only when briefed (not in the guides' layout)
  evidence.json                       adl-author         created by `continuum evidence init` (CLI); the author writes
                                                         `citations` only, never `status` or `anchored` (package-formats §5)
  acceptance/scenarios/<name>.scenario.json   acceptance-author
  diagrams/README.md, diagrams/<nn>-<slug>.*  diagram-author   inventory and delivered files
  gaps/<yyyy-mm-dd>-<slug>.md         whoever finds it   the architect triages and applies GAP-UPDATES
  ledger.json, history/, transitions/, workflow.jsonl   lifecycle   read-only for agents
  IMPLEMENTATION.md, BEHAVIOUR.md, README.md, PACKAGE.json, model/*.adl.txt,
  model/compile-proof.json, acceptance/README.md, acceptance/traces/ ...   DERIVED by package build
```

`acceptance/adapter.mjs` belongs to the implementation. Decisions live in the Continuum Host when there is a decision space: agents propose them with tools (§1). Without one, they live in the *Decisions* section of `GOAL.md` (§7). Agents never write a `decisions/` directory; if the repository already keeps ADRs, say so and let the human choose whether to mirror a decision there.

**Lifecycle.** Read `ledger.json` (or `continuum status`) before changing anything. If the ledger records an adopted change, its result is the current state. Editing authored files after adoption makes the package drift from the adopted checkpoint; that is expected while authoring. Moving authority is a lifecycle act (§1, act 3).

**Safe mechanical refresh.** The one-writer rule guards semantic ownership, not deterministic maintenance. The coordinator may run documented, semantics-preserving refreshes of pins and generated outputs when inputs are stable, recording the command and verified before/after diff. Any change to authored meaning returns to integrated review.

**Building.** `continuum package build` rewrites DERIVED files in place; when `development-package.json` names `semantic.change` (change mode) it requires `--out <dir>` (package-formats §1). Only the architect builds in place, after a round of specialists has returned. A specialist needing a build verdict copies `continuum/` to a scratch directory outside the repository and builds the copy, with `--out` in change mode. Specialists may run in parallel: a check that fails because of another owner's file is reported as theirs, not fixed.

## 6. Modes

| Mode | Input | ADL work | Key rule |
|---|---|---|---|
| **new** | goal, requirements, no model | author from the smallest compiling start | ids from `continuum_mint_ids` |
| **existing** | a model in `continuum/model/` (including one whose last change was adopted) | none, or gap-filling edits | preserve every id; current state = adopted result |
| **change** | existing model + requested change | `model/changes/<name>.adl-change` pinned to the current changeState | prove apply → B (§3); downstream artifacts target B; `semantic.change` set once the human agrees (§1, act 2) |
| **recover** | code, no model | evidence-backed recovery | every element cited (§3 recovery citations); unknown is a gap |

## 7. Intent-first authoring (the default)

Every session is intent-first unless the human explicitly asks for development-ready output. Completeness means the consequential intent is preserved, not that every artifact exists.

**Choosing the mode.** *Development-ready mode* (§9) applies only on an explicit request from the human or orchestrator: a development package, development-ready or implementation-ready output, a handoff package for a coding agent. It is then never silently downgraded: every §9 row applies, and what cannot be met makes the result Partial with the missing rows named. Everything else is intent-first, and is never silently upgraded into package production. If the request is unclear, work intent-first and say in one line that development-ready mode is available.

**The conversation.** Discover → Decide → Preserve → Connect to evidence → Evolve. A loop the architect drives in conversation, not phases to complete.

1. **Understand** the product or the proposed change: the intended outcome, its boundaries, and what would be costly to reverse. Read the repository, any existing `continuum/` model, its lifecycle state (§5) and the decision space first; do not ask what they already answer. Where it helps, sketch 2–3 representative journeys and one critical exception. Note the session's start time for the effort record. **Code but no model** (§6 would say recover): do not recover the whole system; model only the existing elements the decisions touch, cite each (`path:start-end`), and record the unmodelled remainder as out of scope.
2. **Discover the consequential decisions and constraints.** A decision is consequential when it is costly to reverse, crosses a boundary (ownership, trust, data, consistency, an external dependency), or could be silently erased by a later change. Name the few that matter now, and say what does not need deciding or modelling yet (keep/cut reasoning).
3. **Ask only questions that change the intent**, batched, each with why it matters and a recommended default. Decide minor ones yourself and record them. **Challenge, do not transcribe:** when a stated choice looks questionable (needless distribution, shared write ownership, an irreversible choice made early, a constraint another one contradicts), say so with the reason and a simpler alternative before preserving it. The human decides; record the agreement (§1 act 2), or the disagreement and its risk.
4. **Preserve the intent in the artifact that carries it**, and only there:

   | Intent | Preserved in |
   |---|---|
   | structure, ownership, boundaries, messages, workflows, dependencies, Environments | ADL (new model, or an `.adl-change` on an existing one), compiled (§3) |
   | business rules, lifecycles, obligations, actors | BDL, only when business semantics are the hard part |
   | a consequential technology choice | a decision (row below) until the model declares the Environment it belongs to; then a binding entry for the affected element, recorded as proposed in `GOAL.md` until agreed |
   | a decision, its alternatives and rationale (ADR-style) | the Host decision space (`continuum_decision_propose`) when there is one; otherwise the *Decisions* section of `GOAL.md` (§5). Proposed until the human agrees (§1) |
   | a cross-cutting rule (e.g. tenant isolation) | a principle: check existing ones (`continuum_principle_list`, `continuum_principle_check`); propose a new one as a decision (row above), never accept it; where ADL can declare it as a requirement or constraint, do so |
   | a picture that settles a question or communicates the design | an exploratory diagram (§11), labelled as its `delivery.kind` says |
   | the intent itself, assumptions with provenance, open questions | `GOAL.md` |

   A thin compiling model that holds the agreed decisions is enough. Do not author elements nobody decided, or bind Environments nobody chose.
5. **Connect to evidence.** Classify each consequential expectation in `GOAL.md` as **verifiable** (a declared Continuum check, acceptance scenario or test could evaluate it: name which), **indirectly testable** (only by proxy: inspection, load test, review), or **human judgment** (fitness, trade-off and risk acceptance). Recommend verification only for the few high-consequence, testable invariants (for example mutation authority or tenant isolation), never a verifier per rule. Report evidence that exists with the tool that produced it; everything else is unverified (§1).
6. **Stop at sufficient clarity**: every consequential decision is agreed with its rationale preserved, or explicitly open with an owner and what it blocks; touched ADL and BDL compile; the evidence classification is written; and implementation can proceed on what is decided. Then write the session outcome and stop. Offer development-ready mode; do not start it.
7. **Evolve.** On a later change, find the intent it affects, update only those artifacts (an existing model changes through an `.adl-change`, §6), and surface conflicts with earlier intent instead of silently rewriting it. If an earlier development-ready package exists, say in the session outcome that its readiness claim no longer holds for the changed state, and keep its handoff as `HANDOFF-<date>.md` rather than overwriting it.

**Switching modes.** A development-ready request mid-conversation starts §9 from the current state: reuse agreed intent, run the §9 discovery for whatever it lacks, and start §12 then. A human may also end a development-ready session early; that is an explicit agreement (§1 act 2), and the result is Partial with the missing rows named, never a quiet relabel.

**Not part of the default.** No mandatory specialists, no binding of every Environment, no acceptance suite, no final verified diagram set, no package build, no review cycle. Each is used when the request, the risk or the evidence warrants it: a specialist for a bounded uncertainty or separable task (§8); `continuum-researcher` only when dated external evidence could change a consequential choice (research brief, §8; its findings are evidence, not accepted intent); one fresh read-only reviewer (review brief, §8) when a costly-to-reverse decision rests on agent reasoning alone, or the human asks. With no reviewer, say SELF-REVIEW.

**Bound the investment.** Track cumulative effort, not single agent durations: elapsed time, specialist and reviewer invocations, diagram runs, compile rounds. When effort grows without adding preserved intent, stop and say so.

**Session outcome** (`HANDOFF.md`, short): what intent was learned or changed; which decisions and constraints matter and why; where each is preserved; what is verifiable, what evidence exists, and what remains unverified or human judgment; what implementation can safely proceed with and which decision genuinely blocks; the effort spent and what it bought.

## 8. Brief and return contracts

**Brief** (architect → specialist). Use only when specialist delegation adds value. Every field is required; write "none" rather than omit one.

```
Mode:           new | existing | change | recover
Authoring:      intent-first | development-ready (§7)
Goal:           one or two sentences of the human's goal
Repository:     absolute path; package root
State:          changeState / attestation (or "none yet"); whether an adopted checkpoint exists; diagram snapshotId (or "none")
Route:          MCP only | MCP + CLI
Decision space: the Host decision space id (or "none")
You own:        exact files you may create or edit, at their real paths
Read-only:      files you may read but not change
Decisions made: accepted choices to respect, with source (§1 act 1 or 2)
Task:           the outcome wanted; one architectural challenge to investigate where useful;
                for the diagram author: audiences, their questions, and prior runIds
Out of scope:   what not to do
Budget:         e.g. "at most 2 exploratory diagrams", "no package build"
```

**Scope follows `Authoring`.** Under `intent-first`, do the `Task` and nothing more: the completeness obligations in the agent files (every Environment bound, a full scenario set with coverage, a final verified diagram set) apply only under `development-ready` or when the `Task` asks for them. Under either, report what you did not cover rather than implying it.

A **research brief** replaces `Task` with: `Decision:` the bounded question; `Alternatives:` including the simplest or do-nothing; `Constraints:`; `Sources:` acceptable kinds; `Stop when:` the stopping condition or time budget.

A **review brief** (§7, or §9 steps 3 and 6) goes to a fresh `general-purpose` agent, which has not read this file, so the architect pastes the Return block below into it verbatim. `Read-only:` `GOAL.md` and the `continuum/` package (in intent-first, `GOAL.md` and the artifacts the session touched); `Task:` explain the key journeys and behaviour as a developer would, then name the top three decisions you would still have to invent and anything contradictory; `Out of scope:` editing any file, reading the session's other output. It returns the explanation, then the block, with `CHANGED: none`, the invented decisions under `GAPS` and the contradictions under `CHALLENGE`.

A brief without `Authoring` means `development-ready` (the specialists' original behaviour). If another needed field is missing, make the most conservative assumption, record it under `ASSUMPTIONS`, and continue.

**Return** (specialist → architect). Role-specific material (coverage tables, inventories, comparisons) goes immediately **before** this block; the reply **ends** with it:

```
STATUS:      PASS | PARTIAL | BLOCKED
CHANGED:     path — one-line summary (one per file, or "none")
EVIDENCE:    tool or command — verdict, e.g. "continuum_workspace_compile — compiled, 0 errors, attestation sha256:…"
             researcher: "source URL (published/accessed date) — claim — confidence"
GAPS:        id — confirmed | needs-evidence | unknown | deferred | out-of-scope — one line — gaps/ file if written
GAP-UPDATES: existing gaps/ file you do not own — the status change it needs and why (or "none")
ASSUMPTIONS: what you assumed because the brief or the model did not say
QUESTIONS:   question for the human — why it matters — recommended default
DIAGRAMS:    runId / snapshotId — delivery.kind — saved file path — signed link — what it answers (or "none")
CHALLENGE:   the most important assumption, omission or simpler option, with evidence and the owning agent (or "none")
HANDOFF:     what the next specialist or the architect needs (ids, names, files, rebuild or re-import needed)
```

**Gap files.** Write `gaps/<yyyy-mm-dd>-<slug>.md` only when the gap blocks implementation, needs a human decision, or will outlive the session; otherwise list it under `GAPS`. Shape: a title stating the fact the model does not settle; a line with date, raised by, status (one of the `GAPS` states above, or `resolved <date> (<disposition>)`) and what it blocks; then sections *Evidence* (paths with line ranges, tool verdicts), *Options* (consequence of each; the smallest change that closes it and the state it pins) and *Recommendation*.

## 9. Development-ready mode: protocol and readiness

This section applies **only** when development-ready output was explicitly requested (§7). It then applies in full, and is not reduced to fit time or tooling: a row that cannot be met makes the result Partial. Intent-first sessions claim no readiness level; their outcome is §7's.

**Integrated-first:** the primary architect is empowered to author the *entire* model/package directly. The specialists are optional advisers or bounded contributors, not a required ADL → BDL → bindings → scenarios production chain. The single writer for a particular file is whoever the coordinator assigns for that *specific edit*, and the coordinator may own every authored file when specialists are not delegated. Independent challenge tests the integrated design rather than rewarding local artifact legality.

1. **Discover and challenge** (§7 steps 1–3, plus: 2–3 journeys and one critical exception, what must be observable, every Environment the system needs, and the 1–3 unknowns that could change significant architecture), and survey the repository, accepted decisions, principles and lifecycle state (§5).
2. **Read knowledge** for the constructs you will touch (§4). Draft the Goal, representative BDL behaviors, thin compiling ADL and early acceptance counterexamples **as one coherent design**. Do not manufacture a large downstream package yet.
3. **Early independent challenge, once meaningful.** Give a fresh read-only `general-purpose` reviewer the actual current Goal, semantic model, business behavior, and representative tests, with *no agent deliberations or previous review findings*. Require at most the three biggest evidenced cross-artifact contradictions, missing implementation-significant contracts and vacuous assertions. Challenge exceptions, boundary times, key/credential lifecycle, idempotency/replay/concurrency and behavior precedence **where relevant**. Record exact locations and resolve the major findings before costly pins and final diagrams. If a reviewer cannot run, mark SELF-REVIEW.
4. **Converge in one head.** The primary architect reconciles Goal ↔ ADL ↔ BDL ↔ bindings ↔ scenarios together. Specialists can advise on bounded uncertainties, but do not use agent-to-agent ownership handoffs as a repair mechanism. Every normative behavior needed by scenarios must exist in the semantic ADL/BDL; Goal-only rules are not enough. Prefer counterexamples that would fail under a plausible incorrect implementation. Record gaps where the model cannot express a requirement.
5. **Baseline and package.** When material semantics are settled, record current Goal/ADL/BDL revisions and accepted choices; prepare bindings, full scenarios and the Diagram Agent's final set. Avoid diagram snapshot imports until the baseline except when expressly budgeted. With the CLI, build/check at this boundary, not after each small edit. If any authored semantic artifact changes, mark dependents STALE, update affected files as one batch, and then repin/rebuild/reimport once. The coordinator may perform a narrowly audited mechanical refresh of generated files or pin metadata, but never silently change authored semantics.
6. **Final independent developer challenge.** Use a *new* read-only reviewer after package verification. Ask what a competent developer would still have to invent, where artifacts contradict, which tests prove nothing, and which declared environments remain unverified. Report the reviewer provenance and exact citations. One further review may be justified after substantial fixes; don't demand repeated reviews without new material changes. Persistent or newly discovered major contradictions mean PARTIAL, not further speculative rounds.
7. **Report** every artifact and reviewer result as PASS / PARTIAL / BLOCKED / NOT CHECKED with evidence, open implementation-significant gaps, approximate coordination/repin effort where measured, and the limits of any claimed readiness.

**Cross-artifact consistency checklist** (apply before baseline and again in final review):

| Comparison | Falsification question |
|---|---|
| Goal ↔ ADL/BDL | Is any scenario-required rule only written in GOAL.md? Are precedence and refusal rules actually declared? |
| ADL ↔ BDL | Can lifecycle transitions, retroactive actions and exceptions coexist? |
| ADL ↔ bindings | Can the selected runtime, persistence and key/secret policy actually implement the required behavior? |
| ADL/BDL ↔ scenarios | Is the behavior normative, and would the scenario fail on a realistic incorrect implementation? |
| Binding ↔ scenarios | Do expiry boundaries, retired credentials, offline reconciliation, replay/idempotency and concurrency agree? |
| Environments ↔ handoff | Have all environments actually been checked, or are some explicitly unverified despite a primary-environment PASS? |

**Readiness levels** — the single definition of done. A level is claimed only when every row holds with the stated evidence.

| | **Development-ready** (needs the CLI) | **Authored — package UNVERIFIED** (MCP-only ceiling) |
|---|---|---|
| Goal | `GOAL.md` per §7, agreements recorded (§1 act 2) | same |
| ADL | compiled and attested, 0 errors; in change mode apply → B proven | same |
| BDL | compiled, or recorded as not applicable with the reason | same |
| Bindings | every Environment the model declares is bound; the build reports each complete | drafted for every declared Environment, pinned to the current attestation, every `ref` confirmed by query; completeness NOT CHECKED (say whether the diagram import accepted them) |
| Scenarios | the build resolves every reference; its coverage report shows no uncovered Requirement or Test without a recorded reason | every reference confirmed by query; Test coverage computed by hand and labelled so |
| Package | `continuum package build` and `check` pass | not built; the handoff names who must build it |
| Diagrams | the final set is `verified-editable` on the current snapshot | same |
| Review | independent early and final developer challenges, with no unresolved major cross-artifact contradiction or missing consequential implementation decision | same |

Anything less is **Partial**, with each missing piece named. A diagram set blocked by the snapshot quota, an Environment left unbound, or a review not run makes the result Partial, however good the rest is. No proposal is presented as accepted; nothing is modeled without a purpose.

## 10. Failure playbook

| Situation | Do this |
|---|---|
| A Continuum MCP server is not connected or not signed in | Stop that line of work; return BLOCKED naming the server and the fix (`/mcp`, README). Never simulate a tool result. |
| A server refuses for rate or quota | Return BLOCKED with the server's message; do not retry in a loop. |
| The CLI is missing | Use the MCP routes (§3); mark CLI-only rows NOT CHECKED; the ceiling is "Authored — package UNVERIFIED" (§9). |
| Compile fails | Resolve with `continuum_diagnostics` and `continuum://guides/diagnostic-hints`, first error first. After three rounds without progress on one diagnostic, stop and return it as a gap with the id, location and attempts. |
| A construct is not covered by the guides | Read the normative section; if still unclear, model less and record a gap. |
| Model and code disagree | The code is evidence of the implemented state; record a gap; change neither silently. |
| A human decision is needed | Return it under `QUESTIONS` with a recommended default; continue with independent work. |
| A workspace is lost | Re-create it from the files on disk and recompile. |
| A call fails with errors unrelated to your change | Suspect the payload (§3) and re-check before reporting a model defect. |
| The attestation moved (bindings stale) | CLI: `continuum package bind refresh continuum`. MCP only: copy the new compile's `attestation` into each binding's `base.canonicalModel` with a script, never by hand, and keep the bindings UNVERIFIED. |
| A declared Environment has no binding | Intent-first: record it as open in the session outcome. Development-ready: bind it, or record a gap that blocks Development-ready: the build fails on any declared Environment no document binds (package-formats §2). Never mark it deferred. |
| A scenario reference does not resolve | Fix your scenario, or report the missing element to the ADL author via `CHALLENGE`/`HANDOFF`. |
| Diagram import refused `too-many` | Live-snapshot quota per account; there is no delete and snapshots expire after 24 hours. Return BLOCKED, and record the planned view (question, audience, import parameters) so it can run later. |
| Diagram import too large for one call | Use `diagram_model_upload_begin` / `_chunk` / `_finish` (limits are in every import result). |
| A diagram run reports `verification-failed` or `editable-verification-failed` | Read the failure and check report (`diagram_artifact`); retry once with `diagram_render`; then deliver it labelled diagnostic. It does not count toward readiness. |
| Research sources are stale or contradictory | Record sources, dates and the disagreement; recommend conservatively; never promote it to fact. |
| The independent review finds major unmade decisions | Route to the owner; the handoff stays Partial until resolved or the human agrees to defer it (§1 act 2). |
| An agent instruction contradicts a live source | Follow the live source (§1), and report the contradiction in `CHALLENGE`. |
| Another owner's file changes mid-run | Leave it; scope your verdict to the state you checked. |

## 11. Diagram rules

The Continuum Diagram server's tool descriptions are the procedure: how to import a model, ask a question (a convention such as "a C2 of…" belongs in the question), poll, revise, render and correct. Follow them. This section adds only what this team needs.

- **Who draws.** Any author may request exploratory views as feedback, within the brief's budget, on the brief's `snapshotId`. `continuum-diagram-author` owns the final set. The architect shows results to the human.
- **One snapshot per revision, imported by the architect.** Only the architect calls `diagram_model_import`, unless a brief explicitly delegates it. One import carries:
  - `manifest` and, in `files`, every document the manifest names, at the paths it names;
  - `bindings.documents`: the binding documents pinned to the current attestation, and `bindings.vocabularies`: every claims file they use, each **also** sent in `files`;
  - `business`: the `.bdl` (path and text) when there is one.

  Put the `snapshotId` in every brief's `State`. Re-import only when the ADL, a binding, a claims file or the BDL changes. Limits are reported in every result (2026-11-12: 16 live snapshots per account for 24 hours with no delete, 64 files, 192 KiB inline; larger packages go through `diagram_model_upload_begin`). A refused binding is evidence for the tech author (§3).
- **Label honestly.** Present each picture as its `delivery.kind` says. Only `verified-editable` is a verified deliverable and counts toward readiness (§9); a provisional proposal is for reaction, and a failed verification is diagnostic.
- **Save, then return.** Save the PNG from its signed link as soon as the run finishes, since signed links expire (`curl -o continuum/diagrams/<nn>-<slug>.png "<link>"`; if it has expired, re-read the run with `diagram_status` and use the link it returns), SVG and reports from `diagram_artifact`, and return them in `DIAGRAMS` (§8). The **architect** views a run itself (`diagram_status` returns the image to the caller) and gives the human the saved path and signed link; a picture a subagent received is not visible to the human.
- **No invented facts.** A diagram cannot make undeclared architecture true; report the missing semantics as a gap for its owner. Never substitute Mermaid, hand-drawn SVG or a generic image generator for a Continuum diagram unless the human explicitly asks.
- **Cost.** Image runs are rate-limited work on a free preview; reuse and revise runs rather than re-rendering, and never duplicate a render another agent already made.

## 12. Progress reporting

**When it applies.** In development-ready mode, or when the coordinator runs in the background. An intent-first conversation, even with a bounded delegation, needs none of it: the conversation and `HANDOFF.md` are the record. Specialists append events whenever their brief carries a `Run:` line.

A long run can last an hour or more, often in the background. The human must be able to see, at any moment and without interrupting it, what is happening, what is done, what is proven, and what is blocked. Two files carry that, outside the package so neither the guard nor the package build ever sees them:

```
.claude/progress/
  STATUS.md        coordinator only    current snapshot, overwritten
  events.jsonl     every agent         append-only log, one JSON object per line
  runs/<run>.md    coordinator only    the final STATUS.md of each earlier run
```

The coordinator is the architect, or whichever agent started the run and briefs the others. These files are not talking to the human (§2): specialists write events, never `STATUS.md`, and still return everything through §8. `events.jsonl` is the one exception to one writer per file (§1): agents only append whole lines and never edit or rewrite it. Repositories should ignore `.claude/progress/` in git.

**Run start.** The coordinator picks a run id `<yyyy-mm-ddThhmm>-<slug>` from the clock, moves any existing `STATUS.md` to `runs/<old run>.md`, writes a new `STATUS.md`, appends a `start` event, and puts `Run:` with the id in every brief (an extra line, which specialists copy into their events).

**Events.** One line per event, appended with a single command and a real timestamp, never an invented one:

```
printf '%s\n' "{\"ts\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"run\":\"<run>\",\"agent\":\"<name>\",\"event\":\"<kind>\",\"phase\":\"<phase>\",\"summary\":\"<one line>\"}" >> .claude/progress/events.jsonl
```

Optional fields: `status` (PASS / PARTIAL / BLOCKED), `evidence` (`tool — verdict`, only for a check that ran), `files` (paths changed). `kind` is one of:

| kind | when |
|---|---|
| `start` / `done` | an agent begins or returns its work (`done` carries its §8 `STATUS`) |
| `phase` | the coordinator moves the run to a new phase |
| `delegate` | the coordinator briefs an agent: who, and what for |
| `verdict` | a check ran: compile, apply, package build or check, test run, diagram run. Failures too |
| `decision` | a decision was proposed, or an agreement (§1 act 2) recorded |
| `question` | something needs the human: the question and its recommended default |
| `blocked` | work stopped: the exact error text and what would unblock it |
| `heartbeat` | 10 minutes have passed without another event: what is in progress now |

Specialists append at least `start`, one `verdict` per compiled or checked step, any `blocked`, and `done`.

**STATUS.md.** Rewritten by the coordinator on every `phase`, `delegate`, `done`, `verdict` that changes a row, `question` and `blocked`, and at least every 10 minutes while the run is active. Shape:

```
# <goal in one line>
Run: <run id> · Started <ts> · Updated <ts> · State: RUNNING | WAITING ON HUMAN | BLOCKED | DONE
Now: <what is happening at this moment, and which agent is doing it>

| Phase | Owner | State | Evidence |        one row per planned phase; state: pending, active, done, blocked, skipped
## Active delegations                      agent, task, started at
## Proven                                  only verdicts that ran: tool, verdict, revision (attestation, commit)
## Claimed, not yet checked                written but not compiled, built or run; UNVERIFIED
## Blockers                                exact error text, owner, what unblocks it
## Questions for the human                 question, why it matters, recommended default
## Decisions                               proposed and recorded, with ids
## Next                                    the next one to three steps
```

Never predict a result or report a check as passing before it ran. An `Updated` time older than about 15 minutes during a RUNNING state is itself a signal; a stalled run says so in `Now:` rather than looking alive. At the end, `STATUS.md` says DONE (or the level reached, §9) and points to `HANDOFF.md`.

**Push, sparingly.** When the coordinator runs as a background agent and has a `SendMessage` tool, it also sends the main session (`to: "main"`) one short message when a phase completes, when the run is blocked, when a question needs the human, and when it is done: one line on what happened, plus the path of `STATUS.md`. No other messages; the files carry the detail.

**Reading progress from the main session.** Read `STATUS.md` first; for recent detail, read the last 20 lines of `events.jsonl`, or the lines after the last time you reported. Never read a background agent's transcript or output file to find progress. Report what the files say as the run's own account, separate from anything you checked yourself on disk (file times, git, a compile you ran), and name which is which.
