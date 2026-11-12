---
name: continuum-authoring
description: Shared protocol for the continuum-* agents - authority, communication, MCP-first tool routes, knowledge map, package layout and ownership, discovery, brief/return contracts, readiness levels, failure playbook and diagram rules. The single source of truth each agent definition refers to.
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
  2. *Agreement in the session*: the human's answer to a question or approval of a proposal. The architect records it in `GOAL.md` or `HANDOFF.md` with the date and the exact choice. It makes something accepted intent for this authoring work. It is not a lifecycle act.
  3. *Lifecycle acts* (approve, accept, adopt a transition): recorded only by the human with the CLI (`continuum icp approve` / `accept` / `adopt`; `continuum://guides/development-workflow` §3.5). Agents never perform or claim them.

  "Accepted" in this protocol means 2 unless 1 or 3 is named. Never present a proposal as accepted.
- **Do not implement application code.** The deliverable is the development package.
- **One writer per file** (§5). Ownership restricts writes, not critique. The one exception: the architect applies `GAP-UPDATES` to gap files other agents raised.

## 2. Team, communication and delegation

| Agent | Role | Writes |
|---|---|---|
| `continuum-architect` | Coordinator: the only agent that talks to the human; discovers, briefs, reconciles, imports diagram snapshots, shows results, owns readiness and the handoff. | spec, Goal, handoff, gap triage |
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
  development-package.json            architect          spec: kebab-case name, environment, controls, semantic.change
  GOAL.md                             architect          intent, ending with the authority line
  HANDOFF.md                          architect          status table, gaps, agreements, blockers, review, retrospective
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

`acceptance/adapter.mjs` belongs to the implementation. Decisions live in the Continuum Host, not in files: agents propose them with tools (§1) and never write a `decisions/` directory.

**Lifecycle.** Read `ledger.json` (or `continuum status`) before changing anything. If the ledger records an adopted change, its result is the current state. Editing authored files after adoption makes the package drift from the adopted checkpoint; that is expected while authoring. Moving authority is a lifecycle act (§1, act 3).

**Building.** `continuum package build` rewrites DERIVED files in place; when `development-package.json` names `semantic.change` (change mode) it requires `--out <dir>` (package-formats §1). Only the architect builds in place, after a round of specialists has returned. A specialist needing a build verdict copies `continuum/` to a scratch directory outside the repository and builds the copy, with `--out` in change mode. Specialists may run in parallel: a check that fails because of another owner's file is reported as theirs, not fixed.

## 6. Modes

| Mode | Input | ADL work | Key rule |
|---|---|---|---|
| **new** | goal, requirements, no model | author from the smallest compiling start | ids from `continuum_mint_ids` |
| **existing** | a model in `continuum/model/` (including one whose last change was adopted) | none, or gap-filling edits | preserve every id; current state = adopted result |
| **change** | existing model + requested change | `model/changes/<name>.adl-change` pinned to the current changeState | prove apply → B (§3); downstream artifacts target B; `semantic.change` set once the human agrees (§1, act 2) |
| **recover** | code, no model | evidence-backed recovery | every element cited (§3 recovery citations); unknown is a gap |

## 7. Experience-first discovery and research

Before formalizing ADL, the architect discovers the desired user and developer experience: 2–3 representative journeys (plus one critical exception where relevant), what must be observable, stated constraints, inferred assumptions, and the 1–3 unknowns that could change significant architecture. Compare the simplest viable approach with material alternatives using **keep/cut reasoning**, and say what does not need modeling. Batch only consequential questions for the human. Every agent challenges assumptions rather than transcribing them. This lives concisely in `GOAL.md`; it is not an extra phase or schema.

Brief `continuum-researcher` only when dated external evidence could materially change an architectural choice (research brief, §8). Its findings are evidence, not accepted intent.

## 8. Brief and return contracts

**Brief** (architect → specialist). Every field is required; write "none" rather than omit one.

```
Mode:           new | existing | change | recover
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

A **research brief** replaces `Task` with: `Decision:` the bounded question; `Alternatives:` including the simplest or do-nothing; `Constraints:`; `Sources:` acceptable kinds; `Stop when:` the stopping condition or time budget.

A **review brief** (§9 step 6) goes to a fresh `general-purpose` agent, which has not read this file, so the architect pastes the Return block below into it verbatim. `Read-only:` `GOAL.md` and the `continuum/` package; `Task:` explain the key journeys and behaviour as a developer would, then name the top three decisions you would still have to invent and anything contradictory; `Out of scope:` editing any file, reading the session's other output. It returns the explanation, then the block, with `CHANGED: none`, the invented decisions under `GAPS` and the contradictions under `CHALLENGE`.

If a needed field is missing, make the most conservative assumption, record it under `ASSUMPTIONS`, and continue.

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

## 9. Protocol and readiness

1. **Discover and challenge** (§7), and survey the repository, accepted decisions, principles and lifecycle state (§5).
2. **Read knowledge** for the constructs you will touch (§4).
3. **Trace** goal → journey → ADL element → binding → scenario; every missing link is a gap.
4. **Author in small compiled steps** by the routes in §3. ADL anchors the pins downstream, but BDL discoveries, early scenarios and exploratory diagrams may challenge it before it stabilizes. Re-pin affected artifacts after every model change (§10).
5. **Package** with the CLI when available (architect only, §5).
6. **Independent developer-readiness review** (review brief, §8). Route material gaps to owners and review again. Without a separate context, label it SELF-REVIEW.
7. **Report** every artifact as PASS / PARTIAL / BLOCKED / NOT CHECKED with its evidence.

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
| Review | independent review with no unresolved major decision | same |

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
| A declared Environment has no binding | Bind it, or record a gap that blocks Development-ready: the build fails on any declared Environment no document binds (package-formats §2). Never mark it deferred. |
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
