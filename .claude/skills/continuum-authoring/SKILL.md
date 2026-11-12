---
name: continuum-authoring
description: Collaboratively author Continuum ADL, BDL, technology bindings, acceptance scenarios and diagrams to development readiness.
---
# Authoring protocol

1. Discover goals, existing models, implementation evidence, accepted decisions, principles, target environment and pinned tool versions. Never invent requirements.
2. Read Continuum knowledge and installed authoring documentation, especially `continuum-host://guide/agentic-authoring`, `continuum://guides/bdl-consumer`, `continuum://guides/development-package` and the real binding examples. Normative pinned specs outrank agent guesses.
3. Track goal -> use case/behavior -> ADL element -> technology binding -> acceptance evidence. Record confirmed, needs-evidence, unknown, deferred and out-of-scope gaps.
4. Author ADL with native Continuum workspaces where available. Edit narrowly; compile, inspect and export. Workspace state is ephemeral and cannot authorize architectural decisions.
5. Author/compile BDL when applicable. Ensure semantic reconciliation with ADL and acceptance scenarios.
6. Author environment-specific technology bindings against existing ADL identities. Use documented syntax only.
7. Build executable acceptance scenarios and validate a development package with CLI `continuum package realize`, `continuum package build`, `continuum package check` as supported. An MCP-only compile is not a package build. If the CLI is not installed, mark package artifacts **UNVERIFIED**.
8. Let ADL, BDL and Technology authors create native Continuum exploratory diagrams directly as feedback. Once the model stabilizes, have continuum-diagram-author plan and review a minimal, coherent final diagram set: grounded semantics, cross-view consistency, audience, coverage, readability and actual native artifacts/check evidence. Feed gaps back to the responsible model author. Never substitute generated images silently.
9. Report PASS/PARTIAL/BLOCKED/NOT CHECKED, evidence source and blockers for every artifact. Development-ready is a quality judgment supported by tool evidence, not synonymous with green compilation. Ask only about consequential choices.

Never accept ADRs or modify delegated authority without explicit authorization. Never claim checks ran that did not run. Do not implement application code.

# Continuum Diagram procedure (shared by every agent)

The coordinator, ADL, BDL, Technology and Diagram agents may all call the **configured Continuum Diagram MCP server** directly. Exploratory diagrams are decentralized; continuum-diagram-author owns **final set consistency and communication**, not every render. Agent definitions intentionally omit a restrictive `tools:` allowlist so Claude Code can expose the configured MCP operations; MCP installation and sign-in are the user's setup (see the README).

The server's own tool descriptions are authoritative. If anything below disagrees with them, follow the server and report the discrepancy.

## 1. Pin a model
- `diagram_model_import`: send the real `*.adl-manifest.json` plus every document it names, as relative paths and text. The server compiles those exact bytes and returns a `snapshotId` (or compiler diagnostics and nothing else). Optionally attach:
  - `bindings`: `*.adl-binding.json` documents (and vocabularies) for one environment, so technology claims on the diagram are checked against them;
  - `business`: one `.bdl` document, so business questions are answered from BDL semantics.
- Packages over the inline limit: `diagram_model_upload_begin` → `diagram_model_upload_chunk` → `diagram_model_upload_finish` (declare every file's byte length, sha256 and chunk count first).
- `diagram_models` lists server-bundled models; use a `modelId` only when it is confirmed to match the intended revision.
- Re-import after every ADL/BDL/binding change you want reflected. Record the `snapshotId` and source revision.

## 2. Ask a question
`diagram_request` with exactly one of `snapshotId` / `modelId`, plus:
- `question`: the one question the picture must answer, in full. A named convention ("a C2 of…", "a use-case view of…", "a sequence of checkout") belongs **in the question**. There are no `view`, `viewpoint`, `customView`, `domain` or `path` inputs; the server refuses them.
- `audience`: who reads it, in plain words.
- Optional: `context` (the conversation, for interpretation only), `presentation` (how it should read), `rendering` (`exploratory` / `polished`, an override only when the person's words would suggest the other).

The composer infers delivery: **exploratory** (default) returns a provisional image proposal at once; **polished** continues into editable SVG reconstruction, verification against the pinned model, bounded correction and a communication evaluation. Grounding is separate: "as it exists" draws only established architecture; "what should it support" draws proposals, marked as proposed.

## 3. Wait, look, and say what it is
- Calls wait up to ~45–55 s. If you get `{runId, phase: "running"}`, poll `diagram_status` until finished; `diagram_runs` recovers a lost runId.
- Read `delivery.kind`: `provisional-image-proposal`, `verified-editable`, `editable-verification-failed`, `verification-failed`. Present the image as exactly that. A finished run is not proof of correctness.
- Read the companion brief (`diagram_artifact` → `selection-vN/brief.md`) for what is declared, inferred or speculative; for polished runs, `render-vN/check-vN.md` and `render-vN/verification-reconstructed-vN.md`.
- Make sure the person can actually see the picture. If the client did not display it, retrieve it with `diagram_artifact` or give the signed link.

## 4. Iterate
- `diagram_revise(runId, notes)`: a conversational change ("simplify it", "show the proposed parts"); recomposes over the same pinned model.
- `diagram_render(runId)`: the polished, verified, editable version of the current picture, without recomposing.
- `diagram_correct(runId, notes)`: one SVG correction pass for concrete visual defects in a rendered diagram.

## Rules
- Diagram cannot make undeclared facts true. When a view needs semantics the model lacks, report a modeling gap to the responsible author rather than drawing it as established.
- Every mutating call is paid work. Avoid duplicate renders across agents; reuse and revise runs instead of starting over.
- Document snapshot IDs, run IDs, `delivery.kind` and deliverable paths/links in the handoff.
- Never substitute Mermaid, hand-drawn SVG or a generic image generator for a requested Continuum diagram unless the human explicitly asks.
