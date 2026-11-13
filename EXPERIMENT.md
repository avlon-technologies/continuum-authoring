# Evaluating an authoring session

A template for judging a **development-ready** session (skill §9): whether the agents got a project to development-ready, and where they caused friction. For the default intent-first mode (skill §7), judge instead the decisions preserved, clarity, cumulative effort and usefulness to implementation, against a comparable session without the agents. Use it on your own projects; maintainers use it to improve the agent definitions.

## Intent-first session (default mode)
Run one real architecture conversation and record:
- **Decisions preserved:** each consequential decision, where it is preserved, and whether the human agreed.
- **Clarity:** what implementation can proceed with; what genuinely blocks, with an owner.
- **Evidence classification:** expectations marked verifiable, indirectly testable or human judgment; whether the few worth verifying are the right ones.
- **Challenges:** choices the agent questioned, whether it raised them before the decision was recorded, and whether that changed a decision.
- **Adopted files:** with an adopted package, confirm no adopted file changed (`git status`, `git diff`); only `model/changes/` may.
- **Investment:** elapsed time, agent and reviewer invocations, compile rounds and diagram runs, against a baseline of the same work without the agents.
- **Usefulness:** would the implementer, or the next change, use what was preserved?

The rest of this template is for development-ready sessions. **Goal:** in one human-guided session (`claude --agent continuum-architect`), make a real project's Continuum ADL, relevant BDL, technology bindings, acceptance scenarios and diagrams development-ready. Do not build the product.

## Run
1. Choose a real project and write the goal in two or three sentences before starting.
2. Start the coordinator and work naturally, intervening only on consequential decisions. Let the coordinator author directly and invoke specialists only when their bounded contribution demonstrably helps.
3. Keep the session transcript; it is the main evidence.

## Assess convergence
Record approximate numbers of specialist delegations, semantic edit loops, package rebuilds, repins, diagram snapshots and major defects identified before versus after the first baseline. Do not introduce mandatory multi-agent review cycles solely to make these metrics look good. Compare against a previous single-agent experience as an informal reference, not a controlled benchmark.

## Assess the artifacts
Record the route (MCP only, or MCP + CLI) and the readiness level the handoff claims (skill §9). For each of ADL, BDL, bindings, scenarios, diagrams and the development package, record PASS / PARTIAL / BLOCKED / NOT CHECKED, the tool or command that verified it, and the remaining gaps. Green ADL compilation alone is not developer readiness.

## Read what each subagent did
For every subagent call in the transcript, check:
- **Brief:** did the coordinator send every field of the brief template (skill §8)? What was missing?
- **Return:** did the specialist end with the return block? Are the `EVIDENCE` lines real tool verdicts?
- **Guessing:** where did it write syntax, ids or technologies without reading knowledge or querying the model?
- **Stalls and loops:** repeated failed compiles, repeated identical tool calls, paid diagram runs that were duplicated.
- **Ownership:** did anyone edit a file they do not own?

Turn each failure into one concrete change to an agent definition or the skill (an instruction, an example URI, a failure-playbook row), then re-run. For a release, seek repeatable end-to-end outcomes at the highest readiness level the route allows, with no unresolved major contradictions, all gaps labelled and tolerable user friction. Multiple clean runs can increase confidence, but do not create mandatory reviewer loops within a single run.

## Experience discovery and independent consumer assessment

Record the strongest previously unseen assumption discovered, meaningful design alternatives considered, and the modeling work deliberately skipped. Ask a fresh, non-author agent to read only the package and its intent record (`GOAL.md`, or on an adopted package the proposal record or the transition's `REASON.md`) and explain behavior and its top three implementation-significant missing decisions. Report independent versus SELF-REVIEW, plus whether any research changed a decision and the cost of gathering it. Never grade model validity as proven product fitness.

## Agent interview
Ask the coordinator at the end: What helped? What was confusing? Where did you have to guess? Which tools or documentation were missing? What are your **top 3 highest-impact fixes**? Would you judge the handoff development-ready, and what evidence supports that?

## Human interview
How much friction did you experience? Were interruptions appropriate? Are the diagrams useful and accurate? Could a developer implement without making major architectural decisions? What one improvement would matter most?
