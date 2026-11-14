---
name: continuum-authoring
description: Continuum authoring references. Load when authoring or updating BDL, Technology Bindings, decisions/ADRs, Principles or acceptance scenarios; writing under continuum/ (package layout, adopted vs proposed, lifecycle); producing development-ready output; or when a Continuum tool fails.
---
# Continuum authoring

Reference material for the `continuum-architect` partner, or anyone authoring Continuum artifacts. Nothing here is read before a conversation starts: load the one file the work needs, when it needs it. Live Continuum sources (specifications, guides, the servers' tool descriptions and results) outrank every file here; where one contradicts a live source, follow the source and report the contradiction.

| Reference | Load it when |
|---|---|
| [`references/authority-and-tools.md`](references/authority-and-tools.md) | you need the ground rules in full (the three authorities, the lifecycle and Host decision acts that are the human's, reading verdicts), the MCP and CLI tool routes and what each can verify, or where a piece of Continuum knowledge lives |
| [`references/package-and-lifecycle.md`](references/package-and-lifecycle.md) | a write touches `continuum/`: the package layout, an adopted package versus a proposed change, the proposal record, lifecycle and building |
| [`references/intent-first.md`](references/intent-first.md) | running or recording an intent-first session in detail: choosing the mode, the conversation steps, what preserves which intent, evidence classes, and the session-outcome shape of `GOAL.md`, `HANDOFF.md` or a proposal record |
| [`references/artifacts.md`](references/artifacts.md) | authoring an artifact: ADL (new, existing, change, recover, deriving a change by diff), BDL, Technology Bindings and claims, acceptance scenarios, research |
| [`references/diagrams.md`](references/diagrams.md) | a diagram is part of this protocol's output: snapshots, labels, saving, a final set (the procedure itself is the `continuum-diagram` skill) |
| [`references/development-ready.md`](references/development-ready.md) | development-ready output was explicitly requested: the protocol, cross-artifact consistency, adopted-package transitions, readiness levels, the handoff |
| [`references/failures.md`](references/failures.md) | a Continuum server, tool, compile, import or review fails or refuses |

Decisions (ADRs) and Principles are covered where they are preserved: [`references/intent-first.md`](references/intent-first.md) (which intent goes where) and [`references/package-and-lifecycle.md`](references/package-and-lifecycle.md) (where decisions live without a Host decision space); disposing of them is the human's ([`references/authority-and-tools.md`](references/authority-and-tools.md)).

Section numbers 1 to 9 are kept across the files, so a cross-reference names the file and the section.
