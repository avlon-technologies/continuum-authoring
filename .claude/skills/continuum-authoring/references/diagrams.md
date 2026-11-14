# Continuum authoring: diagrams

Part of the `continuum-authoring` skill ([index](../SKILL.md)). Loaded when the work needs it.

## 7. Diagrams

The Continuum Diagram server's tool descriptions are the procedure (import, request, poll, revise, render, correct). This section adds only what this protocol needs.

- **Draw only when it earns its place.** Draw when the human asks, or when a picture genuinely helps the current discussion; a model request alone is not a diagram request. Never run `continuum diagram push` (or import a snapshot) unless the human asks for persistence or publication, or has authorized it.
- **Discover, do not assume.** Check what is available (`diagram_models`, or `continuum diagram list`) rather than assuming the Diagram server is configured; it is optional. When it is unavailable and that matters to the request, say so plainly.

- **One snapshot per model revision.** One `diagram_model_import` carries the `manifest` and, in `files`, every document it names; `bindings.documents` (pinned to the current attestation) and `bindings.vocabularies`, each also in `files`; and `business` (the `.bdl`) when there is one. Re-import only when the ADL, a binding, a claims file or the BDL changes. Limits are reported in every result (2026-11-12: 16 live snapshots per account for 24 hours, 64 files, 192 KiB inline; larger packages go through `diagram_model_upload_begin`). Release a snapshot you created when the task is finished (`continuum diagram release <id>`; `continuum diagram list` shows what is held; the `continuum-diagram` skill has the rules). A refused binding is evidence about the binding (`authority-and-tools.md` §2).
- **Label honestly.** Present each picture as its `delivery.kind` says. Only `verified-editable` is a verified deliverable and counts toward readiness (`development-ready.md` §8); a provisional proposal is for reaction, and a failed verification is diagnostic.
- **Look before showing.** View each run with `diagram_status`, check it matches its label, then give the human the title, what it answers, its label, the saved path and the signed link.
- **Save promptly.** Signed links expire: save the PNG (`curl -o continuum/diagrams/<nn>-<slug>.png "<link>"`, or on an adopted package into `model/changes/<name>.diagrams/`; if expired, re-read the run with `diagram_status`), and SVG and reports from `diagram_artifact`.
- **A final set** (development-ready): plan the minimum views (audience, the question each answers, what must be visible), render all on one snapshot as polished deliverables, record each in `diagrams/README.md` (view, audience, question, label, path, link, and planned or blocked views with what they need), and check fidelity (every depicted fact is in the model), consistency across views, coverage and readability.
- **No invented facts.** A diagram cannot make undeclared architecture true; report the missing semantics as a gap. Never silently substitute Mermaid, hand-drawn SVG or a generic image generator for a requested Continuum Diagram rendering: say it is unavailable and ask. When no rendering engine was named and a simple Mermaid sketch is appropriate, it is acceptable, labelled as not from Continuum Diagram.
- **Cost.** Image runs are rate-limited work on a free preview; revise and reuse runs rather than re-rendering.
