# Continuum authoring: failure playbook

Part of the `continuum-authoring` skill ([index](../SKILL.md)). Loaded when the work needs it.

## 9. Failure playbook

| Situation | Do this |
|---|---|
| A Continuum MCP server is not connected or not signed in | Stop that line of work; tell the human the server and the fix (`/mcp`, README). Never simulate a tool result. |
| A server refuses for rate or quota | Report BLOCKED with the server's message; do not retry in a loop. |
| The CLI is missing | Use the MCP routes (`authority-and-tools.md` §2); mark CLI-only rows NOT CHECKED; the ceiling is "Authored — package UNVERIFIED" (`development-ready.md` §8). |
| A tool call is denied by permissions | Do not retry it another way (a different shell, a full path, `npx`); say what was denied and continue with what is allowed. |
| Compile fails | Resolve with `continuum_diagnostics` and `continuum://guides/diagnostic-hints`, first error first. After three rounds without progress on one diagnostic, stop and record it as a gap with the id, location and attempts. |
| A construct is not covered by the guides | Read the normative section; if still unclear, model less and record a gap. |
| Model and code disagree | The code is evidence of the implemented state; record a gap, or propose a model change (`authority-and-tools.md` §1 authority 1); change neither silently, and never block the code on it. |
| A workspace is lost | Re-create it from the files on disk and recompile. |
| A call fails with errors unrelated to your change | Suspect the payload (`authority-and-tools.md` §2) and re-check before reporting a model defect. |
| The attestation moved (bindings stale) | On an adopted package: never refresh in place (`package-and-lifecycle.md` §4); bindings in the transition are pinned to B's attestation, and stale adopted pins are reported to the human. Otherwise, CLI: `continuum package bind refresh continuum`. MCP only: copy the new compile's `attestation` into each binding's `base.canonicalModel` with a script, never by hand, and keep the bindings UNVERIFIED. |
| A declared Environment has no binding | Intent-first: record it as open. Development-ready: bind it, or record a gap that blocks Development-ready (package-formats §2). |
| A scenario reference does not resolve | Fix the scenario, or record the missing model element as a gap. |
| Diagram import refused `too-many` | Live-snapshot quota; snapshots expire after 24 hours. Release a snapshot you created in this task (`continuum diagram release <id>`; `continuum diagram list` shows what is held); never release one you did not create unless the human asks. If none is yours, report BLOCKED and record the planned view so it can run later. |
| Diagram import too large for one call | Use `diagram_model_upload_begin` / `_chunk` / `_finish`. |
| A diagram run reports `verification-failed` or `editable-verification-failed` | Read the failure (`diagram_artifact`); retry once with `diagram_render`; then deliver it labelled diagnostic. It does not count toward readiness. |
| Research sources are stale or contradictory | Record sources, dates and the disagreement; recommend conservatively; never promote it to fact. |
| The review finds major unmade decisions | Resolve them with the human, or the result stays Partial until the human agrees to defer them (`authority-and-tools.md` §1 authority 2). |
| An instruction here contradicts a live source | Follow the live source (`authority-and-tools.md` §1) and report the contradiction. |
