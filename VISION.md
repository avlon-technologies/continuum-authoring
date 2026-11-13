# Continuum Authoring — Vision

Make Continuum authoring feel like collaborating with a capable architecture partner: a human describes goals, constraints and intent; a coordinating Claude Code agent helps discover, challenge and preserve the architectural intent that matters, and, on request, works with specialized authors to deliver development-ready Continuum architecture.

## Outcome
By default, the deliverable is **preserved architectural intent**: the consequential decisions, constraints and rationale, discovered in conversation and recorded in the Continuum artifacts that carry them, with what is verifiable distinguished from what needs human judgment (skill §7). On explicit request, the deliverable is a **development-ready Continuum package** (with the CLI; MCP-only sessions reach *Authored — package UNVERIFIED*), not an implemented product: Goal, ADL, BDL when relevant, technology bindings, executable acceptance scenarios and useful Continuum diagrams.

## Principles
1. Human and AI collaborate as peers; ask about consequential tradeoffs, not every minor choice.
2. Native Continuum semantics and tools are the authority on model legality; agent confidence is not proof.
3. One coherent architecture. The primary agent authors the integrated solution; specialists are invoked only for bounded challenge or independent work that improves it.
4. Never fabricate repository evidence or claim a tool validated something it did not.
5. Keep explicit unknowns and architecture decisions; distinguish proposals from accepted decisions.
6. Authoring specialists draw exploratory native Continuum diagrams while reasoning; in development-ready mode a dedicated Diagram Agent owns final cross-view accuracy, completeness, consistency and communication.
7. Optimize human experience, not agent count or tool-call volume.

## Design philosophy
Start from the experience and challenge the assumptions before formalizing the semantic model. Human and agent can each originate or contest ideas; modeling must earn its cost. Research unfamiliar, consequential choices on demand. Never equate successful compilation or attestation with architecture quality or product fitness. In development-ready mode, a bounded fresh independent review challenges the first meaningful integrated draft and a final fresh review checks developer readiness; neither substitutes for the architect's integrated reasoning.

## MVP
One end-to-end Architecture Agent, with optional ADL, BDL, technology-binding and acceptance-scenario advisers and a Diagram Agent responsible for the coherent final diagram set. Specialists are not mandatory production stages. A shared skill defines the team's protocol; the servers' tool descriptions define tool procedures. Use an existing repo as a target; do not invent an example product or write implementation code unless separately requested.

## Success
Intent-first: the decisions that matter are clear, preserved where future changes will see them, and reached at a cost proportionate to their value. Development-ready: a developer can proceed without inventing major architecture decisions; the handoff names remaining blockers and links to actual verification evidence. Record the human's subjective experience, interruptions and biggest friction points.
