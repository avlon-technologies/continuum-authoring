# Continuum Authoring — Vision

Make Continuum authoring feel like collaborating with a capable architecture partner: a human or orchestrator describes goals, constraints and intent; one Claude Code agent helps discover, challenge, decide and preserve the architectural intent that matters, and, on request, delivers development-ready Continuum architecture.

## Outcome
By default, the deliverable is **preserved architectural intent**: the consequential decisions, constraints and rationale, discovered in conversation and recorded in the Continuum artifacts that carry them, with what is verifiable distinguished from what needs human judgment. On explicit request, the deliverable is a **development-ready Continuum package** (with the CLI; MCP-only sessions reach *Authored — package UNVERIFIED*), not an implemented product.

## Why intent-first is the default
The earlier development-ready workflow could take more than 90 minutes where direct implementation took about 10, without demonstrably improving the product. Later verification experiments showed that a few well-chosen invariants (mutation authority, account isolation) catch meaningful defects ordinary tests miss, though those verifiers needed substantial earlier engineering. The conclusion is not that documentation is unnecessary or that every intent deserves a verifier: architectural reasoning should prioritize consequential decisions and evidence of value over exhaustive pre-implementation production. A real-agent trial on 2026-11-13 (per-principal usage quotas on an existing repository with an adopted package) supported this: one question round, eight agreed decisions preserved as a proven `.adl-change` and its proposal record, no adopted file touched, about 7 minutes of agent time.

## Why one agent
Earlier versions had a coordinator and six specialists (ADL, BDL, bindings, scenarios, diagrams, research), each with its own definition, brief and return contract. Integrated authoring by the coordinator was already the rule, and specialists had become optional advisers; the real-agent trial used none. The specialist files mostly repeated the shared protocol, and their per-artifact knowledge now lives in its references (`artifacts.md` §6), so the capabilities remain without the orchestration. The one thing a separate agent adds, a reviewer that has not seen the author's reasoning, is a built-in `general-purpose` subagent briefed by the protocol, not an installed agent.

## Principles
1. Human and AI collaborate as peers; ask about consequential trade-offs, not every minor choice.
2. Native Continuum semantics and tools are the authority on model legality; agent confidence is not proof.
3. One coherent architecture, authored in one head; independent review only where it changes the outcome.
4. Never fabricate repository evidence or claim a tool validated something it did not.
5. Keep explicit unknowns and decisions; distinguish proposals from accepted decisions, and adopted architecture from proposed change.
6. Decisions and adoption belong to the human or the orchestrator they authorize.
7. Optimize the human's experience and the value of what is preserved, not agent count, artifact volume or tool-call volume.

## Success
Intent-first: the decisions that matter are clear, preserved where future changes will see them, and reached at a cost proportionate to their value. Development-ready: a developer can proceed without inventing major architecture decisions; the handoff names remaining blockers and links to actual verification evidence.
