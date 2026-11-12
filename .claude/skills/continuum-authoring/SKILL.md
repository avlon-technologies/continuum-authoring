---
name: continuum-authoring
description: Collaboratively author Continuum ADL, BDL, technology bindings, acceptance scenarios and diagrams to development readiness. Shared protocol, package layout, ownership, brief/return contracts and failure playbook for the continuum-* agents.
---
# Continuum authoring — shared protocol

Every continuum-* agent reads this file first. It defines the team, who owns which file, how work is handed over and handed back, where authoritative knowledge lives, and what to do when something fails. Agent definitions add only role-specific detail.

## 1. Ground rules

- **Tools judge, agents don't.** Legality comes from `continuum_compile` / `continuum_business_compile` / `continuum package build|check`, never from agent confidence. `ok: true` means the request was served; read the verdict (`answer.compiled`, `answer.exitCode`, `answer.attestation`; `verdict.compiled` on workspaces).
- **Never write syntax from memory.** Read the relevant guide or worked example (§3) before authoring a construct you have not compiled in this session.
- **Never invent facts.** No invented requirements, repository evidence, ids, technologies or tool results. Ids come from `continuum_mint_ids` (ADL) or are authored explicitly (BDL); existing ids are preserved byte-for-byte.
- **Never claim a check that did not run.** If a check cannot run, the artifact is **UNVERIFIED** or **NOT CHECKED**.
- **Never accept decisions.** Propose ADRs (`continuum_decision_propose`); acceptance, rejection and authority changes are the human's.
- **Do not implement application code.** The deliverable is the development package, not the product.
- **One owner per file** (§4). Do not edit a file you do not own; return the change you need instead.

## 2. The team and how it runs

| Agent | Role |
|---|---|
| `continuum-architect` | Coordinator. Talks to the human, frames the goal, briefs specialists, reconciles, owns readiness and the handoff. |
| `continuum-adl-author` | Semantic architecture (ADL): new models and `.adl-change` changes. |
| `continuum-bdl-author` | Business model (BDL), when the business semantics matter. |
| `continuum-tech-author` | Technology bindings and vocabulary claims, per Environment. |
| `continuum-acceptance-author` | Executable acceptance scenarios traced to the model. |
| `continuum-diagram-author` | The final diagram set: fidelity, consistency, communication. |

**The coordinator must be the main session** (`claude --agent continuum-architect`). Claude Code subagents cannot start other subagents, so a coordinator launched as a subagent cannot delegate. If you are the coordinator and the Agent tool is unavailable, say so and either do the specialist work yourself following the specialist definitions, or ask the human to restart with `--agent`.

**Specialists cannot talk to the human or to each other.** They finish their brief and return. Anything they need decided goes into `questions` in the return (§6), each with a recommended default; the coordinator asks the human or decides.

## 3. Where knowledge lives

All of this is served by the Continuum MCP server. Read with `continuum_knowledge` `mode: "read", uri: "<uri>"` (add `section` for one heading; `mode: "index", uri` lists sections; `mode: "search", query` searches both languages). MCP resource reads of the same URIs also work. Read **sections**, not whole specifications.

| Need | Read |
|---|---|
| Where is the answer? | `continuum://agent/catalogue` |
| How to behave | `continuum://agent/reasoning` |
| Authoring loop, smallest compiling start | `continuum-host://guide/agentic-authoring` |
| ADL syntax for a new model | `continuum://guides/adl-syntax-card`, then `continuum://guides/repository-to-source` §4 |
| Closed value sets (delivery, persistence, kinds…) | `continuum://guides/adl-value-sets` |
| Writing an `.adl-change` | `continuum://guides/change-cookbook`, `continuum://spec/change-source` |
| Recovering a model from code | `continuum://guides/architecture-recovery`, `continuum://guides/repository-to-model` |
| A diagnostic you received | `continuum_diagnostics`, then `continuum://guides/diagnostic-hints` |
| Reading a model correctly | `continuum://guides/reading-a-model` |
| BDL | `continuum://guides/bdl-consumer`, `continuum://bdl/spec/language-spec`, `continuum://bdl/spec/realization` |
| Package layout, bindings, scenarios, evidence | `continuum://guides/package-formats`, `continuum://guides/development-package` |
| CLI install and package lifecycle | `continuum://guides/client-install`, `continuum://guides/development-workflow` |
| Worked examples (compile as written) | `continuum://examples/index`; ADL: `continuum://examples/order-platform.adl`, `continuum://examples/async-order-fulfillment.adl`; change: `continuum://examples/architecture-change/README.md`; binding: `continuum://examples/order-platform.production.adl-binding.json`; full package: `continuum://examples/development-package/conversation-room/…`; BDL: `continuum://bdl/examples/index` |

Normative specifications (`continuum://spec/…`, `continuum://bdl/spec/…`) outrank guides; guides outrank examples; all outrank this file. If this file disagrees with the server, follow the server and report the discrepancy.

