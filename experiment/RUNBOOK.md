# Runbook — two-agent matched comparison

## Start
Run from `avlon-technologies/continuum-authoring` on branch `experiment/architecture-intent`. The main Claude Code session is the **orchestrator**, acting as simulated human authority for this experiment only. The project subagent `continuum-intent-author` is the architecture specialist. Confirm the subagent is available before starting; do not silently substitute another agent.

Use the Recall vision from `avlon-technologies/ai-recall` at frozen commit `e1caf64c6ec29b78c93102d12191e062d0eae6e7`. Do not read the original architecture during treatment authoring. Do not use this repository's old completeness-oriented agent instructions as treatment optimization goals; this runbook and subagent contract govern the experiment.

## Main-session launch prompt
> Act as the simulated human architecture authority (orchestrator) for the architecture-intent experiment. Read experiment/README.md, experiment/RUNBOOK.md and experiment/QUALITY-RUBRIC.md. Obtain Recall VISION.md from the frozen baseline commit. Delegate architectural discovery and authoring to continuum-intent-author, not the existing completeness-oriented agents. Ask it for an initial architectural hypothesis and up to three consequential questions; answer, challenge and approve or delegate choices through focused dialogue. Capture only consequential intent in ADL, BDL, technology bindings, decisions, principles and useful Continuum diagrams. Report meaningful progress and blockers. Write fresh outputs to experiment/runs/01/, never the control. After freeze, perform blinded matched evaluation against the original package. Do not build the application.

## Milestones and progress
Report (1) start and constraints; (2) first interpretation and material unknowns; (3) important decisions; (4) first coherent model and deliberate omissions; (5) validation results and independent interpretation; (6) comparison and verdict. Updates should be short: **Now / Established / Next / Risks / Evidence**. After a prolonged period without progress, report the stall rather than manufacture a completion percentage. Record measured elapsed time if available.

## Evaluation
- Freeze control at `e1caf64c6ec29b78c93102d12191e062d0eae6e7`, and treatment at the completed run commit.
- Build architecture-only, anonymized evaluation packets from each. Include the same frozen vision. Exclude authoring dialogue, self-evaluations, agent goals and product/UX/implementation prose.
- Give each packet to a fresh independent reviewer with identical tasks and rubric. If the reviewer has seen both arms, disclose that the comparison is not blind.
- Ask reviewers to explain the architecture and trust boundaries; identify five consequential invariants; trace extraction → proposal → confirmation → conflicting evidence; analyze replacement of Gmail with another provider; identify contradictions, unjustified choices and needless elements.
- Score each artifact on its own merits and the integrated model on intent fidelity, comprehension, evolution reasoning, coherence and information economy. Do not punish length alone.
- Compare observed authoring cost, questions, rework and tool friction, marking unknown measurements UNKNOWN. Report top three material defects per arm, comparative outcome and uncertainty.

## Guardrails
No application implementation, deployment, merge, external publishing or paid experiments. The simulated orchestrator may decide within this experiment, but does not grant approval on the user's behalf for production changes. Compiler success is not evidence of architectural intent fidelity.
