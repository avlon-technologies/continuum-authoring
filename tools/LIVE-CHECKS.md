# Live verification — architecture-intent experiment

`node tools/check.mjs` is a **static** consistency check of the branch's agent roster, active instructions, required files, tracked Markdown links and canonical experiment paths. It does not validate architectural meaning or query hosted tools.

## Before the run
1. From `experiment/architecture-intent`, run `node tools/check.mjs` and resolve failures.
2. In a **fresh** Claude Code session, confirm `intent-orchestrator` and `intent-author` are discoverable; check no legacy project agent is present. User-global agents may still exist and are outside repository control.
3. Confirm the Continuum and Continuum Diagram MCP connections are available and authenticated. Consult live `continuum_knowledge` for current ADL/BDL/bindings/decisions/principles specifications and available tools.
4. Use `tools/surface.json` only as a **dated historical tool inventory**, not as current proof. Update it only after actual live verification; never fabricate results.

## During treatment
- Check the specialist can return consequential questions and the orchestrator can answer in a separate context without simulated approval.
- Confirm treatment author never reads the control architecture; use a fresh worktree and only the frozen Recall vision as product input.
- Compile/validate new ADL/BDL and check bindings/decisions/principles with available tools. Record actual verdicts and limitations.
- Render grounded diagrams if tools permit; distinguish provisional from verified.
- Confirm progress milestones and decision provenance are recorded.

## After treatment
- Freeze output before accessing control.
- Assemble two anonymized architecture-only packets and run separate independent reviewers with the same rubric and questions.
- Report artifact scores, material comprehension errors, change-impact reasoning, effort, limitations and final comparison verdict.

**Not verified by static checks:** live MCP functionality, Claude Code agent discovery, compiler legality, correctness of architecture, evaluator independence, or comparative outcomes. Do not claim these without running them.
