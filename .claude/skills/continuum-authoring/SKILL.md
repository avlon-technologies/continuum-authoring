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
7. Build executable acceptance scenarios and validate a development package with CLI `continuum package realize`, `continuum package build`, `continuum package check` as supported. An MCP-only compile is not a package build.
8. Render Continuum native exploratory diagrams during modeling and polished diagrams for review. Do not substitute generated images silently.
9. Report PASS/PARTIAL/BLOCKED/NOT CHECKED, evidence source and blockers for every artifact. Development-ready is a quality judgment supported by tool evidence, not synonymous with green compilation. Ask only about consequential choices.

Never accept ADRs or modify delegated authority without explicit authorization. Never claim checks ran that did not run. Do not implement application code.