## 4. Package layout and ownership

Work in the target repository's `continuum/` directory (the package root). The layout is the one `continuum://guides/package-formats` defines; files marked DERIVED are written only by `continuum package build`, never by hand.

```
continuum/
  development-package.json            architect          the spec: name (kebab-case), environment, controls
  GOAL.md                             architect          intent; ends with the authority line
  HANDOFF.md                          architect          final status table, gaps, blockers, retrospective
  model/
    <system>.adl                      adl-author
    <system>.adl-manifest.json        adl-author         exactly one
    changes/<name>.adl-change         adl-author         change mode only
    <env>.adl-binding.json            tech-author        one per Environment
    <vocab>.vocabulary-claims.json    tech-author        one per vocabulary
  business/<system>.bdl               bdl-author         one document, no manifest
  business/<system>.realization.json  bdl-author         only when the correspondence is authored
  acceptance/scenarios/<name>.scenario.json   acceptance-author
  diagrams/README.md                  diagram-author     inventory: purpose, audience, snapshot, run, delivery.kind, status
  diagrams/<nn>-<slug>.{png,svg,md}   diagram-author
  gaps/<yyyy-mm-dd>-<slug>.md         whoever finds it   one gap per file; the architect triages
  decisions/                          human              ADRs are proposed via tools, accepted only by the human
  IMPLEMENTATION.md, BEHAVIOUR.md, README.md, PACKAGE.json,
  model/*.adl.txt, model/compile-proof.json, acceptance/README.md,
  acceptance/traces/, acceptance/run.mjs ...                    DERIVED
```

`acceptance/adapter.mjs` belongs to the implementation, not to authoring.

Keep files on disk as the source of truth. Native workspaces (`continuum_workspace_*`) are an optional scratchpad and are lost when the server scales down; if you use one, export after every compile you would not want to redo, and write the result back to disk.

## 5. Modes

Classify the work before authoring, and tell every specialist which mode applies.

| Mode | Input | ADL work | Key rule |
|---|---|---|---|
| **new** | goal, requirements, no model | author `model/<system>.adl` from the smallest compiling start | ids from `continuum_mint_ids` |
| **existing** | a model already in `continuum/model/` | none, or gap-filling edits | preserve every id |
| **change** | existing model + requested change | author `model/changes/<name>.adl-change` pinned to the current changeState | prove `apply(A, Δ) = B` with `continuum_apply`; bindings and scenarios target B |
| **recover** | code but no model | evidence-backed recovery | cite evidence; unknown is a gap, not a guess |

## 6. Brief and return contracts

**Brief** (coordinator → specialist). Every brief contains:

```
Mode:           new | existing | change | recover
Goal:           one or two sentences of the human's goal
Repository:     absolute path; package root (continuum/)
State:          model revision / attestation / changeState, or "none yet"
You own:        exact files you may create or edit
Read-only:      files you may read but not change
Decisions made: accepted choices you must respect (with source)
Task:           the specific outcome wanted from this specialist
Out of scope:   what not to do
Budget:         e.g. "at most 2 exploratory diagrams", "no CLI package build"
```

A specialist whose brief lacks a field it needs makes the most conservative assumption, records it under `assumptions`, and continues. Do not stop just to ask.

**Return** (specialist → coordinator). Every specialist ends with exactly this block:

```
STATUS:      PASS | PARTIAL | BLOCKED
CHANGED:     path — one-line summary (one per file)
EVIDENCE:    tool/command — verdict (e.g. continuum_compile — compiled, 0 errors, 2 warnings, attestation sha256:…)
GAPS:        id — confirmed | needs-evidence | unknown | deferred | out-of-scope — one line — gaps/ file if written
ASSUMPTIONS: what you assumed because the brief or the model did not say
QUESTIONS:   question — why it matters — recommended default
DIAGRAMS:    snapshotId / runId — delivery.kind — what it shows (or "none")
HANDOFF:     what the next specialist needs from you (ids, names, files)
```

## 7. Authoring protocol

1. **Discover.** Goals, existing `continuum/` content, implementation evidence, accepted decisions (`continuum_decision_list`), principles (`continuum_principle_list`), target environments, tool availability. Never invent requirements.
2. **Read knowledge** for the constructs you will touch (§3).
3. **Trace** goal → use case/behaviour → ADL element → binding → acceptance scenario. Every link that is missing is a gap.
4. **ADL**: write on disk, compile with `continuum_compile`, repair from diagnostics, query/inspect, repeat in small steps.
5. **BDL** when business semantics matter: compile with `continuum_business_compile`; reconcile with ADL through a Realization only when it is authored.
6. **Bindings** against the compiled ADL ids, one document per Environment; never transcribe `base.canonicalModel` by hand.
7. **Acceptance scenarios** whose every reference resolves against the compiled model.
8. **Package**: `continuum package build continuum` then `continuum package check continuum` (and `continuum package run` when an adapter exists). An MCP-only compile is not a package build.
9. **Diagrams**: specialists draw exploratory views as feedback; continuum-diagram-author owns the final set (§9).
10. **Report** PASS / PARTIAL / BLOCKED / NOT CHECKED with evidence for every artifact. Development-ready is a judgment supported by tool evidence, not a green compile.

