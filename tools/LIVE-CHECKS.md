# Live verification

`node tools/check.mjs` is static: it compares the documents with each other and with `tools/surface.json`, and never contacts a server. This procedure is the live half. Run it before each release and whenever the servers change, in Claude Code with both Continuum servers connected, then update `tools/surface.json` (`verified`, `tools`, `uris`, `sections`, `limits`, `liveProbes`) and rerun the static check.

1. **Surface.** List the tools whose names start with `continuum_` and `diagram_`; replace `tools`. Run `continuum_knowledge` with `mode: "index"`; replace `uris` with the documents the repository cites. For each guide in `sections`, run `index` with its `uri` and replace its section ids.
2. **Limits.** Call `diagram_models` and record its `limits` (snapshots, lifetime, files, inline size). Create a workspace with `continuum_workspace_create` and record its `lifecycle` (idle expiry, what loses it sooner); discard it.
3. **Routes.** With a small model in a workspace, re-run every probe in `liveProbes` and record the date and result:
   - compile in a workspace; `continuum_query` and `continuum_preview` with `workspace`;
   - `continuum_process_graph` with `workspace` (refused on 2026-11-12; if it now answers, update skill §2);
   - `continuum_apply` with `workspace`, `manifestPath`, `changePath` and a base64 `.adl-change` in `files`;
   - a `.bdl` created in the workspace, then `continuum_business_compile` with `workspace` and `artifact`;
   - when diagram quota allows, `diagram_model_import` with `bindings` (documents and vocabularies, each also in `files`), which has not yet been exercised.
4. **Contracts.** Re-read the guide sections the agent relies on and compare them with the instructions: `continuum://guides/package-formats` §1, §2 and §5, `continuum://guides/development-package` §2 and §4.5, `continuum://guides/development-workflow` §3.5, and the "Beyond the ADL" section of `continuum-host://guide/agentic-authoring`. A contradiction is fixed in the skill or the agent file, never by editing the record to match.
