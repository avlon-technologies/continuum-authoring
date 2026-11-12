# Evaluating an authoring session

A template for judging whether the agents got a project to development-ready, and where they caused friction. Use it on your own projects; maintainers use it to improve the agent definitions.

**Goal:** in one human-guided session (`claude --agent continuum-architect`), make a real project's Continuum ADL, relevant BDL, technology bindings, acceptance scenarios and diagrams development-ready. Do not build the product.

## Run
1. Choose a real project and write the goal in two or three sentences before starting.
2. Start the coordinator and work naturally, intervening only on consequential decisions.
3. Keep the session transcript; it is the main evidence.

## Assess the artifacts
Record the route (MCP only, or MCP + CLI) and the readiness level the handoff claims (skill §9). For each of ADL, BDL, bindings, scenarios, diagrams and the development package, record PASS / PARTIAL / BLOCKED / NOT CHECKED, the tool or command that verified it, and the remaining gaps. Green ADL compilation alone is not developer readiness.

## Read what each subagent did
For every subagent call in the transcript, check:
- **Brief:** did the coordinator send every field of the brief template (skill §8)? What was missing?
- **Return:** did the specialist end with the return block? Are the `EVIDENCE` lines real tool verdicts?
- **Guessing:** where did it write syntax, ids or technologies without reading knowledge or querying the model?
- **Stalls and loops:** repeated failed compiles, repeated identical tool calls, paid diagram runs that were duplicated.
- **Ownership:** did anyone edit a file they do not own?

Turn each failure into one concrete change to an agent definition or the skill (an instruction, an example URI, a failure-playbook row), then re-run. The bar for a release is two consecutive clean runs at the highest readiness level the route allows (skill §9): **Development-ready** with the CLI (`continuum package check` passes), or **Authored — package UNVERIFIED** with MCP only (ADL and BDL compile, every scenario reference confirmed by query, bindings pinned to the current attestation, nothing claimed as built). In both cases every gap is labelled and there is no major friction.

## Experience discovery and independent consumer assessment

Record the strongest previously unseen assumption discovered, meaningful design alternatives considered, and the modeling work deliberately skipped. Ask a fresh, non-author agent to read only the package and GOAL.md and explain behavior and its top three implementation-significant missing decisions. Report independent versus SELF-REVIEW, plus whether any research changed a decision and the cost of gathering it. Never grade model validity as proven product fitness.

## Agent interview
Ask the coordinator at the end: What helped? What was confusing? Where did you have to guess? Which tools or documentation were missing? What are your **top 3 highest-impact fixes**? Would you judge the handoff development-ready, and what evidence supports that?

## Human interview
How much friction did you experience? Were interruptions appropriate? Are the diagrams useful and accurate? Could a developer implement without making major architectural decisions? What one improvement would matter most?
