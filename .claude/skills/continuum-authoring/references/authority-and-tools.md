# Continuum authoring: authority, tool routes and knowledge

Part of the `continuum-authoring` skill ([index](../SKILL.md)). Loaded when the work needs it.

## 1. Ground rules and authority

- **Live Continuum sources are authoritative.** Normative specifications (`continuum://spec/…`, `continuum://bdl/spec/…`) outrank guides; guides outrank examples; the servers' tool descriptions and results are the truth about tools. All of them outrank these references. Where one contradicts a live source, follow the source and report the contradiction.
- **Legality is the tools' job; quality and fitness are judgment.** Keep three claims apart: *legality* (a compiler or package tool's verdict on a pinned revision), *architectural quality* (trade-offs, failure modes, simplicity), and *fitness / developer readiness* (the right product, implementable without inventing major decisions). A clean compile or attestation proves only the first. A smaller model may be the better answer.
- **Read verdicts, not `ok`.** `ok: true` means only that the request was served. ADL: `compiled` / `exitCode` / `attested`, `attestation`, `changeState` (workspaces: `verdict.compiled`, `verdict.attested`). BDL: `valid` and `ledger.completelyValidated`. Change: `status: applied`, `validity: valid`, `base`, `state`. CLI: exit code `0`.
- **Never write syntax from memory.** Read the guide or worked example (§3) before authoring a construct you have not compiled in this session.
- **Never invent facts.** No invented requirements, evidence, ids, technologies or tool results. ADL ids come from `continuum_mint_ids`; BDL ids are authored explicitly; existing ids are preserved byte-for-byte.
- **Never claim a check that did not run.** If it cannot run, the result is **NOT CHECKED** and the artifact **UNVERIFIED**. PASS means cited tool evidence passed, never your own judgment. Never build a workaround for a capability the platform lacks; record the gap (§2).
- **No verification verdicts of your own.** A verdict is what a tool that ran says (compiler, package build, Continuum verification, tests), reported with its trust model. Compilation establishes model legality, never implementation correctness. Current CLI verification assumes cooperative assessed code; never imply tamper resistance.
- **This protocol authors architecture, not application code.** Code belongs to authority 1 below.
- **Authority.** Three separate authorities; keep them apart:
  1. *Modifying application code* belongs to the developer and their assistant, and needs no Continuum artifact: no model change, transition or approval is a precondition for writing code. ADL does not authorize coding. A finding from code that the model is wrong, incomplete or silent is answered with a proposed model change (authority 2) or an explanation, recorded in the intent record (`package-and-lifecycle.md` §4). It never blocks the code, and it is never silently absorbed.
  2. *Proposing a model change* is open to anyone, as a draft: an `.adl-change`, a proposal record, a decision proposed with `continuum_decision_propose`. The deterministic tools validate it. The human's answer to a question or approval of a proposal in the session is *agreement*: record it in the intent record (`package-and-lifecycle.md` §4) with the date and the exact choice. It makes something agreed intent for this authoring work. It is not adoption and not a lifecycle act.
  3. *Adopting into the authoritative model* keeps its governance: compile, apply, the ICP and ledger acts, and the human's acceptance. The lifecycle acts (approve, accept, adopt a transition, and its dispositions reject, abandon, supersede, plus `continuum icp delete`, which destroys a transition, the initial `continuum package accept`, and `continuum ledger record`) are recorded only by the human with the CLI (`continuum icp approve` / `accept` / `adopt` / `reject` / `abandon` / `supersede` / `delete`; `continuum://guides/development-workflow` §3.5). Never perform or claim them. Disposing of a Host decision or principle (accepting, rejecting, superseding, revoking or delegating it) is equally the human's, by any route, unless current Host policy explicitly authorizes that action and scope for an agent; even then you tell the human and cite the policy. The routes are the MCP tools (`continuum_decision_accept` / `_reject` / `_supersede` / `_revoke`) and the CLI verbs (`continuum decision accept` / `reject` / `revoke` / `supersede` / `delegate` / `govern`; `continuum principle activate` / `approve` / `deny` / `reject` / `revoke` / `supersede` / `retire` / `delegate` / `govern`). The README's permission example denies these commands and tools as a backstop; it is not a security boundary, so these instructions still govern.

  "Agreed" means authority 2; "adopted" and "accepted" name authority 3 or a Host decision act. Never present a proposal as agreed, accepted or adopted when it is not.

## 2. Tool routes: MCP first, CLI optional