## 8. Failure playbook

| Situation | Do this |
|---|---|
| A Continuum MCP server is not connected or not signed in | Stop that line of work. Return BLOCKED naming the server and the fix (`/mcp` to sign in; README setup). Never simulate a tool result. |
| The `continuum` CLI is missing | Continue with MCP compile; mark package build/check/run **NOT CHECKED** and the package **UNVERIFIED**. Name the install guide `continuum://guides/client-install`. |
| Compile fails | Resolve each diagnostic with `continuum_diagnostics` and `continuum://guides/diagnostic-hints`; fix the first error first. After three rounds without progress on the same diagnostic, stop and return it as a gap with the exact diagnostic id, location and what you tried. |
| A construct is not covered by the guides | Read the normative section (`continuum://spec/syntax`, `continuum://spec/metamodel`); if still unclear, model less and record a gap. Never guess syntax. |
| Model and code disagree | Recover/existing mode: the code is evidence of the implemented state; record the disagreement as a gap. Do not silently change either. |
| A human decision is needed | Return it under `QUESTIONS` with a recommended default; continue with work that does not depend on it. |
| A binding is stale (attestation moved) | `continuum package bind refresh continuum`; without the CLI, report it stale. Never edit `base.canonicalModel` by hand. |
| A scenario reference does not resolve | Fix the scenario if you own it; otherwise report the missing model element to the ADL author through the coordinator. |
| A diagram returns `verification-failed` or `editable-verification-failed` | Read `failure`/the check report via `diagram_artifact`; present it as diagnostic, not deliverable. Retry once with `diagram_render`; then report. |
| A long-running call returns `phase: "running"` | Poll `diagram_status`; recover a lost runId with `diagram_runs`. |

## 9. Continuum Diagram procedure

The coordinator, ADL, BDL, Technology and Diagram agents may all call the **configured Continuum Diagram MCP server** directly. Exploratory diagrams are decentralized; continuum-diagram-author owns **final set consistency and communication**, not every render. Agent definitions intentionally omit a restrictive `tools:` allowlist so Claude Code can expose the configured MCP operations.

The server's own tool descriptions are authoritative. If anything below disagrees with them, follow the server and report the discrepancy.

**Pin a model.** `diagram_model_import` with the real `*.adl-manifest.json` plus every document it names (relative paths and text). It returns a `snapshotId`, or diagnostics and nothing else. Optionally attach `bindings` (`*.adl-binding.json` + vocabularies, one `environment`) so technology claims are checked, and `business` (one `.bdl`) so business questions are answered from BDL. Packages over the inline limit: `diagram_model_upload_begin` → `diagram_model_upload_chunk` → `diagram_model_upload_finish`. Re-import after every change you want reflected; record the `snapshotId`.

**Ask a question.** `diagram_request` with exactly one of `snapshotId` / `modelId`, a full `question` and an `audience`. A named convention ("a C2 of…", "a use-case view of…") goes **in the question**; there are no `view`, `viewpoint`, `customView`, `domain` or `path` inputs. Optional: `context`, `presentation`, and `rendering` (`exploratory` / `polished`) only to override what the words imply. Exploratory (default) returns a provisional image proposal at once; polished continues into editable SVG, verification against the model, bounded correction and a communication evaluation. "As it exists" draws established architecture only; "what should it support" draws proposals, marked as proposed.

**Wait, look, say what it is.** Read `delivery.kind` (`provisional-image-proposal`, `verified-editable`, `editable-verification-failed`, `verification-failed`) and present the picture as exactly that. Read the brief (`diagram_artifact` → `selection-vN/brief.md`) for declared / inferred / speculative content, and for polished runs `render-vN/check-vN.md` and `render-vN/verification-reconstructed-vN.md`. Make sure the human can see the image; if the client did not display it, retrieve it or give the signed link.

**Iterate.** `diagram_revise(runId, notes)` for conversational changes; `diagram_render(runId)` for the polished, verified version of the current picture; `diagram_correct(runId, notes)` for concrete visual defects.

**Rules.** A diagram cannot make undeclared facts true: report modeling gaps to the responsible author. Every mutating call is paid work: reuse and revise runs, never duplicate renders across agents. Record snapshot IDs, run IDs, `delivery.kind` and file paths. Never substitute Mermaid, hand-drawn SVG or a generic image generator for a requested Continuum diagram unless the human explicitly asks.
