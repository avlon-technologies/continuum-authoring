# Evaluating an authoring session

A template for judging a `continuum-architect` session on a real project. Use it on your own projects; maintainers use it to improve the agent and its protocol. Keep the session transcript; it is the main evidence.

## Intent-first session (default mode)
Run one real architecture conversation and record:
- **Decisions preserved:** each consequential decision, where it is preserved, and whether the human agreed.
- **Clarity:** what implementation can proceed with; what genuinely blocks, with an owner.
- **Evidence classification:** expectations marked verifiable, indirectly testable or human judgment; whether the few worth verifying are the right ones.
- **Challenges:** choices the agent questioned, whether it raised them before the decision was recorded, and whether that changed a decision.
- **Adopted files:** with an adopted package, confirm no adopted file changed (`git status`, `git diff`); only `model/changes/` may.
- **Investment:** elapsed time, tokens, tool calls, subagent invocations, compile rounds and diagram runs, against a baseline of the same work without the agent where one exists.
- **Usefulness:** would the implementer, or the next change, use what was preserved?

## Development-ready session (explicit request)
**Goal:** in one human-guided session, make a real project's Continuum ADL, relevant BDL, technology bindings, acceptance scenarios and diagrams development-ready. Do not build the product.

- **Route and level:** MCP only or MCP + CLI, and the readiness level the handoff claims (`development-ready.md` §8).
- **Artifacts:** for each of ADL, BDL, bindings, scenarios, diagrams and the package, PASS / PARTIAL / BLOCKED / NOT CHECKED, the tool or command that verified it, and the remaining gaps. Green ADL compilation alone is not developer readiness.
- **Convergence:** semantic edit loops, package rebuilds, repins and diagram snapshots, and the major defects found before versus after the review.
- **Review:** was the reviewer fresh and given only the package and intent record? Did its findings change the package? Report independent versus SELF-REVIEW.
- **Agent behaviour:** where it wrote syntax, ids or technologies without reading knowledge or querying the model; repeated failed compiles or identical tool calls; duplicated paid diagram runs; any edit to an adopted file or any lifecycle act attempted.

## Interviews
- **Agent:** What helped? What was confusing? Where did you have to guess? Which tools or documentation were missing? Your top three fixes?
- **Human:** How much friction? Were interruptions appropriate? Are the diagrams useful and accurate? Could a developer implement without major architectural decisions? The one improvement that would matter most?

Turn each failure into one concrete change to the agent file or the protocol, then re-run.