The Continuum MCP server is the primary route and needs nothing installed. The `continuum` CLI is optional and distributed through the Continuum package feed; when it is installed (`continuum --version` answers), it adds the operations marked CLI below. Both reach the same Host compiler, so their verdicts are equal evidence. **Status** records what was exercised live against the public servers on 2026-11-12.

**In a repository set up by `continuum install`** the CLI is present, and the `continuum` MCP server it configures is the *local bridge*: it reads paths on this machine (`manifestPath`, `packageDir`) and does not serve the hosted-only `continuum_workspace_*`, `continuum_principle_*` and `continuum_exception_*` tools. There, pass paths or use the CLI; the workspace routes below apply only to the hosted Continuum Architect server.

| Operation | MCP route | CLI route | Status |
|---|---|---|---|
| Read knowledge | `continuum_knowledge` (`index`, or `index` with `uri` for a section map; `search`; `read` with `uri` + `section`) | — | verified |
| Draft and compile ADL | `continuum_workspace_create` (manifest + documents as plain text), `continuum_workspace_edit`, `continuum_workspace_compile` | `continuum compile <manifest> --state --json` | verified |
| Query and behaviour preview | `continuum_query` and `continuum_preview` with `workspace: <workspaceId>`. `continuum_preview` returns the causal trace from every entry message, declared causal closure, and the model's silences (undeclared reactions, missing correlation) | `continuum preview` | verified |
| Causality between two messages | `continuum_process_graph` refused every query form at stage `input` ("one of trace, paths, impact, dependencies or explain is required"), on the hosted server and, on 2026-11-14, on the local bridge too; use `continuum_preview` and say the process graph was unavailable | `continuum compile <manifest> --trace\|--impact\|--dependencies` is refused the same way (CLI 0.36.3); `continuum preview` works | **not usable on any route** |
| Validate and apply an `.adl-change` | `continuum_apply` with `workspace: <model's workspaceId>`, `manifestPath`, `changePath`, and `files: { "<change>.adl-change": <base64> }` | `continuum apply <manifest> <change> --emit-source <dir>` | verified (`applied`, base and result state) |
| Derive a change between two states | `continuum_diff` with both states as payloads | `continuum diff <A-manifest> <B-manifest> --out <dir>` (`artifacts.md` §6) | CLI verified 2026-11-13 (`verified true`); MCP not exercised |
| Compile and inspect BDL | `continuum_workspace_edit` `create-document` `<name>.bdl` (beside the draft, not in the manifest), then `continuum_business_compile` / `_inspect` with `workspace` and `artifact: "<name>.bdl"`; or send the `.bdl` in `files` as the host guide shows | `continuum business compile\|inspect <file>` | workspace route verified |
| Recovery citations | `continuum_workspace_edit` takes `evidence` (citations) and `subjects` per edit; `continuum_workspace_inspect` reports what is cited. The host verifies nothing | `continuum evidence init` / `suggest` / `refresh` / `check` (writes `evidence.json`) | `evidence.json` is **CLI only** |
| Current lifecycle state | read `continuum/ledger.json` (its `current` entry) | `continuum status`, `continuum icp state` | file read |
| Decisions and principles | `continuum_decision_list` / `_show` / `_propose` (others need §1 authority); `continuum_principle_list` / `_show` / `_check` | — | tools present, not exercised |
| Diagrams | Continuum Diagram server (`diagrams.md` §7) | — | verified (subject to the snapshot quota) |
| Bindings and claims: validate | **None on the Architect server.** Partial: a diagram import with bindings (`diagrams.md` §7) compiles them against the model and refuses an invalid or stale one | `continuum package realize`, `bind refresh`, `build` | **platform gap**; import route not exercised |
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

**Choosing the route.** When the CLI is installed, use it for every operation on an existing model: compile, `diff`, `apply`, `preview`. It reads the model from disk, so nothing is retyped or re-encoded; the MCP route sends the whole manifest and every document with each workspace creation, and base64 for `continuum_apply`, which costs context on every round and invites payload errors on a large model. The CLI still sends the content to the hosted compiler: choosing it changes how files travel, not where they are processed. Use MCP for knowledge, `continuum_mint_ids`, decisions and principles, diagrams, and for everything when there is no CLI. A small new model can go either way.

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
| Diagrams of any view | the Continuum Diagram server (`diagrams.md` §7); its tool descriptions are the procedure |
| Worked examples (compile as written) | `continuum://examples/index` and the full package under `continuum://examples/development-package/conversation-room/` |
