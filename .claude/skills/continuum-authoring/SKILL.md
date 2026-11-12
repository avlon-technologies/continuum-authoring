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

## Direct Continuum Diagram access for every agent

All four subagents may call the **configured Continuum Diagram MCP** directly. Agent definitions intentionally omit a restrictive `tools:` allowlist so Claude Code can expose the configured MCP operations; MCP installation and permissions remain external. Before rendering, discover the actual operation contract. Expected operations include `diagram_model_import` (compiled ADL snapshot), `diagram_request` (pin model and grounded selection), `diagram_render` (checked SVG/PNG preview), `diagram_status`, `diagram_revise`, `diagram_correct` and `diagram_artifact`. When using `customView`, query `diagram_custom_view_vocabulary` first.

Use the actual current ADL manifest and source files. A BDL file or binding JSON cannot be directly imported as ADL. Give `diagram_request` exactly one of `snapshotId` or `modelId`; then review selection, render and inspect preview/checks. A run finishing is not proof of visual correctness. Retrieve the actual image if the MCP client did not display it. Document snapshot/run IDs and deliverable paths. Diagram cannot draw undeclared architectural facts; resolve model gaps instead of fabricating edges.

Treat exploratory/polished as **rendering intent**, not assumed `diagram_render(mode=...)` syntax. Consult the installed server for supported configuration; avoid unsupported parameters. Avoid duplicate paid renders across agents and delegate view ownership through the coordinator.
